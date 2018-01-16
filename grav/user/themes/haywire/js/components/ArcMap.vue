<script>
    import _throttle from 'lodash/throttle'
    // the EsriLoader that is responsible for loading the ESRI map modules
    import * as EsriLoader from 'esri-loader'
    // the ArcModelClass that defines the static query methods
    import ArcModelClass from '../models/arcModel';
    // the vue mixin to fetch grav config from meta attributes
    import GravConfigMixin from './mixins/GravConfig.vue';
    // the property field definitions for the arcgis feature layer
    import { PROPERTY_FIELDS } from "../models/propertyModelJSON";
    // the model definition for a arc gis property feature
    import PropertyModel from '../models/propertyModel';

    // a reusable component that takes a collection of models with geometries and renders them into a esri map
    export default {
        mixins: [GravConfigMixin],

        props: [
            'collection', // the collection that is providing the models to render into the map
            'showTooltip'
        ],

        // runs when component is attached to the DOM
        async mounted() {
            let _this = this;

            _this.gravConfig = await _this.getGravConfig(_this.gravConfig);

            _this.retargetEsriScroll();

            await _this.initializeEsriMap();
        },

        data() {
            return {
                Extent: null, // esri module
                FeatureLayer: null, // esri module
                Graphic: null, // esri module
                Map: null, // esri module
                MapView: null, // esri module
                Point: null, // esri module
                SimpleMarkerSymbol: null, // esri module
                defaultBasemap: 'hybrid',
                defaultCenter: {
                    latitude: 38.8976763,
                    longitude: -77.0365298
                }, // default center for an empty map
                defaultZoomEmpty: 18, // default zoom level for a empty map
                defaultZoomSingleResult: 18, // default zoom level for a map with a single result
                extent: null, // the current map extent / zoom
                featureLayer: null, // the current featureLayer
                featureServer: {url: null}, // the featureServer initialization object
                graphics: [], // the current graphics being rendered
                gravConfig: {
                    basemap: null,
                    centerLatitude: null,
                    centerLongitude: null,
                    centerZoomEmpty: null,
                    centerZoomSingleResult: null
                },
                map: null, // the current map
                mapNodeSelector: null, // the id of the map container
                mapView: null, // the current map view,
                mapZindex: 1,
                markerColors: [
                    [203, 207, 125, 1], // yellow
                    [132, 127, 168, 1], // purple
                    [168, 127, 126, 1], // red
                    [151, 151, 151, 1], // grey
                    [143, 168, 127, 1], // green
                    [95, 42, 42, 1], // maroon
                ]
            };
        },

        computed: {
            basemap() {
                let _this = this;
                return _this.gravConfig.basemap ? _this.gravConfig.basemap : _this.defaultBasemap;
            },
            center() {
                let _this = this;
                return _this.gravConfig.centerLatitude && _this.gravConfig.centerLongitude ? {
                    latitude: _this.gravConfig.centerLatitude,
                    longitude: _this.gravConfig.centerLongitude
                } : _this.defaultCenter;
            },
            mapStyles() {
                let _this = this;
                return {
                    'z-index': _this.mapZindex
                }
            },
            zoomEmpty() {
                let _this = this;
                return _this.gravConfig.centerZoomEmpty ? _this.gravConfig.centerZoomEmpty : _this.defaultZoomEmpty;
            },
            zoomSingleResult() {
                let _this = this;
                return _this.gravConfig.centerZoomSingleResult ? _this.gravConfig.centerZoomSingleResult : _this.defaultZoomSingleResult;
            }
        },

        watch: {
            // watch the collection for changes and rerender the map with the new models
            async collection() {
                let _this = this;
                await _this.renderMap(
                    _this.collection,
                    _this.map,
                    _this.MapView,
                    _this.center,
                    _this.zoomEmpty,
                    _this.zoomSingleResult
                );
            },
            async map() {
                let _this = this;
                await _this.renderMap(
                    _this.collection,
                    _this.map,
                    _this.MapView,
                    _this.center,
                    _this.zoomEmpty,
                    _this.zoomSingleResult
                );
            }
        },

        methods: {
            // async function that creates the tooltip dom
            async createMarkerContent(model) {
                let _this = this,
                    tooltipContainer = _this.parseHTML(`<div class="arcmap-tooltip-container"></div>`),
                    content = [];

                if (model.imageUrl) content.push(`<img src="${model.imageUrl}" />`);
                if (model.address) content.push(`<p>${model.address}</p>`);
                if (model.subdivision) content.push(`<p>${model.subdivision}</p>`);
                if (model.totalPrice) content.push(`<p>${_this.$options.filters.currency(model.totalPrice)}</p>`);
                if (model.acres) content.push(`<p>${model.acres} Acres</p>`);
                if (model.type) content.push(`<p>${model.type}</p>`);
                if (model.status) content.push(`<p>${model.status}</p>`);
                if (model.pricePerSqft) content.push(`<p>${_this.$options.filters.currency(model.pricePerSqft)} PSF</p>`);

                // reduce the content array into a dom container and return it
                return content.reduce((accumulator, elementHTML) => {
                    if (accumulator && accumulator.appendChild) {
                        accumulator.appendChild(_this.parseHTML(elementHTML));
                    }
                    return accumulator;
                }, tooltipContainer);
            },
            async initializeEsriMap() {
                let _this = this;
                // the basemap styles being used in the map
                const basemap = _this.basemap,
                    // default options for EsriLoader
                    options = {},
                    // the Esri module dependencies for the map
                    modules = [
                        "esri/geometry/Extent", // set the map extent / zoom on load
                        "esri/layers/FeatureLayer", // Esri FeatureLayer interactions with the FeatureServer
                        "esri/Graphic", // Graphic rendering
                        "esri/Map", // Map rendering
                        "esri/views/MapView", // MapView for adding features to map
                        "esri/geometry/Point", // Point rendering
                        "esri/symbols/SimpleMarkerSymbol" // Symbol rendering
                    ];
                // id of the map container
                _this.mapNodeSelector = "mapNode";
                // fetch Esri Modules
                await EsriLoader.loadModules(modules, options)
                    .then(([Extent, FeatureLayer, Graphic, Map, MapView, Point, SimpleMarkerSymbol]) => {
                        // Set the fetched modules to component properties so that Vue methods can access them
                        _this.Extent = Extent;
                        _this.FeatureLayer = FeatureLayer;
                        _this.Graphic = Graphic;
                        _this.Map = Map;
                        _this.MapView = MapView;
                        _this.Point = Point;
                        _this.SimpleMarkerSymbol = SimpleMarkerSymbol;
                    });
                // initialize the map
                _this.map = new _this.Map({ basemap: basemap });
                // set the feature server url
                _this.featureServer.url = ArcModelClass.getArcGISFeatureServerUrl();
                // initialize the feature layer
                _this.featureLayer = new _this.FeatureLayer(_this.featureServer);
                // add the featureLayer to the map
                _this.map.layers.add(_this.featureLayer);
            },
            async renderMap(collection, map, MapView, defaultCenter, zoomEmpty, zoomSingleResult) {
                let _this = this;
                // if collection is defined and it contains models
                if (collection && map && MapView) {
                    // reset the extent
                    _this.extent = _this.getInitialExtent();
                    // reset the currently rendered graphics and remove them from the map
                    _this.graphics = _this.removeAllMarkers(_this.graphics, _this.mapView);
                    // initialize a new map view using the current map and container
                    _this.mapView = new MapView({ container: _this.mapNodeSelector, map: map });
                    // add the collection models to the map
                    await collection.forEach(_this.addModelToMap);

                    // if the collection has more than one model
                    if (collection.length > 1) {
                        // set the new map extent defined during the collection -> addModelToMap loop
                        const extentScaleFactor = 2;
                        _this.mapView.extent = _this.extent.expand(extentScaleFactor);
                    // else if the collection has 1 or 0 models
                    } else if (collection.length === 1) {
                        _this.mapView.zoom = zoomSingleResult;
                        _this.mapView.center = collection[0].centroid
                    } else {
                        _this.mapView.zoom = zoomEmpty;
                        _this.mapView.center = defaultCenter;
                    }
                }
            },
            // an iterator function that takes a model and adds it to the arc map
            addModelToMap(model, index) {
                let _this = this,
                    // create an svg graphic marker from the model
                    graphic = _this.createMarker(model, index);
                if (graphic) {
                    // add the graphic marker to the graphics array
                    _this.graphics.push({graphic: graphic});
                    // add the graphic to the map view
                    _this.mapView.graphics.add(graphic);
                }
                // update the extent of the map with the new model
                _this.extent = _this.getMapExtent(model, _this.extent);
            },
            createMarker(model, index) {
                let _this = this,
                    // marker rgba color value
                    markerColor = _this.getMarkerColor(index),
                    markerOutlineColor = 'white',
                    // marker outline width
                    markerOutlineWidth = "1px",
                    // marker size
                    markerSize = "20px",
                    markerStyle = 'circle',
                    // function for generating the marker tooltip
                    tooltipContent = async function () {
                        // locally scope context of function to the current execution context
                        return await _this.createMarkerContent(model);
                    },
                    tooltipTemplate = {
                        title: model.address,
                        content: tooltipContent
                    };

                // create a new graphic element
                return new _this.Graphic({
                    // position the marker at the centroid of the model geometry
                    geometry: new _this.Point({
                        longitude: model.centroid.longitude,
                        latitude: model.centroid.latitude
                    }),
                    // create the marker symbol
                    symbol: new _this.SimpleMarkerSymbol({
                        style: markerStyle,
                        size: markerSize,
                        color: markerColor,
                        outline: {
                            color: markerOutlineColor,
                            width: markerOutlineWidth
                        }
                    }),
                    // define the feature layer the marker exists in
                    layer: _this.featureLayer,
                    // define the tooltip for the marker
                    popupTemplate: _this.showTooltip ? tooltipTemplate : null
                })
            },
            // returns an array of color values based on the index of the model
            getMarkerColor(index) {
                let _this = this;
                if (_this.markerColors && _this.markerColors.length) {
                    return _this.markerColors[index % _this.markerColors.length];
                } else {
                    return 'white';
                }
            },
            // returns an empty map extent
            getInitialExtent() {
                let _this = this;
                return new _this.Extent({
                    xmin: null,
                    ymin: null,
                    xmax: null,
                    ymax: null
                });
            },
            // parses a string into a dom element
            parseHTML: function (htmlString) {
                const contentType = 'text/html';

                return new DOMParser().parseFromString(htmlString, contentType).documentElement;
            },
            retargetEsriScroll() {
                // Setup isScrolling variable
                let _this = this,
                    isScrolling;

                // Listen for scroll events
                document.addEventListener('wheel', _throttle(function (e) {
                    let node = _this.$el.querySelector('#mapNode');
                    _this.mapZindex = -1;
                    // Clear our timeout throughout the scroll
                    window.clearTimeout( isScrolling );

                    // Set a timeout to run after scrolling ends
                    isScrolling = setTimeout(function() {
                        _this.mapZindex = 1;
                    }, 200);

                }, false), 100);
            },
            // removes all graphic markers from a mapview
            removeAllMarkers(graphics, mapView) {
                if (graphics && graphics.length && mapView && mapView.graphics && mapView.graphics.length) {
                    for (let i = graphics.length - 1; i >= 0; i--) {
                        mapView.graphics.remove(graphics[i].graphic)
                    }
                }

                return [];
            },
            // used to stop scroll event propagation on the esri map
            stopPropagation(e) {
                if (e && e.stopPropagation) { e.stopPropagation(); }
            },
            // updates an extent with a new model
            getMapExtent(model, extent) {
                let _this = this;
                return new _this.Extent({
                    xmin: !extent.xmin || model.centroid.longitude < extent.xmin ? model.centroid.longitude : extent.xmin,
                    xmax: !extent.xmax || model.centroid.longitude > extent.xmax ? model.centroid.longitude : extent.xmax,
                    ymin: !extent.ymin || model.centroid.latitude < extent.ymin ? model.centroid.latitude : extent.ymin,
                    ymax: !extent.ymax || model.centroid.latitude > extent.ymax ? model.centroid.latitude : extent.ymax
                });
            }
        }
    }
</script>


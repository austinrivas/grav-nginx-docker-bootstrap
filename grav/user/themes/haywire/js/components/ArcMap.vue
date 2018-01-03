<script>
    // the EsriLoader that is responsible for loading the ESRI map modules
    import * as EsriLoader from 'esri-loader'
    // the ArcModelClass that defines the static query methods
    import ArcModelClass from '../models/arcModel'
    // the property field definitions for the arcgis feature layer
    import PROPERTY_FIELDS from '../models/propertyFields';
    // the model definition for a arc gis property feature
    import PropertyModel from '../models/propertyModel';
    // a pile of js that I had to write in order to retarget scroll events away from the map and back to the dom
    import RetargetMouseScroll from '../event-handlers/retarget-mouse-scroll'

    // a reusable component that takes a collection of models with geometries and renders them into a esri map
    export default {
        props: [
            'collection' // the collection that is providing the models to render into the map
        ],

        // runs when component is attached to the DOM
        async mounted() {
            let _this = this;

                // Setup isScrolling variable
                let isScrolling;

                // Listen for scroll events
                document.addEventListener('wheel', function (e) {
                    let node = _this.$el.querySelector('#mapNode');
                    _this.mapZindex = -1;
                    console.log('scrolling', node);
                    // Clear our timeout throughout the scroll
                    window.clearTimeout( isScrolling );

                    // Set a timeout to run after scrolling ends
                    isScrolling = setTimeout(function() {

                        // Run the callback
                        console.log( 'Scrolling has stopped.' );
                        _this.mapZindex = 1;
                    }, 200);

                }, false);


            // the basemap styles being used in the map TODO: set in CMS
            const basemap = "hybrid",
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
            // retarget scroll events to the dom instead of the map
            RetargetMouseScroll({ element: document.getElementById(_this.mapNodeSelector) });
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

        data() {
            return {
                Extent: null, // esri module
                FeatureLayer: null, // esri module
                Graphic: null, // esri module
                Map: null, // esri module
                MapView: null, // esri module
                Point: null, // esri module
                SimpleMarkerSymbol: null, // esri module
                defaultZoom: 16, // default zoom level for a empty or single location map
                defaultCenter: [0,0], // default center for an empty map
                extent: null, // the current map extent / zoom
                featureLayer: null, // the current featureLayer
                featureServer: {url: null}, // the featureServer initialization object
                graphics: [], // the current graphics being rendered
                map: null, // the current map
                mapNodeSelector: null, // the id of the map container
                mapView: null, // the current map view,
                mapZindex: 1
            };
        },

        computed: {
            mapStyles() {
                let _this = this;
                return {
                    'z-index': _this.mapZindex
                }
            },
        },

        watch: {
            // watch the collection for changes and rerender the map with the new models
            async collection() {
                let _this = this;
                await _this.renderMap(_this.collection, _this.MapView, _this.defaultZoom, _this.defaultCenter);
            },
            async MapView() {
                let _this = this;
                await _this.renderMap(_this.collection, _this.MapView, _this.defaultZoom, _this.defaultCenter);
            }
        },

        methods: {
            // async function that creates the tooltip dom
            async createMarkerContent(model) {
                let _this = this,
                    tooltipContainer = _this.parseHTML(`<div class="arcmap-tooltip-container"></div>`),
                    content = [];

                if (model.imageUrl) { content.push(`<img src="${model.imageUrl}" />`); }
                content.push(`<p>${model.address}</p>`);
                content.push(`<p>${model.subdivision}</p>`);
                content.push(`<p>${_this.$options.filters.currency(model.totalPrice)}</p>`);
                content.push(`<p>${model.acres} Acres</p>`);
                content.push(`<p>${model.type}</p>`);
                content.push(`<p>${model.status}</p>`);
                content.push(`<p>${_this.$options.filters.currency(model.pricePerSqft)} PSF</p>`);

                // reduce the content array into a dom container and return it
                return content.reduce((accumulator, elementHTML) => {
                    if (accumulator && accumulator.appendChild) {
                        accumulator.appendChild(_this.parseHTML(elementHTML));
                    }
                    return accumulator;
                }, tooltipContainer);
            },
            async renderMap(collection, MapView, zoom, center) {
                const _this = this,
                    // named mouse-wheel event
                    mouseWheelEvent = "mouse-wheel";
                // if collection is defined and it contains models
                if (collection && MapView) {
                    // reset the extent
                    _this.extent = _this.getInitialExtent();
                    // reset the currently rendered graphics and remove them from the map
                    _this.graphics = _this.removeAllMarkers(_this.graphics, _this.mapView);
                    // initialize a new map view using the current map and container
                    _this.mapView = new MapView({ container: _this.mapNodeSelector, map: _this.map });
                    // stop propagation of mouse-wheel events to prevent esri from breaking itself
                   // _this.mapView.on(mouseWheelEvent, _this.stopPropagation);
                    // add the collection models to the map
                    await collection.forEach(_this.addModelToMap);

                    if (collection.length > 1) {
                        // set the new map extent defined during the collection -> addModelToMap loop
                        _this.mapView.extent = _this.extent;
                    } else {
                        _this.mapView.zoom = zoom;
                        _this.mapView.center = collection.length === 1 ? collection[0].centroid : center;
                    }
                }
            },
            // an iterator function that takes a model and adds it to the arc map
            addModelToMap(model) {
                let _this = this,
                    // create an svg graphic marker from the model
                    graphic = _this.createMarker(model);
                if (graphic) {
                    // add the graphic marker to the graphics array
                    _this.graphics.push({graphic: graphic});
                    // add the graphic to the map view
                    _this.mapView.graphics.add(graphic);
                }
                // update the extent of the map with the new model
                _this.extent = _this.getMapExtent(model, _this.extent);
            },
            createMarker(model) {
                let _this = this,
                    // marker rgba color value
                    markerColor = [200, 25, 25, 0.8],
                    // marker outline width
                    markerOutlineWidth = "0.5px",
                    // marker svg path
                    markerPath = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
                    // marker size
                    markerSize = "24px",
                    // function for generating the marker tooltip
                    tooltipContent = async function () {
                        // locally scope context of function to the current execution context
                        return await _this.createMarkerContent(model);
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
                        path: markerPath,
                        size: markerSize,
                        color: markerColor,
                        outline: {
                            color: markerColor,
                            width: markerOutlineWidth
                        }
                    }),
                    // define the feature layer the marker exists in
                    layer: _this.featureLayer,
                    // define the tooltip for the marker
                    popupTemplate: {
                        title: model.address,
                        content: tooltipContent
                    }
                })
            },
            // returns an empty map extent
            getInitialExtent() {
                return {
                    xmin: null,
                    ymin: null,
                    xmax: null,
                    ymax: null
                };
            },
            // parses a string into a dom element
            parseHTML: function (htmlString) {
                const contentType = 'text/html';

                return new DOMParser().parseFromString(htmlString, contentType).documentElement;
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
                return {
                    xmin: !extent.xmin || model.centroid.longitude < extent.xmin ? model.centroid.longitude : extent.xmin,
                    xmax: !extent.xmax || model.centroid.longitude > extent.xmax ? model.centroid.longitude : extent.xmax,
                    ymin: !extent.ymin || model.centroid.latitude < extent.ymin ? model.centroid.latitude : extent.ymin,
                    ymax: !extent.ymax || model.centroid.latitude > extent.ymax ? model.centroid.latitude : extent.ymax
                };
            }
        }
    }
</script>


<script>
    import * as esriLoader from 'esri-loader'
    import ArcModelClass from '../models/arcModel'
    import RetargetMouseScroll from '../event-handlers/retarget-mouse-scroll'

    export default {
        props: ['collection'],

        mounted: async function () {
            let _this = this;

            const basemap = "hybrid",
                options = {},
                modules = [
                    "esri/geometry/Extent",
                    "esri/layers/FeatureLayer",
                    "esri/Graphic",
                    "esri/Map",
                    "esri/views/MapView",
                    "esri/geometry/Point",
                    "esri/symbols/SimpleMarkerSymbol"
                ];

            _this.mapNodeSelector = "mapNode";

            RetargetMouseScroll({
                element: document.getElementById(_this.mapNodeSelector)
            });

            await esriLoader.loadModules(modules, options)
                .then(([Extent, FeatureLayer, Graphic, Map, MapView, Point, SimpleMarkerSymbol]) => {

                    _this.Extent = Extent;
                    _this.FeatureLayer = FeatureLayer;
                    _this.Graphic = Graphic;
                    _this.Map = Map;
                    _this.MapView = MapView;
                    _this.Point = Point;
                    _this.SimpleMarkerSymbol = SimpleMarkerSymbol;

                });

            _this.map = new _this.Map({ basemap: basemap });

            _this.featureServer.url = ArcModelClass.getArcGISFeatureServerUrl();

            _this.featureLayer = new _this.FeatureLayer(_this.featureServer);

            _this.map.layers.add(_this.featureLayer);
        },

        data: function () {
            return {
                Extent: null,
                FeatureLayer: null,
                Graphic: null,
                Map: null,
                MapView: null,
                Point: null,
                SimpleMarkerSymbol: null,
                extent: null,
                featureLayer: null,
                featureServer: {url: null},
                graphics: [],
                map: null,
                mapNodeSelector: null,
                mapView: null
            };
        },

        watch: {
            collection: async function () {
                const _this = this,
                    mouseWheelEvent = "mouse-wheel";

                if (_this.collection && _this.collection.length) {
                    _this.extent = {
                        xmin: null,
                        ymin: null,
                        xmax: null,
                        ymax: null
                    };

                    _this.graphics = _this.removeAllMarkers(_this.graphics, _this.mapView);

                    _this.mapView = new _this.MapView({
                        container: _this.mapNodeSelector,
                        map: _this.map,
                        center: await _this.getMapCenter(_this.collection)
                    });

                    _this.mapView.on(mouseWheelEvent, _this.stopPropagation);

                    await _this.collection.forEach(_this.addModelToMap);

                    _this.mapView.extent = _this.extent;
                }
            }
        },

        methods: {
            addModelToMap: function (model) {
                let _this = this,
                    gr = _this.createMarker(model);

                _this.extent = _this.getMapExtent(model, _this.extent);

                _this.graphics.push({ graphic: gr });
                _this.mapView.graphics.add(gr);
            },
            createMarker: function (model) {
                let _this = this,
                    markerColor = [200, 25, 25, 0.8],
                    markerOutlineWidth = "0.5px",
                    markerPath = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
                    markerSize = "24px";

                return new _this.Graphic({
                    geometry: new _this.Point({
                        longitude: model.centroid.longitude,
                        latitude: model.centroid.latitude
                    }),
                    symbol: new _this.SimpleMarkerSymbol({
                        path: markerPath,
                        size: markerSize,
                        color: markerColor,
                        outline: {
                            color: markerColor,
                            width: markerOutlineWidth
                        }
                    }),
                    layer: _this.featureLayer,
                    popupTemplate: {
                        title: model.address,
                        content: _this.createMarkerContent(model)
                    }
                })
            },
            createMarkerContent: function (model) {
                let _this = this,
                    tooltipContainer = _this.parseHTML(`<div class="arcmap-tooltip-container"></div>`),
                    content = [];

                content.push(`<img src="${model.imageUrl}" />`);
                content.push(`<p>${model.address}</p>`);
                content.push(`<p>${model.subdivision}</p>`);
                content.push(`<p>${_this.$options.filters.currency(model.totalPrice)}</p>`);
                content.push(`<p>${model.acres} Acres</p>`);
                content.push(`<p>${model.type}</p>`);
                content.push(`<p>${model.status}</p>`);
                content.push(`<p>${_this.$options.filters.currency(model.pricePerSqft)} PSF</p>`);

                return content.reduce((accumulator, elementHTML) => {
                    if (accumulator && accumulator.appendChild) {
                        accumulator.appendChild(_this.parseHTML(elementHTML));
                    }
                    return accumulator;
                }, tooltipContainer);
            },
            getMapCenter: async function (collection) {
                const center = await collection.reduce((accumulator, model) => {
                    accumulator.longitude += model.centroid.longitude;
                    accumulator.latitude += model.centroid.latitude;
                    return accumulator;
                }, {longitude: 0, latitude: 0});

                return [center.longitude / collection.length, center.latitude / collection.length];
            },
            parseHTML: function (htmlString) {
                const contentType = 'text/html';

                return new DOMParser().parseFromString(htmlString, contentType).documentElement;
            },
            removeAllMarkers: function (graphics, mapView) {
                if (graphics && graphics.length && mapView && mapView.graphics && mapView.graphics.length) {
                    for (let i = graphics.length - 1; i >= 0; i--) {
                        mapView.graphics.remove(graphics[i].graphic)
                    }
                }

                return [];
            },
            stopPropagation: function (e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
            },
            getMapExtent: function (model, extent) {
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


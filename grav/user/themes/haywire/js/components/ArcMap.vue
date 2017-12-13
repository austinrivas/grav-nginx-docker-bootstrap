<script>
    import * as esriLoader from 'esri-loader'
    import ArcModelClass from '../models/arcModel'
    import RetargetMouseScroll from '../event-handlers/retarget-mouse-scroll'

    export default {
        mounted: async function () {

            let _this = this;

            const basemap = "hybrid",
                options = {},
                mouseWheelEvent = "mouse-wheel",
                modules = [
                    "esri/Map",
                    "esri/views/MapView",
                    "esri/layers/FeatureLayer",
                    "esri/symbols/SimpleMarkerSymbol",
                    "esri/geometry/Point",
                    "esri/Graphic"];

            _this.mapNodeSelector = "mapNode";

            RetargetMouseScroll({
                element: document.getElementById(_this.mapNodeSelector)
            });

            await esriLoader.loadModules(modules, options)
                .then(([Map, MapView, FeatureLayer, SimpleMarkerSymbol, Point, Graphic]) => {

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

            _this.properties = await Properties.findAllProperties();

            _this.mapView = new _this.MapView({
                container: _this.mapNodeSelector,
                map: _this.map,
                zoom: _this.defaultZoom,
                center: await _this.getMapCenter(_this.properties) // [longitude, latitude]
            });

            _this.mapView.on(mouseWheelEvent, _this.stopPropagation);

            _this.properties.forEach(_this.addMapMarkerToDisplay);
        },

        data: function () {
            return {
                FeatureLayer: null,
                Graphic: null,
                Map: null,
                MapView: null,
                Point: null,
                SimpleMarkerSymbol: null,
                defaultZoom: 16,
                featureLayer: null,
                featureServer: {url: null},
                graphics: [],
                map: null,
                mapNodeSelector: null,
                mapView: null,
                properties: null,
            };
        },

        computed: {},

        methods: {
            addMapMarkerToDisplay: function (model) {
                const markerPath = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
                    markerSize = "24px",
                    markerColor = [200, 25, 25, 0.8],
                    markerOutlineWidth = "0.5px";

                let _this = this,
                    pnt = new _this.Point({
                        longitude: model.centroid.longitude,
                        latitude: model.centroid.latitude
                    }),
                    gr = new _this.Graphic({
                        geometry: pnt,
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
                    });

                _this.graphics.push({ graphic: gr });
                _this.mapView.graphics.add(gr)
            },
            createMarkerContent: function (model) {
                return `<p>${model.toJSON()}</p>`;
            },
            getMapCenter: async function (collection) {
                const center = await collection.reduce((accumulator, model) => {
                    accumulator.longitude += model.centroid.longitude;
                    accumulator.latitude += model.centroid.latitude;
                    return accumulator;
                }, {longitude: 0, latitude: 0});

                return [center.longitude / collection.length, center.latitude / collection.length];
            },
            removeAllMarkers: function () {
                let _this = this;
                for (let i = _this.graphics.length - 1; i >= 0; i--) {
                    _this.mapView.graphics.remove(_this.graphics[i].graphic)
                }
            },
            stopPropagation: function (e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
            }
        }
    }
</script>


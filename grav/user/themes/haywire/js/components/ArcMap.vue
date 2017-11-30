<script>
    import * as esriLoader from 'esri-loader'

    let PropertyMap = function (areas) {

        console.log('PropertyMap init', areas);

        let map = {}, view = {}, layers = [], graphics = [];

        // first, we use Dojo's loader to require the map class
        esriLoader.dojoRequire(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/symbols/SimpleMarkerSymbol", "esri/geometry/Point", "esri/Graphic", "esri/layers/GraphicsLayer"], (Map, MapView, FeatureLayer, SimpleMarkerSymbol, Point, Graphic, GraphicsLayer) => {


            function removeAllMarkers() {
                for (let i = graphics.length - 1; i >= 0; i--) {
                    view.graphics.remove(graphics[i].graphic)
                }
            }

            function createMarkerContent(popupData) {
                return '<p>Test</p>'
            }

            function addMapMarkerToDisplay(lonLat, filter, name, popupData) {

                // [-82.4285, 27.4417]
                let pnt = new Point({
                    longitude: lonLat[0],
                    latitude: lonLat[1]
                });

                let gr = new Graphic({
                    geometry: pnt,
                    symbol: new SimpleMarkerSymbol({
                        path: "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
                        size: "24px",
                        color: [200, 25, 25, 0.8],
                        outline: {
                            color: [200, 25, 25, 0.8],
                            width: "0.5px"
                        }
                    }),
                    layer: fl,
                    popupTemplate: {
                        title: name,
                        content: createMarkerContent(popupData)
                    }
                });

                graphics.push({graphic: gr, 'filter': filter});
                view.graphics.add(gr)

            }


            map = new Map({
                basemap: "streets"
            });

            let fl = new FeatureLayer({url: 'http://services2.arcgis.com/XS7JKtqtY6stbXzM/arcgis/rest/services/1_to_2_Acres/FeatureServer/0'});

            //https://lwrcommercial.local/app/uploads/2017/08/678111-map-marker-256.png

            // LWR lng, lat: 27.411704, -82.428515
            view = new MapView({
                container: "mapNode",
                map: map,
                zoom: 13,
                center: [-82.4285, 27.4417] // longitude, latitude
            });

            view.on("mouse-wheel", function (evt) {
                evt.stopPropagation();
            });

            for (let i = areas.length - 1; i >= 0; i--) {
                // addMapMarkerToDisplay([areas[i].latitude, areas[i].longitude], areas[i].name, areas[i].data)
                for (let ii = areas[i].properties.length - 1; ii >= 0; ii--) {
                    addMapMarkerToDisplay(
                        [areas[i].properties[ii].latitude, areas[i].properties[ii].longitude],
                        areas[i].name,
                        areas[i].properties[ii].name,
                        areas[i].properties[ii].data
                    );
                }
            }


            map.layers.add(fl);


            // Bind to all filters
            $("#map-filters li input").on('change', function (e) {

                console.log('filter change event handler', e);

                removeAllMarkers();

                let filtered = [];
                // Get all markers in filters
                $("#map-filters li input:checked").each(function () {
                    let vl = $(this).val();
                    graphics.map(function (gr) {
                        if (gr.filter === vl) {
                            filtered.push(gr)
                        }
                    })
                });

                filtered.map(function (gr) {
                    view.graphics.add(gr.graphic)
                })

            });

        });

    };

    export default {
        mounted: () => {
            let areas = [
                {
                    name: "1 to 2 Ancres",
                    properties: [
                        {
                            latitude: -82.43,
                            longitude: 27.4417,
                            name: "Test Property",
                            data: {
                                rooms: 3,
                                bathrooms: 4,
                                sqft: 3087,
                                price: 408857
                            }
                        },
                        {
                            latitude: -82.44,
                            longitude: 27.4417,
                            name: "Test Property",
                            data: {
                                rooms: 3,
                                bathrooms: 4,
                                sqft: 3087,
                                price: 408857
                            }
                        }
                    ]
                },
                {
                    name: "5 to 10 Ancres",
                    properties: [
                        {
                            latitude: -82.435,
                            longitude: 27.4417,
                            name: "Testa Property",
                            data: {
                                rooms: 3,
                                bathrooms: 4,
                                sqft: 3087,
                                price: 408857
                            }
                        },
                        {
                            latitude: -82.445,
                            longitude: 27.4417,
                            name: "Testa Property",
                            data: {
                                rooms: 3,
                                bathrooms: 4,
                                sqft: 3087,
                                price: 408857
                            }
                        }
                    ]
                }
            ];

            // has the ArcGIS API been added to the page?
            if (esriLoader.isLoaded()) {
                // ArcGIS API is already loaded, just create the map
                new PropertyMap(areas)
            } else {
                // no, lazy load it the ArcGIS API before using its classes
                esriLoader.bootstrap((err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // once it's loaded, create the map
                        new PropertyMap(areas)
                    }
                });
            }
        }
    }
</script>


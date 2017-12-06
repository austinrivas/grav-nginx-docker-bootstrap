import * as esriLoader from 'esri-loader';

export default class ArcModel {

    constructor () {
        this.featureServerUrl = 'https://services2.arcgis.com/XS7JKtqtY6stbXzM/arcgis/rest/services/SMRLWR_Commercial_Sample_20171205/FeatureServer/0';
    }

    get featureServerUrl() {
        return this._featureServerUrl;
    }

    set featureServerUrl(url) {
        this._featureServerUrl = url;
    }

    async loadArcFeature() {
        const response = {},
            options = {},
            modules = ["esri/layers/FeatureLayer", "esri/tasks/QueryTask", "esri/tasks/support/Query"],
            lwrCommercialParcelsFeatureServer = {url: this.featureServerUrl};

        return await esriLoader.loadModules(modules, options)
            .then(([FeatureLayer, QueryTask, Query]) => {
                const queryTask = new QueryTask(lwrCommercialParcelsFeatureServer);
                let query = new Query();

                query.returnGeometry = true;
                query.outFields = ["*"];
                query.where = "Feat_Prop = 'TRUE'";

                return queryTask.execute(query)
                    .then((results)=>{
                        response.results = results;
                        return response;
                    }, (error) => {
                        response.error = error;
                        return response;
                    });
            });
    }

    async logArcFeature() {
        const response = await this.loadArcFeature(),
            features = response.results ? response.results.features : null,
            error = response.error ? response.error : null;

        console.log("features", features);
        console.log("error", error);

        if (features && !error) {
            features.forEach((feature) => {
                const attributes = feature.attributes;
                console.log(attributes.Property_I, attributes);
            })
        }
    }
}

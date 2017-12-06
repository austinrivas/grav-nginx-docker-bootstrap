import * as esriLoader from 'esri-loader';
import PROPERTY_FIELDS from "./propertyFields";
import PropertyModel from "./propertyModel"

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

    static queryOutfieldsSelectAll () {
        return ["*"];
    }

    static queryWhereSelectAll () {
        return "'TRUE' = 'TRUE'";
    }

    static queryWhereSelectPropertyById (id) {
        if (id) {
            return `${PROPERTY_FIELDS.id} = ${id}`;
        } else {
            console.error("A property id is required to query by Id");
        }
    }


    async executeQuery(queryOutfields, queryWhere) {
        queryOutfields = queryOutfields || ArcModel.queryOutfieldsSelectAll();
        queryWhere = queryWhere || ArcModel.queryWhereSelectAll();

        const response = {},
            options = {},
            modules = ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
            lwrCommercialParcelsFeatureServer = {url: this.featureServerUrl};

        return await esriLoader.loadModules(modules, options)
            .then(([QueryTask, Query]) => {
                const queryTask = new QueryTask(lwrCommercialParcelsFeatureServer);
                let query = new Query();

                query.returnGeometry = true;
                query.outFields = queryOutfields;
                query.where = queryWhere;

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

    async logArcFeatures(queryOutfields, queryWhere) {
        const response = await this.executeQuery(queryOutfields, queryWhere),
            features = response.results ? response.results.features : null,
            error = response.error ? response.error : null;

        if (error) {
            console.log("ArcGIS query returned an error", error);
        } else if (features && !error) {
            features.forEach((feature) => {
                const model = new PropertyModel(feature);
                console.log(model.id, model.toJSON());
            })
        } else if (!features && !error) {
            console.log("No features returned from ArcGIS query", response);
        }
    }
}

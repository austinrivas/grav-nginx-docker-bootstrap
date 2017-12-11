import * as esriLoader from 'esri-loader';
import PROPERTY_FIELDS from "./propertyFields";
import PropertyModel from "./propertyModel"

// ArcModel is a resource model that is responsible for constructing ArcGIS queries and retrieving remote data from a feature server
export default class ArcModel {

    // constructor sets the featureServerUrl for the arc model
    // an eventual improvement would be to make featureServerUrl a parameter to allow for multi data sources
    constructor () {
        const featureServerMetaSelector = 'meta[name="arc-gis-feature-server-url"]';
        this.featureServerUrl = ArcModel.getArcGISFeatureServerUrl(featureServerMetaSelector);
    }

    get featureServerUrl() {
        return this._featureServerUrl;
    }

    set featureServerUrl(url) {
        this._featureServerUrl = url;
    }

    static getArcGISFeatureServerUrl (metaSelector) {
        const element = document.querySelector(metaSelector);

        return element && element.getAttribute("content");
    }

    // a static method that returns the select all fields outfield selector
    static queryOutfieldsSelectAll () {
        return ["*"];
    }

    // a static method that returns the select all where clause
    static queryWhereSelectAll () {
        return "'TRUE' = 'TRUE'";
    }

    // a static method that return a where clause for selecting a specific feature by id
    static queryWhereSelectPropertyById (id) {
        if (id) {
            return `${PROPERTY_FIELDS.id} = ${id}`;
        } else {
            return new Error("A property id is required to query by Id");
        }
    }


    // async method that loads esri modules and executes a QueryTask with the query parameters
    async executeQuery(queryOutfields, queryWhere) {
        const options = {},
            modules = ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
            lwrCommercialParcelsFeatureServer = {url: this.featureServerUrl};

        // async await the result of loading the esri modules and executing the query
        return await esriLoader.loadModules(modules, options)
            .then(([QueryTask, Query]) => {
                const queryTask = new QueryTask(lwrCommercialParcelsFeatureServer);
                let query = new Query();

                query.returnGeometry = true;
                query.outFields = queryOutfields;
                query.where = queryWhere;

                return queryTask.execute(query)
                    .then((results)=>{
                        return results.features ? results.features : [];
                    }, (error) => {
                        console.log("ArcGIS query returned an error", error);
                        return [];
                    });
            });
    }

    // an async debug method for running queries and logging the result to console
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

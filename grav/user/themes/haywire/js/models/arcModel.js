import * as esriLoader from 'esri-loader';
import PROPERTY_FIELDS from "./propertyFields";
import PropertyModel from "./propertyModel";

// ArcModel is a resource model that is responsible for constructing ArcGIS queries and retrieving remote data from a feature server
export default class ArcModel {

    // constructor sets the featureServerUrl for the arc model
    // an eventual improvement would be to make featureServerUrl a parameter to allow for multi data sources
    constructor () {
        this.featureServerUrl = ArcModel.getArcGISFeatureServerUrl();
    }

    get featureServerUrl () {
        return this._featureServerUrl;
    }

    set featureServerUrl (url) {
        this._featureServerUrl = url;
    }

    static getArcGISFeatureServerUrl (selector) {

        selector = selector || 'meta[name="arc-gis-feature-server-url"]';

        const element = document.querySelector(selector);

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

    // the request precallback is responsible for adding the returnDistinctValues option to the query params if the
    // query structure supports distinct results
    static requestPreCallback (arcArgs) {
        // test if we're sending the request to a mapservice query
        if (/query\/?$/.test(arcArgs.url)) {
            // if not requesting ObjectIds, count, or querying with a list of ObjectIDs, return distinct values.
            if (arcArgs.content && !arcArgs.content.returnIdsOnly && !arcArgs.content.returnCountOnly && !arcArgs.content.objectIds) {
                arcArgs.content.returnDistinctValues = true;
            }
        }
        return arcArgs;
    }

    // async method that loads esri modules and executes a QueryTask with the query parameters
    async executeQuery (queryOutfields, queryWhere, distinctResultsOnly) {
        const options = {},
            modules = ["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/request"],
            lwrCommercialParcelsFeatureServer = {url: this.featureServerUrl};

        // async await the result of loading the esri modules and executing the query
        return await esriLoader.loadModules(modules, options)
            .then(([QueryTask, Query, Request]) => {
                const queryTask = new QueryTask(lwrCommercialParcelsFeatureServer);
                let query = new Query();

                query.outFields = queryOutfields;
                query.where = queryWhere;
                query.returnGeometry = !distinctResultsOnly;

                if (distinctResultsOnly) {
                    Request.setRequestPreCallback(ArcModel.requestPreCallback);
                }

                return queryTask.execute(query)
                    .then((results) => {
                        return results.features ? results.features : [];
                    }, (error) => {
                        console.log("ArcGIS query returned an error", error);
                        return [];
                    });
            });
    }

    // an async debug method for running queries and logging the result to console
    async logArcFeatures (queryOutfields, queryWhere, distinctResultsOnly) {
        const response = await this.executeQuery(queryOutfields, queryWhere, distinctResultsOnly);

        response.forEach((feature) => {
            try {
                const model = new PropertyModel(feature);
                console.log(model.id, model.toJSON());
            } catch (e) {
                console.log(feature);
            }
        });
    }
}

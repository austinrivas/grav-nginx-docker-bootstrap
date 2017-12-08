import ArcModel from "./arcModel";
import Collection from "./collection";
import PropertyModel from "./propertyModel";

// PropertyCollection class is a data store that is repsonsible for async fetching features from ArcGIS
// After fetching features it will instantiate a model for each feature and store them locally
// PropertyCollection is also responsible for local filtering of the models in the local store and returning the result
export default class PropertyCollection extends Collection {

    // constructor sets the model used by the collection
    constructor () {
        super(PropertyModel);
        // a reference to the ArcModel class used for querying ArcGIS
        this.arcModel = ArcModel;
        this.initializeCollection();
    }

    get arcModel () {
        return this._arcModel;
    }

    set arcModel (arcModel) {
        this._arcModel = new arcModel();
    }

    // async load all the properties from ArcGIS and set the all models loaded flag to true and return them as an array
    async findAllProperties () {
        let _this = this;

        const features = await this.arcModel.executeQuery(ArcModel.queryOutfieldsSelectAll(), ArcModel.queryWhereSelectAll());

        if (features && features.length) {
            this.removeAll();
            await features.forEach((feature) => {
                _this.add(new this.model(feature));
            });
            this.allModelsLoaded = true;
        }

        return this.findAllLocalModels();
    }

    // async load all the properties from ArcGIS and return the featured properties as an array
    async findFeaturedProperties () {
        const key = 'featured';

        if (!this.allModelsLoaded) {
            await this.findAllProperties();
        }

        return await this.findLocalModelByKeyValue(key, true);
    }

    // async load a property from ArcGIS if it does not exist locally and return it
    async findPropertyById (id) {
        if (id) {
            let property = this.findLocalModelById(id);

            if (property) {
                return property;
            } else {
                let _this = this;

                const features = await this.arcModel.executeQuery(ArcModel.queryOutfieldsSelectAll(), ArcModel.queryWhereSelectPropertyById(id));

                if (features && features.length) {
                    await features.forEach((feature) => {
                        _this.add(new this.model(feature));
                    });
                }

                return this.findLocalModelById(id);
            }

        } else {
            return new Error("An id is required to retrieve a model from a collection");
        }
    }

    // async load all properties and then return the models that fall within the acreage range parameters
    async findPropertiesByAcreageRange (lowerBound, upperBound) {
        if (lowerBound >= 0 && upperBound >= lowerBound) {
            const key = 'acres';

            if (!this.allModelsLoaded) {
                await this.findAllProperties();
            }

            return await this.findLocalModelByKeyValueRange(key, lowerBound, upperBound);
        } else {
            return new Error("A lowerBound and upperBound must be defined, upperBound must be greater than or equal to lowerBound");
        }
    }

    // async load all properties and return the values that have a matching subdivision value
    async findPropertiesBySubdivision (subdivision) {
        if (subdivision) {
            const key = 'subdivision';

            if (!this.allModelsLoaded) {
                await this.findAllProperties();
            }

            return await this.findLocalModelByKeyValue(key, subdivision);
        } else {
            return new Error("A type value is required in order to find a property by type.");
        }
    }

    // async load all properties and return the values that have a matching type value
    async findPropertiesByType (type) {
        if (type) {
            const key = 'type';

            if (!this.allModelsLoaded) {
                await this.findAllProperties();
            }

            return await this.findLocalModelByKeyValue(key, type);
        } else {
            return new Error("A type value is required in order to find a property by type.");
        }
    }

}

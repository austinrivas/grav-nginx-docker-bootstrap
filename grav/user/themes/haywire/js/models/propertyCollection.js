import ArcModel from "./arcModel";
import Collection from "./collection";
import PropertyModel from "./propertyModel";

export default class PropertyCollection extends Collection {

    constructor () {
        super(PropertyModel);
        this.arcModel = ArcModel;
    }

    get arcModel () {
        return this._arcModel;
    }

    set arcModel (arcModel) {
        this._arcModel = new arcModel();
    }

    async findAllProperties () {
        let _this = this;

        const response = await this.arcModel.executeQuery(ArcModel.queryOutfieldsSelectAll(), ArcModel.queryWhereSelectAll()),
            features = response.results ? response.results.features : null,
            error = response.error ? response.error : null;

        if (error) {
            console.log("ArcGIS query returned an error", error);
        } else if (features && !error) {
            this.removeAll();
            await features.forEach((feature) => {
                _this.add(new this.model(feature))
            });
            this.allModelsLoaded = true;
            return this.findAll();
        } else if (!features && !error) {
            console.log("No features returned from ArcGIS query", response);
        }
    }

    async findFeaturedProperties () {
        const key = 'featured';

        if (!this.allModelsLoaded) {
            await this.findAllProperties();
        }

        return await this.findByKeyValue(key, true);
    }

    async findPropertyById (id) {
        if (id) {
            let property = this.findById(id);

            if (property) {
                return property;
            } else {
                let _this = this;

                const response = await this.arcModel.executeQuery(ArcModel.queryOutfieldsSelectAll(), ArcModel.queryWhereSelectPropertyById(id)),
                    features = response.results ? response.results.features : null,
                    error = response.error ? response.error : null;

                if (error) {
                    console.log("ArcGIS query returned an error", error);
                } else if (features && !error) {
                    await features.forEach((feature) => {
                        _this.add(new this.model(feature))
                    });
                    return this.findById(id);
                } else if (!features && !error) {
                    console.log("No features returned from ArcGIS query", response);
                }
            }

        } else {
            console.error("An id is required to retrieve a model from a collection")
        }
    }

    async findPropertiesBySubdivision (subdivision) {
        if (subdivision) {
            const key = 'subdivision';

            if (!this.allModelsLoaded) {
                await this.findAllProperties();
            }

            return await this.findByKeyValue(key, subdivision);
        } else {
            console.error("A type value is required in order to find a property by type.")
        }
    }

    async findPropertiesByType (type) {
        if (type) {
            const key = 'type';

            if (!this.allModelsLoaded) {
                await this.findAllProperties();
            }

            return await this.findByKeyValue(key, type);
        } else {
            console.error("A type value is required in order to find a property by type.")
        }
    }

}

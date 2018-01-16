import { PROPERTY_FIELDS } from "./propertyModelJSON";

// PropertyModel is a simple data container class that maps ArcGIS feature field names to usable names
export default class PropertyModel {
    constructor(arcFeature) {
        let _this = this;

        const attributes = arcFeature && arcFeature.attributes ? arcFeature.attributes : null,
            geometry = arcFeature && arcFeature.geometry ? arcFeature.geometry : null;

        if (attributes) {
            // dynamically generate model properties form PROPERTY_FIELDS
            Object.keys(PROPERTY_FIELDS).forEach((key) => {
                // if the property is already defined as a getter / setter use the hidden property instead
                const classKey = typeof _this[key] === 'function' ? `_${key}` : key;
                _this[classKey] = attributes[PROPERTY_FIELDS[key]];
            });
        } else {
            return new Error("Unable to initialize property without attributes", arcFeature);
        }

        if (geometry) {
            _this.centroid = {
                latitude: geometry.centroid.latitude,
                longitude: geometry.centroid.longitude
            };
        } else {
            return new Error("Unable to initialize property without geometry", arcFeature);
        }
    }

    get centroid() {
        return this._centroid;
    }

    set centroid(centroid) {
        if (centroid.latitude && centroid.longitude) {
            this._centroid = centroid;
        } else {
            return new Error("A property centroid must have a latitude and longitude value", centroid);
        }
    }

    // cast the featured value as a boolean on access
    get featured() {
        return this._featured === "TRUE";
    }

    set featured(featured) {
        this._featured = featured;
    }

    // return a JSON representation of the model using pretty field names
    toJSON() {
        let _this = this;
        return Object.keys(PROPERTY_FIELDS).reduce((accumulator, key) => {
            accumulator[key] = _this[key];
        }, {});
    }
}

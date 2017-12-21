import LocalStorageCollection from "./localstorageCollection"
import PropertiesModel from "./propertyModel"

// FavoritePropertiesCollection is meant to house the ids of a users favorited properties in localstorage
export default class FavoritePropertiesCollection extends LocalStorageCollection {

    constructor() {
        const collectionKey = "favorite_properties";
        super(PropertiesModel, collectionKey);
    }

}

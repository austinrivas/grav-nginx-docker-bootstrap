import LocalStorageCollection from "./localstorageCollection"
import PropertiesModel from "./propertyModel"

export default class FavoritePropertiesCollection extends LocalStorageCollection {

    constructor () {
        const collectionKey = "favorite_properties";
        super(PropertiesModel, collectionKey);
    }

}

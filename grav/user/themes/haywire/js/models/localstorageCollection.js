import Collection from "./collection"

// LocalStorageCollection is an abstract class that provides and interface for storing an array of ids in localstorage
export default class LocalStorageCollection extends Collection {

    // constructor throws an error if localstorage is not available or if the collectionKey param is missing
    constructor (model, collectionKey) {
        super(model);

        if (LocalStorageCollection.isWindowAndHasLS(window)) {
            this.localStorage = window.localStorage;
        } else {
            return new Error("Cannot initialize LocalStorageCollection without window.localStorage");
        }

        if (collectionKey) {
            this.collectionKey = collectionKey;
        } else {
            return new Error("LocalStorageCollection constructor is missing parameter `collectionKey`")
        }

        this.initializeCollection();
    }

    // retrieve the string value of the collectionKey entry in localstorage and deserialize it into an array of int ids
    get collection () {
        const separator = ",";

        let collection = this.localStorage.getItem(this.collectionKey);

        if (collection !== null) {
            return collection
                .split(separator)
                .reduce((accumulator, id) => {
                    if (id) {
                        accumulator.push(JSON.parse(id));
                    }
                    return accumulator;
                }, []);
        } else {
            return new Error(`Collection ${this.collectionKey} is not defined in localstorage`);
        }
    }

    // take an array of int ids and serialize it into a string at collectionKey in localstorage
    set collection (collection) {
        if (collection instanceof Array) {
            this.localStorage.setItem(this.collectionKey, collection);
        } else {
            return new Error("A collection must be an Array in order to be persisted to localstorage");
        }
    }

    get collectionKey () {
        return this._collectionKey;
    }

    set collectionKey (collectionKey) {
        this._collectionKey = collectionKey;
    }

    get localStorage () {
        return this._localStorage;
    }

    set localStorage (localStorage) {
        this._localStorage = localStorage;
    }

    // a static method that determines if the user agent has access to localstorage
    static isWindowAndHasLS(w) {
        return w && w.localStorage;
    }

    // add the id of the model to the localstorage serialized array
    async add (model) {
        if (!model) {
            return new Error("LocalStorageCollection.add method requires a model as a parameter");
        } else if (!model.id) {
            return new Error("The model being removed has no id");
        }

        let collection = this.collection,
            exists = await this.exists(model.id);

        if (!exists) {
            collection.push(model.id);
            this.collection = collection;
            exists = await this.exists(model.id)
        }

        return exists;
    }

    // destroy the entry for collectionKey in localstorage
    destroy () {
        this.localStorage.removeItem(this.collectionKey);
        return true;
    }

    // check for the existance of the given id in localstorage and return a boolean
    async exists (id) {
        if (!id) {
            return new Error("An id parameter is required to check for existence in localstorage")
        }

        const result = await this.collection.find((iterateeId) => {
            return iterateeId === id;
        });

        return !!result;
    }

    // if the collectionKey has not been defined in localstorage then initialize it as an empty array
    initializeCollection () {
        if (!this.localStorage.hasOwnProperty(this.collectionKey)) {
            this.collection = [];
        }
    }

    // findAllLocalModels just returns the value of this.colleciton to preserve the collection api interface
    findAllLocalModels () {
        return this.collection;
    }

    // findLocalModelById just returns the value of the id if it exists in localstorage
    // this could do more, like instantiate the model itself, but the current requirements to not dictate that
    async findLocalModelById (id) {
        const exists = await this.exists(id);

        if (exists) {
            return id;
        } else {
            return false;
        }
    }

    // returns false to preserve the collection api interface
    async findLocalModelByKeyValue() {
        return false;
    }

    // returns false to preserve the collection api interface
    async findLocalModelByKeyValueRange () {
        return false;
    }

    // remove a model from localstorage
    // all this is doing is removing the id of the model from the serialized array at localstorage collectionKey
    async remove (model) {
        if (!model) {
            return new Error("LocalStorageCollection.remove method requires a model as a parameter");
        } else if (!model.id) {
            return new Error("The model being removed has no id");
        } else {
            let exists = await this.exists(model.id);

            if (exists) {
                let collection = this.collection;

                this.collection = await collection.filter((iterateeId) => {
                    return iterateeId !== model.id;
                });

                exists = await this.exists(model.id);
            }

            return !exists;
        }
    }

    // empty the localstorage collection
    removeAll () {
        this.collection = [];
        return true;
    }

}

import Collection from "./collection"

export default class LocalStorageCollection extends Collection {

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

    static isWindowAndHasLS(w) {
        return w && w.localStorage;
    }

    add (model) {
        if (!model) {
            return new Error("LocalStorageCollection.add method requires a model as a parameter");
        } else if (!model.id) {
            return new Error("The model being removed has no id");
        }

        let collection = this.collection;

        if (!collection.includes(model.id)) {
            collection.push(model.id);
            this.collection = collection;
        }

        return true;
    }

    destroy () {
        this.localStorage.removeItem(this.collectionKey);
        return true;
    }

    initializeCollection () {
        if (!this.localStorage.hasOwnProperty(this.collectionKey)) {
            this.collection = [];
        }
    }

    findAllLocalModels () {
        return this.collection;
    }

    findLocalModelById (id) {
        let collection = this.collection;

        const exists = collection.find((iterateeId) => {
            return iterateeId === id;
        });

        if (exists) {
            return id;
        } else {
            return false;
        }
    }

    async findLocalModelByKeyValue() {
        return false;
    }

    async findLocalModelByKeyValueRange () {
        return false;
    }

    remove (model) {
        if (!model) {
            return new Error("LocalStorageCollection.remove method requires a model as a parameter");
        } else if (!model.id) {
            return new Error("The model being removed has no id");
        } else {
            const modelExistsInLocalStorage = this.findLocalModelById(model.id);

            if (!modelExistsInLocalStorage) {
                return new Error(`There is no model in the collection with id ${model.id} to remove`);
            } else {
                let collection = this.collection;

                this.collection = collection.filter((iterateeId) => {
                    return iterateeId !== model.id;
                });

                return true;
            }
        }
    }

    removeAll () {
        this.collection = [];
        return true;
    }

}

// Collection class is an abstract class that provides the basic features of a collection
// Collection is responsible for local filtering based on key value pairs and ranges
// Collection also provides the ability to add and remove individual models from its collection
export default class Collection {

    // constructors sets the model for the collection, initializes and empty collection, and sets the initial state to unloaded
    constructor(model) {
        this.model = model;
        this.allModelsLoaded = false;
    }

    // allModelsLoaded is a flag used to determine whether a collection is complete or not
    get allModelsLoaded() {
        return this._modelsLoaded;
    }

    set allModelsLoaded(bool) {
        this._modelsLoaded = bool;
    }

    // collection is a hash map of {id: model} pairs
    get collection() {
        return this._collection;
    }

    set collection(collection) {
        this._collection = collection;
    }

    // the model class of the models in this collection
    get model() {
        return this._model;
    }

    set model(model) {
        this._model = model;
    }

    // async filter all local models by the given key value pair
    async findLocalModelByKeyValue(key, value) {
        if (key && value) {
            return await this.findAllLocalModels()
                .reduce((accumulator, model) => {
                    if (model[key] === value) {
                        accumulator.push(model);
                    }
                    return accumulator;
                }, []);
        } else {
            return new Error(`Both a key and a value are required to retrieve a model from a collection key: ${key}, value: ${value}`);
        }
    }

    // async filter all local models by the given key and value range
    async findLocalModelByKeyValueRange(key, lowerBound, upperBound) {
        if (key) {
            if (lowerBound >= 0 && upperBound >= lowerBound) {
                return await this.findAllLocalModels()
                    .reduce((accumulator, model) => {
                        if (model[key] >= lowerBound && model[key] <= upperBound) {
                            accumulator.push(model);
                        }
                        return accumulator;
                    }, []);
            } else {
                return new Error("A lowerBound and upperBound must be defined, upperBound must be greater than or equal to lowerBound");
            }
        } else {
            return new Error(`A key is required in order to retrieve a model by value range [${lowerBound}, ${upperBound}].`);
        }
    }

    // add a single model to the collection
    add(model) {
        if (!model) {
            return new Error("Collection.add method requires a model as a parameter");
        } else if (!model.id) {
            return new Error("The model being added has no id");
        } else {
            this.collection[model.id] = model;
            return true;
        }
    }

    // initialize the collection in an empty state
    initializeCollection() {
        this.collection = {};
        return true;
    }

    // return an array of all the models in the local collection
    findAllLocalModels() {
        return Object.values(this.collection);
    }

    // return a model with the id specified
    findLocalModelById(id) {
        if (id) {
            return this.collection[id];
        } else {
            return new Error("An id is required to retrieve a model from a collection");
        }
    }

    // remove a model from the local collection
    remove(model) {
        if (!model) {
            return new Error("Collection.remove method requires a model as a parameter");
        } else if (!model.id) {
            return new Error("The model being removed has no id");
        } else if (!this.collection[model.id]) {
            return new Error(`There is no model in the collection with id ${model.id} to remove`);
        } else if (model && this.collection[model.id]) {
            delete this.collection[model.id];
            return true;
        }
    }

    // remove all models from the local collection
    removeAll() {
        this.collection = {};
        this.allModelsLoaded = false;
        return true;
    }

}

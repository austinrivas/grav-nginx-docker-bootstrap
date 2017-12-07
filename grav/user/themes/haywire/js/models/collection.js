// Collection class is an abstract class that provides the basic features of a collection
// Collection is responsible for local filtering based on key value pairs and ranges
// Collection also provides the ability to add and remove individual models from its collection
export default class Collection {

    // constructors sets the model for the collection, initializes and empty collection, and sets the initial state to unloaded
    constructor (model) {
        this.model = model;
        this.collection = {};
        this.allModelsLoaded = false;
    }

    // allModelsLoaded is a flag used to determine whether a collection is complete or not
    get allModelsLoaded () {
        return this._modelsLoaded;
    }

    set allModelsLoaded (bool) {
        this._modelsLoaded = bool;
    }

    // collection is a hash map of {id: model} pairs
    get collection () {
        return this._collection;
    }

    set collection (collection) {
        this._collection = collection;
    }

    // the model class of the models in this collection
    get model () {
        return this._model;
    }

    set model (model) {
        this._model = model;
    }

    // add a single model to the collection
    add (model) {
        if (!model) {
            console.error("Collection.add method requires a model as a parameter");
        } else if (!model.id) {
            console.error("The model being removed has no id");
        } else {
            this.collection[model.id] = model;
        }
    }

    // return an array of all the models in the local collection
    findAllLocalModels () {
        return Object.values(this.collection);
    }

    // return a model with the id specified
    findLocalModelById (id) {
        if (id) {
            return this.collection[id];
        } else {
            console.error("An id is required to retrieve a model from a collection")
        }
    }

    // async filter all local models by the given key value pair
    async findLocalModelByKeyValue (key, value) {
        if (key && value) {
            return await this.findAllLocalModels()
                .reduce((accumulator, model) => {
                    if (model[key] === value) {
                        accumulator.push(model);
                    }
                    return accumulator;
                }, []);
        } else {
            console.error(`Both a key and a value are required to retrieve a model from a collection key: ${key}, value: ${value}`);
        }
    }

    // async filter all local models by the given key and value range
    async findLocalModelByKeyValueRange (key, lowerBound, upperBound) {
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
                console.error("A lowerBound and upperBound must be defined, upperBound must be greater than or equal to lowerBound");
            }
        } else {
            console.error(`A key is required in order to retrieve a model by value range [${lowerBound}, ${upperBound}].`);
        }
    }

    // remove a model from the local collection
    remove (model) {
        if (!model) {
            console.error("Collection.find method requires a model as a parameter");
        } else if (!model.id) {
            console.error("The model being removed has no id");
        } else if (!this.collection[model.id]) {
            console.error(`There is no model in the collection with id ${model.id}`);
        } else if (model && this.collection[model.id]) {
            delete this.collection[model.id];
        }
    }

    // remove all models from the local collection
    removeAll () {
        this.collection = {};
        this.allModelsLoaded = false;
    }

}

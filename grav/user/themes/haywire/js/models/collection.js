export default class Collection {

    constructor (model) {
        this.model = model;
        this.collection = {};
        this.allModelsLoaded = false;
    }

    get allModelsLoaded () {
        return this._modelsLoaded;
    }

    set allModelsLoaded (bool) {
        this._modelsLoaded = bool;
    }

    get collection () {
        return this._collection;
    }

    set collection (collection) {
        this._collection = collection;
    }

    get model () {
        return this._model;
    }

    set model (model) {
        this._model = model;
    }

    add (model) {
        if (!model) {
            console.error("Collection.add method requires a model as a parameter");
        } else if (!model.id) {
            console.error("The model being removed has no id");
        } else {
            this.collection[model.id] = model;
        }
    }

    findAll () {
        return Object.values(this.collection);
    }

    findById (id) {
        if (id) {
            return this.collection[id];
        } else {
            console.error("An id is required to retrieve a model from a collection")
        }
    }

    async findByKeyValue (key, value) {
        if (key && value) {
            return await this.findAll()
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

    async findByKeyValueRange (key, lowerBound, upperBound) {
        if (key) {
            if (lowerBound >= 0 && upperBound >= lowerBound) {
                return await this.findAll()
                    .reduce((accumulator, model) => {
                        console.log(model[key], [lowerBound, upperBound]);
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

    removeAll () {
        this.collection = {};
        this.allModelsLoaded = false;
    }

}

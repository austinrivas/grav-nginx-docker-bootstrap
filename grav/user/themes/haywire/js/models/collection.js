export default class Collection {

    constructor (model) {
        this.model = model;
        this.collection = {};
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
        return this.collection;
    }

    findById (id) {
        if (id) {
            return this.collection[id];
        } else {
            console.error("An id is required to retrieve a model from a collection")
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
    }

}

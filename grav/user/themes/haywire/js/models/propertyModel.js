import PROPERTY_FIELDS from "./propertyFields";

// PropertyModel is a simple data container class that maps ArcGIS feature field names to usable names
// PropertyModel wraps all properties in getter / setter methods to allow manipulation of values while maintaining immutable underlying data
export default class PropertyModel {
    constructor (arcFeature) {
        const attributes = arcFeature && arcFeature.attributes ? arcFeature.attributes : null;

        if (attributes) {
            this.acres = attributes[PROPERTY_FIELDS.acres];
            this.address = attributes[PROPERTY_FIELDS.address];
            this.association = attributes[PROPERTY_FIELDS.association];
            this.availability = attributes[PROPERTY_FIELDS.availability];
            this.blockId = attributes[PROPERTY_FIELDS.blockId];
            this.city = attributes[PROPERTY_FIELDS.city];
            this.description = attributes[PROPERTY_FIELDS.description];
            this.exteriorPerimeter = attributes[PROPERTY_FIELDS.exteriorPerimeter];
            this.featured = attributes[PROPERTY_FIELDS.featured];
            this.id = attributes[PROPERTY_FIELDS.id];
            this.imageUrl = attributes[PROPERTY_FIELDS.imageUrl];
            this.lotId = attributes[PROPERTY_FIELDS.lotId];
            this.objectId = attributes[PROPERTY_FIELDS.objectId];
            this.parkingDescription = attributes[PROPERTY_FIELDS.parkingDescription];
            this.pictureOrder = attributes[PROPERTY_FIELDS.pictureOrder];
            this.pricePerAcre = attributes[PROPERTY_FIELDS.pricePerAcre];
            this.pricePerSqft = attributes[PROPERTY_FIELDS.pricePerSqft];
            this.relatedProperties = attributes[PROPERTY_FIELDS.relatedProperties];
            this.shapeArea = attributes[PROPERTY_FIELDS.shapeArea];
            this.shapeLength = attributes[PROPERTY_FIELDS.shapeLength];
            this.subdivision = attributes[PROPERTY_FIELDS.subdivision];
            this.totalPrice = attributes[PROPERTY_FIELDS.totalPrice];
            this.totalSqft = attributes[PROPERTY_FIELDS.totalSqft];
            this.type = attributes[PROPERTY_FIELDS.type];
            this.utilities = attributes[PROPERTY_FIELDS.utilities];
            this.zip = attributes[PROPERTY_FIELDS.zip];
        } else {
            return new Error("Unable to initialize property without attributes", arcFeature);
        }
    }

    get acres () {
        return this._acres;
    }

    set acres (acres) {
        this._acres = acres;
    }

    get address () {
        return this._address;
    }

    set address (address) {
        this._address = address;
    }

    get association () {
        return this._association;
    }

    set association (association) {
        this._association = association;
    }

    get availability () {
        return this._availability;
    }

    set availability (availability) {
        this._availability = availability;
    }

    get blockId () {
        return this._blockId;
    }

    set blockId (blockId) {
        this._blockId = blockId;
    }

    get city () {
        return this._city;
    }

    set city (city) {
        this._city = city;
    }

    get description () {
        return this._description;
    }

    set description (description) {
        this._description = description;
    }

    get exteriorPerimeter () {
        return this._exteriorPerimeter;
    }

    set exteriorPerimeter (exteriorPerimeter) {
        this._exteriorPerimeter = exteriorPerimeter;
    }

    // cast the featured value as a boolean on access
    get featured () {
        return this._featured === "TRUE";
    }

    set featured (featured) {
        this._featured = featured;
    }

    get id () {
        return this._id;
    }

    set id (id) {
        this._id = id;
    }

    get imageUrl () {
        return this._imageUrl;
    }

    set imageUrl (imageUrl) {
        this._imageUrl = imageUrl;
    }

    get lotId () {
        return this._lotId;
    }

    set lotId (lotId) {
        this._lotId = lotId;
    }

    get objectId () {
        return this._objectId;
    }

    set objectId (objectId) {
        this._objectId = objectId;
    }

    get parkingDescription () {
        return this._parkingDescription;
    }

    set parkingDescription (parkingDescription) {
        this._parkingDescription = parkingDescription;
    }

    get pictureOrder () {
        return this._pictureOrder;
    }

    set pictureOrder (pictureOrder) {
        this._pictureOrder = pictureOrder;
    }

    get pricePerAcre () {
        return this._pricePerAcre;
    }

    set pricePerAcre (pricePerAcre) {
        this._pricePerAcre = pricePerAcre;
    }

    get pricePerSqft () {
        return this._pricePerSqft;
    }

    set pricePerSqft (pricePerSqft) {
        this._pricePerSqft = pricePerSqft;
    }

    get relatedProperties () {
        return this._relatedProperties;
    }

    set relatedProperties (relatedProperties) {
        this._relatedProperties = relatedProperties;
    }

    get shapeArea () {
        return this._relatedProperties;
    }

    set shapeArea (shapeArea) {
        this._shapeArea = shapeArea;
    }

    get shapeLength () {
        return this._shapeLength;
    }

    set shapeLength (shapeLength) {
        this._shapeLength = shapeLength;
    }

    get subdivision () {
        return this._subdivision;
    }

    set subdivision (subdivision) {
        this._subdivision = subdivision;
    }

    get subdivision () {
        return this._subdivision;
    }

    set subdivision (subdivision) {
        this._subdivision = subdivision;
    }

    get totalPrice () {
        return this._totalPrice;
    }

    set totalPrice (totalPrice) {
        this._totalPrice = totalPrice;
    }

    get totalSqft () {
        return this._totalSqft;
    }

    set totalSqft (totalSqft) {
        this._totalSqft = totalSqft;
    }

    get type () {
        return this._type;
    }

    set type (type) {
        this._type = type;
    }

    get utilities () {
        return this._utilities;
    }

    set utilities (utilities) {
        this._utilities = utilities;
    }

    get zip () {
        return this._zip;
    }

    set zip (zip) {
        this._zip = zip;
    }

    // return a JSON representation of the model using pretty field names
    toJSON () {
        return {
            acres: this.acres,
            address: this.address,
            association: this.association,
            availability: this.availability,
            blockId: this.blockId,
            city: this.city,
            description: this.description,
            exteriorPerimeter: this.exteriorPerimeter,
            featured: this.featured,
            id: this.id,
            imageUrl: this.imageUrl,
            lotId: this.lotId,
            objectId: this.objectId,
            parkingDescription: this.parkingDescription,
            pictureOrder: this.pictureOrder,
            pricePerAcre: this.pricePerAcre,
            pricePerSqft: this.pricePerSqft,
            relatedProperties: this.relatedProperties,
            shapeArea: this.shapeArea,
            shapeLength: this.shapeLength,
            subdivision: this.subdivision,
            totalPrice: this.totalPrice,
            totalSqft: this.totalSqft,
            type: this.type,
            utilities: this.utilities,
            zip: this.zip
        }
    }
}

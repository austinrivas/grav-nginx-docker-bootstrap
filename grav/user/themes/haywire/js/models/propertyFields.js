const modelPropertiesId = "arcgis-model-properties",
    modelPropertiesJSON = JSON.parse(document.getElementById(modelPropertiesId).innerHTML);

// the PROPERTY_FIELDS object acts a mapping between ArcGIS feature field names and model properties used in the app
export default modelPropertiesJSON.reduce((accumulator, property) => {
    accumulator[property.key] = property['arc-key'];

    return accumulator;
}, {});

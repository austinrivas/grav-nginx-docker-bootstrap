const modelPropertiesId = "arcgis-model-properties",
    modelPropertiesJSON = JSON.parse(document.getElementById(modelPropertiesId).innerHTML);

// the PROPERTY_LABELS object acts a mapping between model properties and their UI labels
export default modelPropertiesJSON.reduce((accumulator, property) => {
    accumulator[property.key] = property.label;
    return accumulator;
}, {});

const modelPropertiesId = "arcgis-model-properties",
    modelJSON = JSON.parse(document.getElementById(modelPropertiesId).innerHTML),
    arcKey = 'arc-key',
    labelKey = 'label';

function parseModelJSON(jsonArray, field) {
    return jsonArray.reduce((accumulator, property) => {
        accumulator[property.key] = property[field];
        return accumulator;
    }, {});
}

export const PROPERTY_FIELDS = parseModelJSON(modelJSON, arcKey);

export const PROPERTY_LABELS = parseModelJSON(modelJSON, labelKey);

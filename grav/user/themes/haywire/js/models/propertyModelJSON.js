import _filter from 'lodash/filter'
import _indexOf from 'lodash/indexOf'

export const ENUMERABLE_TYPE = 'enumerable';

export const RANGE_TYPE = 'range';

const modelPropertiesId = "arcgis-model-properties",
    modelJSON = JSON.parse(document.getElementById(modelPropertiesId).innerHTML),
    arcKey = 'arc-key',
    filterableKey = 'filterable',
    labelKey = 'label',
    modelKey = 'key',
    typeKey = 'field-type';

function createFilterMap(jsonArray, key, types) {
    return _filter(jsonArray, (field) => {
        return !!field[filterableKey] && _indexOf(types, field[typeKey]) !== -1;
    }).reduce((accumulator, field) => {
        accumulator[field[key]] = {
            field: field[arcKey],
            filter: field[modelKey],
            label: field[labelKey],
            type: field[typeKey]
        };
        return accumulator;
    }, {});
}

function parseModelJSON(jsonArray, field) {
    return jsonArray.reduce((accumulator, property) => {
        accumulator[property.key] = property[field];
        return accumulator;
    }, {});
}


export const PROPERTY_FIELDS = parseModelJSON(modelJSON, arcKey);

export const PROPERTY_LABELS = parseModelJSON(modelJSON, labelKey);

export const PROPERTY_FILTERS = createFilterMap(modelJSON, modelKey, [ENUMERABLE_TYPE, RANGE_TYPE]);

export const PROPERTY_FILTERABLE_FIELDS = createFilterMap(modelJSON, arcKey, [ENUMERABLE_TYPE, RANGE_TYPE]);

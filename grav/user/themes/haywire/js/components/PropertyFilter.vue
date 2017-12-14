<script>
    import _filter from 'lodash/filter';
    import _includes from 'lodash/includes';
    import PROPERTY_FIELDS from '../models/propertyFields';
    import PROPERTY_LABELS from '../models/propertyLabels';

    export default {

        mounted: async function () {
            let _this = this;

            _this.filterFields = await _this.getFilterFields(_this.filterKeys);
            _this.nonRangeFilterFields = await _this.getNonRangeFilterFields(_this.filterFields);
            _this.filterOptions = await _this.getFilterOptions(_this.filterKeys);

            if (_this.selectedFilterField) {
                _this.selectedFilterOptions = await _this.getDistinctFilterOptions(PROPERTY_FIELDS.type);
            }
        },

        data: function () {
            return {
                filterFields: [],
                filterKeys: [
                    'subdivision',
                    'type',
                    'status',
                    'acres'
                ],
                filterOptions: [],
                selectedFilterField: null,
                selectedFilterOptions: [],
                selectedFilterValue: null
            }
        },

        computed: {
            showSlider: function () {
                let _this = this;
                return _this.selectedFilterField === PROPERTY_FIELDS.acres;
            },
            showFilterOptions: function () {
                let _this = this;
                return _includes(_this.nonRangeFilterFields, _this.selectedFilterField);
            }
        },

        watch: {
            selectedFilterField: async function () {
                let _this = this,
                    features = await _this.getDistinctFilterOptions(_this.selectedFilterField);

                if (features && features.length) {
                    _this.selectedFilterOptions = await features.reduce((accumulator, feature) => {
                        let filterValue = feature.attributes[_this.selectedFilterField];

                        if (filterValue) {
                            accumulator.push({ text: filterValue, value: filterValue });
                        }

                        return accumulator;
                    }, []);
                }
            }
        },

        methods: {
            createFilterLabel: function (label) {
                return `Filter by ${label}`
            },
            getDistinctFilterOptions: async function (field) {
                let features = await ArcModel.executeQuery([field], ArcModelClass.queryWhereSelectAll(), true);
                return features && features.length ? features : [];
            },
            getFilterFields: async function (keys) {
                return keys && keys.length ? await keys.reduce((accumulator, key) => {
                    let value = PROPERTY_FIELDS[key];

                    if (value) {
                        accumulator.push(value);
                    }

                    return accumulator;
                }, []) : [];
            },
            getFilterOptions: async function (keys) {
                let _this = this;
                return keys && keys.length ? await keys.reduce((accumulator, key) => {
                    let label = _this.createFilterLabel(PROPERTY_LABELS[key]),
                        value = PROPERTY_FIELDS[key];

                    if (label && value) {
                        accumulator.push({text: label, value: value});
                    }

                    return accumulator;
                }, []) : [];
            },
            getNonRangeFilterFields: async function (fields) {
                return fields && fields.length ? await _filter(fields, (field) => {
                    return field !== PROPERTY_FIELDS.acres;
                }) : [];
            }
        }
    }
</script>

<script>
    import _filter from 'lodash/filter';
    import _includes from 'lodash/includes';
    import EventBus from '../event-handlers/event-bus';
    import PROPERTY_FIELDS from '../models/propertyFields';
    import PROPERTY_LABELS from '../models/propertyLabels';

    export default {

        created() {
            let _this = this;

            EventBus.$on(_this.filterChangeEvent, _this.filterChangeHandler);
            EventBus.$on(_this.filterValueChangeEvent, _this.filterValueChangeHandler);
            EventBus.$on(_this.rangeSliderChangeEvent, _this.rangeSliderChangeHandler);
        },

        async mounted() {
            let _this = this;

            _this.filterFields = await _this.getFilterFields(_this.filterKeys);
            _this.nonRangeFilterFields = await _this.getNonRangeFilterFields(_this.filterFields);
            _this.filterOptions = await _this.getFilterOptions(_this.filterKeys);

            if (_this.selectedFilterField && _this.selectedFilterField !== _this.defaultUnselectedValue) {
                _this.selectedFilterOptions = await _this.getDistinctFilterOptions(_this.selectedFilterField);
            }
        },

        data() {
            let defaultUnselectedValue = "unselected";
            return {
                defaultUnselectedValue: defaultUnselectedValue,
                filterChangeEvent: 'filterChanged',
                filterValueChangeEvent: 'filterValueChanged',
                filterFields: [],
                filterKeys: [
                    'subdivision',
                    'type',
                    'status',
                    'acres'
                ],
                filterOptions: [],
                nonRangeFilterFields: [],
                rangeSliderChangeEvent: 'rangeSliderChanged',
                rangeSliderValues: [1, 10],
                rangeSliderMinValue: 0,
                rangeSliderMaxValue: 20,
                rangeSliderOutputFunction(values) {
                    if (values && values.length === 2) {
                        return `${values[0]} to ${values[1]} Acres`;
                    } else {
                        return `Undefined Range`;
                    }
                },
                rangeSliderStep: 1,
                selectedFilterField: defaultUnselectedValue,
                selectedFilterOptions: [],
                selectedFilterValue: defaultUnselectedValue
            }
        },

        computed: {
            showSlider() {
                let _this = this;
                return _this.selectedFilterField === PROPERTY_FIELDS.acres;
            },
            showFilterOptions() {
                let _this = this;
                return _includes(_this.nonRangeFilterFields, _this.selectedFilterField);
            }
        },

        watch: {
            async selectedFilterField() {
                let _this = this,
                    features = await _this.getDistinctFilterOptions(_this.selectedFilterField);

                if (features && features.length) {
                    _this.selectedFilterOptions = await features.reduce((accumulator, feature) => {
                        let filterValue = feature.attributes[_this.selectedFilterField];

                        if (filterValue) {
                            accumulator.push({text: filterValue, value: filterValue});
                        }

                        return accumulator;
                    }, []);
                }
            },
            async selectedFilterValue() {
                let _this = this;
                console.log('watch value', _this.selectedFilterValue);
            }
        },

        methods: {
            async getDistinctFilterOptions(field) {
                let features = await ArcModel.executeQuery([field], ArcModelClass.queryWhereSelectAll(), true);

                return features && features.length > 0 ? features : [];
            },
            async getFilterFields(keys) {
                return keys && keys.length ? await keys.reduce((accumulator, key) => {
                    let value = PROPERTY_FIELDS[key];

                    if (value) {
                        accumulator.push(value);
                    }

                    return accumulator;
                }, []) : [];
            },
            async getFilterOptions(keys) {
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
            async getNonRangeFilterFields(fields) {
                return fields && fields.length ? await _filter(fields, (field) => {
                    return field !== PROPERTY_FIELDS.acres;
                }) : [];
            },
            createFilterLabel(label) {
                return `Filter by ${label}`
            },
            filterChangeHandler(filter) {
                let _this = this;

                if (filter && filter.length) {
                    _this.selectedFilterField = filter;
                }
            },
            filterValueChangeHandler(value) {
                let _this = this;

                if (value && value.length) {
                    _this.selectedFilterValue = value;
                }
            },
            rangeSliderChangeHandler(value) {
                let _this = this;

                if (value && value.length === 2) {
                    _this.rangeSliderValues = value;
                }
            }
        }
    }
</script>

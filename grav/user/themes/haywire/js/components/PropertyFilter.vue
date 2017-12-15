<script>
    import _filter from 'lodash/filter';
    import _includes from 'lodash/includes';
    import EventBus from '../event-handlers/event-bus';
    import PROPERTY_FIELDS from '../models/propertyFields';
    import PROPERTY_LABELS from '../models/propertyLabels';

    export default {

        created() {
            let _this = this;

            if (EventBus && EventBus.$on && EventBus.$emit) {
                _this.eventBus = EventBus;
                _this.eventBus.$on(_this.filterChangeEvent, _this.filterChangeHandler);
                _this.eventBus.$on(_this.filterValueChangeEvent, _this.filterValueChangeHandler);
                _this.eventBus.$on(_this.rangeSliderChangeEvent, _this.rangeSliderChangeHandler);
            }
        },

        async mounted() {
            let _this = this;

            _this.filterFields = await _this.getFilterFields(_this.filterKeys);
            _this.enumerableFilterFields = await _this.getEnumerableFilterFields(_this.filterFields);
            _this.rangeFilterFields = await _this.getRangeFilterFields(_this.filterFields);
            _this.filterOptions = await _this.getFilterOptions(_this.filterKeys);

            if (_this.selectedFilterField && _this.selectedFilterField !== _this.defaultUnselectedValue) {
                _this.selectedFilterOptions = await _this.getDistinctFilterOptions(_this.selectedFilterField);
            }
        },

        data() {
            let defaultUnselectedValue = "unselected";
            return {
                defaultUnselectedValue: defaultUnselectedValue,
                enumerableFilterFields: [],
                eventBus: null,
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
                rangeFilterFields: [],
                rangeSliderChangeEvent: 'rangeSliderChanged',
                rangeSliderValues: null,
                rangeSliderMinValue: null,
                rangeSliderMaxValue: null,
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
                return _this.rangeSliderMinValue && _this.rangeSliderMaxValue && _this.isFieldOfType(_this.rangeFilterFields, _this.selectedFilterField);
            },
            showFilterOptions() {
                let _this = this;
                return _this.isFieldOfType(_this.enumerableFilterFields, _this.selectedFilterField);
            }
        },

        watch: {
            async selectedFilterField() {
                let _this = this,
                    features = await _this.getDistinctFilterOptions(_this.selectedFilterField);

                if (features && features.length) {
                    if (_this.isFieldOfType(_this.enumerableFilterFields, _this.selectedFilterField)) {
                        _this.selectedFilterOptions = await _this.getSelectedFilterOptions(features, _this.selectedFilterField);
                    } else if (_this.isFieldOfType(_this.rangeFilterFields, _this.selectedFilterField)) {
                        let range = await _this.getSelectedFilterRange(features, _this.selectedFilterField);

                        if (range && range.length === 2) {
                            _this.rangeSliderMinValue = range[0];
                            _this.rangeSliderMaxValue = range[1];
                        }
                    }
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
            async getEnumerableFilterFields(fields) {
                return fields && fields.length ? await _filter(fields, (field) => {
                    return field !== PROPERTY_FIELDS.acres;
                }) : [];
            },
            async getRangeFilterFields(fields) {
                return fields && fields.length ? await _filter(fields, (field) => {
                    return field === PROPERTY_FIELDS.acres;
                }) : [];
            },
            async getSelectedFilterOptions(features, field) {
                if (features && features.length && field && field.length) {
                    return await features.reduce((accumulator, feature) => {
                        let filterValue = feature.attributes[field];

                        if (filterValue) {
                            accumulator.push({text: filterValue, value: filterValue});
                        }

                        return accumulator;
                    }, []);
                } else {
                    return [];
                }
            },
            async getSelectedFilterRange(features, field) {
                if (features && features.length && field && field.length) {
                    return await features.reduce((accumulator, feature) => {
                        let value = feature.attributes[field];

                        if (value) {
                            if (!accumulator[0] || value < accumulator[0]) {
                                accumulator[0] = Math.floor(JSON.parse(value));
                            } else if (!accumulator[1] || value > accumulator[1]) {
                                accumulator[1] = Math.ceil(JSON.parse(value));
                            }
                        }

                        return accumulator;
                    }, [null, null]);
                } else {
                    return [0, 1];
                }
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
            isFieldOfType(fieldArray, field) {
                return fieldArray && fieldArray.length && field && field.length && _includes(fieldArray, field);
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
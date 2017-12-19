<script>
    import _filter from 'lodash/filter';
    import _includes from 'lodash/includes';
    // map of property fields TODO: ADD TO CMS
    import PROPERTY_FIELDS from '../models/propertyFields';
    // map of property labels TODO: ADD TO CMS
    import PROPERTY_LABELS from '../models/propertyLabels';

    export default {
        props: [
            'applyFilterEvent', // named event for applying the current filter
            'eventBus', // shared eventBus
            'filters', // list of filterable keys on the PropertyModel
            'gridView', // named grid view
            'listView', // current list view state
            'listViewChangeEvent', // named event for changing list view
            'tableView' // named table view
        ],

        // runs when component is declared in memory
        created() {
            let _this = this;
            // duck type event bus before event binding
            if (_this.eventBus && _this.eventBus.$on && _this.eventBus.$emit) {
                _this.eventBus.$on(_this.filterChangeEvent, _this.filterChangeHandler);
                _this.eventBus.$on(_this.filterValueChangeEvent, _this.filterValueChangeHandler);
                _this.eventBus.$on(_this.rangeSliderChangeEvent, _this.rangeSliderChangeHandler);
            }
        },

        // runs when component is attached to the DOM
        async mounted() {
            let _this = this;

            // get the arc field names based on the filterable keys
            _this.fields = await _this.getFilterFields(_this.filters);
            // get the labels for the top level filters to be displayed as select options
            _this.filterOptions = await _this.getFilterOptions(_this.filters);
            // if there is a selected filter field and its value is not the unselected option
            if (_this.selectedFilterField && _this.selectedFilterField !== _this.defaultUnselectedValue) {
                // get the distinct values for the filter enumerable options
                _this.selectedFilterOptions = await _this.getDistinctFilterOptions(_this.selectedFilterField);
            }
        },

        data() {
            let defaultUnselectedValue = "unselected"; // the value of the default unselected option
            return {
                defaultUnselectedValue: defaultUnselectedValue, // the value of the default unselected option
                enumerableFilterFields: [], // initial enumerable filterable fields
                enumerableType: 'enumerable',
                fields: {},
                filterChangeEvent: 'filterChanged', // named event for a top level filter change
                filterValueChangeEvent: 'filterValueChanged', // named event for the value of a filter changing
                filterOptions: [], // initial filter options
                rangeFilterFields: [], // initial range filterable fields
                rangeSliderChangeEvent: 'rangeSliderChanged', // named event for range slider change
                rangeSliderValues: null, // initial range slider value
                rangeSliderMinValue: null, // initial range slider min value
                rangeSliderMaxValue: null, // initial range slider max value
                rangeSliderOutputFunction(values) { // renders a string to be shown as the output of the range slider component
                    if (values && values.length === 2) {
                        return `${values[0]} to ${values[1]} Acres`;
                    } else {
                        return `Undefined Range`;
                    }
                },
                rangeSliderStep: 1, // default range slider step
                rangeType: 'range',
                selectedFilterField: defaultUnselectedValue, // initial unselected value for filter field
                selectedFilterOptions: [], // initial value for selected filter field options
                selectedFilterValue: defaultUnselectedValue // initial unselected value for selected filter value
            }
        },

        computed: {
            // computed property for showing / hiding grid list view when active / inactive
            isGridListViewActive() {
                let _this = this;
                return _this.listView === _this.gridView;
            },
            // computed property for showing / hiding grid table view when active / inactive
            isTableListViewActive() {
                let _this = this;
                return _this.listView === _this.tableView;
            },
            // computed property for showing / hiding apply button depending on filter selection state
            showApplyButton() {
                let _this = this;
                // if the currently selected field is an enumerable property
                if (_this.isFieldOfType(_this.enumerableType, _this.selectedFilterField, _this.fields)) {
                    // show the apply button as long as the selected value is not the default unselected value
                    return _this.selectedFilterValue !== _this.defaultUnselectedValue;
                // if the currently selected field is a range property
                } else if (_this.isFieldOfType(_this.rangeType, _this.selectedFilterField, _this.fields)) {
                    // show the apply button as long as the range value contains to values
                    return _this.rangeSliderValues && _this.rangeSliderValues.length === 2;
                }
            },
            // computed property for showing / hiding the range slider
            showSlider() {
                let _this = this;
                // if the slider has a min / max defined and the currently selected field is a range field
                return _this.rangeSliderMinValue && _this.rangeSliderMaxValue && _this.isFieldOfType(_this.rangeType, _this.selectedFilterField, _this.fields);
            },
            // computed property for showing / hiding the enumerable select options
            showFilterOptions() {
                let _this = this;
                // if the currently selected field is an enumerable field show the options
                return _this.isFieldOfType(_this.enumerableType, _this.selectedFilterField, _this.fields);
            }
        },

        // watch the given properties for changes and run a function
        watch: {
            // watch the selected filter field and async update the options / range depeding the field selection
            async selectedFilterField() {
                let _this = this,
                    // get the distinct enumerable options for the selected filter field
                    distinctOptions = await _this.getDistinctFilterOptions(_this.selectedFilterField);
                // if there are distinct options for the selected field
                if (distinctOptions && distinctOptions.length) {
                    // if the selected field is an enumerable field
                    if (_this.isFieldOfType(_this.enumerableType, _this.selectedFilterField, _this.fields)) {
                        // set the selected value to be the default unselected value
                        _this.selectedFilterValue = _this.defaultUnselectedValue;
                        // set the enumerable options to be the distinct enumerable options
                        _this.selectedFilterOptions = await _this.getSelectedFilterOptions(distinctOptions, _this.selectedFilterField);
                    // if the field is a range field
                    } else if (_this.isFieldOfType(_this.rangeType, _this.selectedFilterField, _this.fields)) {
                        // get the min / max of the given rangeable field
                        let range = await _this.getSelectedFilterRange(distinctOptions, _this.selectedFilterField);
                        // if a range has be defined
                        if (range && range.length === 2) {
                            // set the min of the range
                            _this.rangeSliderMinValue = range[0];
                            // set the max of the range
                            _this.rangeSliderMaxValue = range[1];
                            // if the currently selected range values is null
                            if (!_this.rangeSliderValues) {
                                // set the current selected range to be equal to the min / max of the range
                                _this.rangeSliderValues = range;
                            }
                        }
                    }

                }
            }
        },

        methods: {
            // get the distinct values for a given arc property
            async getDistinctFilterOptions(field) {
                let features = await ArcModel.executeQuery([field], ArcModelClass.queryWhereSelectAll(), true);
                return features && features.length > 0 ? features : [];
            },
            // create a map of arc fields to filters
            async getFilterFields(filters) {
                // if keys reduce the array to an array of arc keys
                return filters ? await Object.keys(filters).reduce((accumulator, key) => {
                    let filter = filters[key];
                    accumulator[filter.field] = {
                        filter: key,
                        label: filter.label,
                        type: filter.type
                    };
                    return accumulator;
                }, {}) : {};
            },
            // get the filter options for an array of arc fields
            async getFilterOptions(filters) {
                let _this = this;
                // if keys reduce the array to an array of objects with text / value props
                return filters ? await Object.keys(filters).reduce((accumulator, key) => {
                    let label = _this.createFilterLabel(filters[key].label),
                        field = filters[key] ? filters[key].field : null;
                    if (label && field) { accumulator.push({text: label, value: field }); }
                    return accumulator;
                }, []) : [];
            },
            // get an array of fields for a given type from a array of filters
            async getFieldsOfType(type, filters) {
                return type && filters ? await _filter(Object.keys(filters), (key) => {
                    return key && filters[key].type === type;
                }) : [];
            },
            // get the select option text / value pairs for a given arc field and its distinct options
            async getSelectedFilterOptions(distinctArcFeatures, field) {
                // if the distinctArcFeatures and field are defined
                if (distinctArcFeatures && distinctArcFeatures.length && field && field.length) {
                    // reduce the distinctArcFeatures into an array of text / value objects
                    return await distinctArcFeatures.reduce((accumulator, feature) => {
                        // get the value of the given arc feature field
                        let filterValue = feature.attributes[field];
                        // if the value is defined add it to the accumulator as a selectable option
                        if (filterValue) { accumulator.push({text: filterValue, value: filterValue}); }
                        return accumulator;
                    }, []);
                } else {
                    return [];
                }
            },
            // get a min / max range for a rangeable field from a set of distinct arc features
            async getSelectedFilterRange(distinctArcFeatures, field) {
                // if the distinctArcFeatures and field are defined
                if (distinctArcFeatures && distinctArcFeatures.length && field && field.length) {
                    // reduce the distinctArcFeatures array into an array that contains 1 min and 1 max value
                    return await distinctArcFeatures.reduce((accumulator, feature) => {
                        // get the value of the current field
                        let value = feature.attributes[field];
                        if (value) {
                            // if the current value is less than the current min
                            if (!accumulator[0] || value < accumulator[0]) {
                                // round the current value down and set it as the new min
                                accumulator[0] = Math.floor(JSON.parse(value));
                            // if the current value is greater than the current max
                            } else if (!accumulator[1] || value > accumulator[1]) {
                                // round the current value up and set it as the new max
                                accumulator[1] = Math.ceil(JSON.parse(value));
                            }
                        }
                        return accumulator;
                    }, [null, null]); // null values used instead of 0 to account for potential negatives
                } else {
                    // default range of 0-1
                    return [0, 1];
                }
            },
            // string interpolator for generating a filter label
            createFilterLabel(label) {
                return `Filter by ${label}`;
            },
            // event handler for filter application to the query handler
            executeQueryHandler() {
                let _this = this,
                    value = null;
                // if the currently selected field is enumerable and not the default unselected value
                if (_this.isFieldOfType(_this.enumerableType, _this.selectedFilterField, _this.fields) && _this.selectedFilterValue !== _this.defaultUnselectedValue) {
                    // set the value of the query to the currently selected value
                    value = _this.selectedFilterValue;
                // if the currently selected field a rangeable value and not default unselected value
                } else if (_this.isFieldOfType(_this.rangeType, _this.selectedFilterField, _this.fields) && _this.rangeSliderValues && _this.rangeSliderValues.length === 2) {
                    // set the value of the query to the currently selected value
                    value = _this.rangeSliderValues;
                }
                // if there is a currently selected field with a valid value
                if (_this.selectedFilterField && value) {
                    // use the shared event bus to emit a query execution event using the current field and value
                    _this.eventBus.$emit(_this.applyFilterEvent, {
                        field: _this.selectedFilterField,
                        value: value
                    });
                }
            },
            // event handler for filter change
            filterChangeHandler(filter) {
                let _this = this;
                if (filter && filter.length) { _this.selectedFilterField = filter; }
            },
            // event handler for filter value change
            filterValueChangeHandler(value) {
                let _this = this;
                if (value && value.length) { _this.selectedFilterValue = value; }
            },
            // helper method for determining if a field is of a certain type
            isFieldOfType(type, field, fields) {
                return fields && field && type && fields[field] && fields[field].type === type;
            },
            // event handler for the showTableListView event
            showTableListViewHandler() {
                let _this = this;
                // if the current list view is not the table view emit an event to change the list view to the table view
                if (_this.listView !== _this.tableView) { _this.eventBus.$emit(_this.listViewChangeEvent, _this.tableView); }
            },
            // event handler for the showGridListView event
            showGridListViewHandler() {
                let _this = this;
                // if the current list view is not the grid view emit an event to change the list view to the grid view
                if (_this.listView !== _this.gridView) { _this.eventBus.$emit(_this.listViewChangeEvent, _this.gridView); }
            },
            // event handler for the range slider change event
            rangeSliderChangeHandler(value) {
                let _this = this;
                // if the new value for the range slider is an array of length 2 set it as the new value
                if (value && value.length === 2) { _this.rangeSliderValues = value; }
            }
        }
    }
</script>

<script>
    // creates an object composed of picked object properties
    import _pick from 'lodash/pick';
    // property field definitions TODO: MOVE INTO CMS
    import PROPERTY_FIELDS from '../models/propertyFields';
    import PROPERTY_LABELS from '../models/propertyLabels';

    // This is a parent component that is responsible for maintaining the state of the map aggregate page
    // it fetches data from the local collections / arc api and feeds the data into the filter / map / list child components
    export default {
        props: [
            'eventBus', // the shared event bus
            'filter', // the currently selected filter
            'listView', // the currently selected view for the result list
            'rawFilterValue', // the current value to filter by
            'updateUrlParamsEvent' // named event to update the page state url params
        ],

        // runs when component is declared in memory
        created() {
            let _this = this;
            // duck type the eventBus before binding events to it
            if (_this.eventBus && _this.eventBus.$on && _this.eventBus.$emit) {
                _this.eventBus.$on(_this.listViewChangeEvent, _this.handleListViewChange);
                _this.eventBus.$on(_this.applyFilterEvent, _this.handleApplyFilter);
            }
            // create a filters map of only the filterable fields
            _this.filters = _this.createFilterMap(PROPERTY_FIELDS, PROPERTY_LABELS, _this.filters)
        },

        // runs when component is attached to DOM
        async mounted() {
            let _this = this;

            if (_this.filter && _this.filters[_this.filter] && _this.filters[_this.filter].type === _this.rangeType) {
                _this.filterValue = _this.rawFilterValue ? _this.rawFilterValue.split(',').reduce((accumulator, element) => {
                    accumulator.push(parseInt(element));
                    return accumulator;
                }, []) : null;
            } else {
                _this.filterValue = _this.rawFilterValue;
            }

            _this.collection = await _this.executeQuery({
                filter: _this.filter,
                field: _this.filter ? PROPERTY_FIELDS[_this.filter] : null,
                value: _this.filterValue
            });

            _this.setListView(_this.listView);

            _this.getCustomFilterAttributes();
        },

        // provides the data context for the component
        data() {
            // names for the grid and table views
            // these names are used by child components to trigger list view changes
            let gridView = 'grid',
                tableView = 'table',
                enumerableType = 'enumerable',
                rangeType = 'range';
            return {
                applyFilterEvent: 'applyFilter', // named event for triggering query execution from child components
                collection: null, // initial collection state
                customFilterField: null,
                customFilterLabel: null,
                customFilterValue: null,
                enumerableType: enumerableType, // the named type for enumerable filters
                filters: {
                    acres: {
                        type: rangeType
                    },
                    type: {
                        type: enumerableType
                    },
                    status: {
                        type: enumerableType
                    },
                    subdivision: {
                        type: enumerableType
                    }
                },
                filterValue: null, // the sanitized filter value
                gridItemsInRow: 3, // default row length for grid list view
                gridView: gridView, // named grid list view
                listViewChangeEvent: 'listViewChange', // named event for triggering list view change
                rangeType: rangeType, // the named type for range filters
                selectedListView: gridView, // the selected list view for results
                tableView: tableView // named table list view
            }
        },

        computed: {
            customFilter() {
                let _this = this;
                return {
                    field: _this.customFilterField,
                    label: _this.customFilterLabel,
                    value: _this.customFilterValue
                }
            },
            // computed prop to show / hide grid list view
            showGrid() {
                let _this = this;
                return _this.selectedListView === _this.gridView;
            },
            // computed prop to show / hide table list view
            showTable() {
                let _this = this;
                return _this.selectedListView === _this.tableView;
            }
        },

        watch: {
            // watch the component prop and updated selected view
            listView() {
                let _this = this;
                _this.setListView(_this.listView);
            },
            // fire a event to update the url params with the current list view state
            selectedListView() {
                let _this = this;
                _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                    listView: _this.selectedListView
                });
            }
        },

        methods: {
            // execute the given query and return the result async
            async executeQuery(query) {
                let _this = this,
                    result = [],
                    favoritesFilter = 'favorites';
                // if the query is defined with a field and value
                if (query) {
                    // retrieve the query result by accessing the Properties collection methods for the field
                    if (query.filter === favoritesFilter) {
                        result = await FavoriteProperties.findAllLocalModels();
                        _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                            filter: favoritesFilter,
                            filterValue: null
                        });
                    } else {
                        switch (query.field) {
                            case PROPERTY_FIELDS.acres:
                                if (query.value && query.value.length === 2 && query.value[0] && query.value[1]) {
                                    result = await Properties.findPropertiesByAcreageRange(query.value[0], query.value[1]);
                                    _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                        filter: query.filter,
                                        filterValue: query.value
                                    });
                                }
                                break;
                            case PROPERTY_FIELDS.subdivision:
                                result = await Properties.findPropertiesBySubdivision(query.value);
                                _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                    filter: query.filter,
                                    filterValue: query.value
                                });
                                break;
                            case PROPERTY_FIELDS.status:
                                result = await Properties.findPropertiesByType(query.value);
                                _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                    filter: query.filter,
                                    filterValue: query.value
                                });
                                break;
                            case PROPERTY_FIELDS.type:
                                result = await Properties.findPropertiesByType(query.value);
                                _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                    filter: query.filter,
                                    filterValue: query.value
                                });
                                break;
                            default:
                                result = await Properties.findAllProperties();
                                _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                    filter: null,
                                    filterValue: null
                                });
                                break;
                        }
                    }
                }
                // return the query result
                return result;
            },
            // handle the executeQuery event
            async handleApplyFilter(query) {
                let _this = this;
                // set the collection property to the result of executing the query
                _this.collection = await _this.executeQuery(query);
            },
            // creates a map of filterable fields and their labels
            createFilterMap(fields, labels, filters) {
                let keys = Object.keys(_pick(fields, Object.keys(filters)));
                return keys.reduce((accumulator, key) => {
                    if (!accumulator[key].field && fields[key]) {
                        accumulator[key].field = fields[key];
                    }
                    if (!accumulator[key].label && labels[key]) {
                        accumulator[key].label = labels[key];
                    }
                    return accumulator;
                }, filters);
            },
            // gets the custom filter attributes from cms defined meta tags
            getCustomFilterAttributes() {
                let _this = this;
                _this.customFilterField = _this.$refs.customFilterField ? _this.$refs.customFilterField.content : null;
                _this.customFilterValue = _this.$refs.customFilterValue ? _this.$refs.customFilterValue.content : null;
                _this.customFilterLabel = _this.$refs.customFilterLabel ? _this.$refs.customFilterLabel.content : null;
            },
            // handle the listViewChange event
            handleListViewChange(type) {
                let _this = this;
                // set the current list view selection to the value of the event
                if (type === _this.gridView || type === _this.tableView) {
                    _this.listView = type;
                }
            },
            // check that the new list view value is valid
            setListView(viewName) {
                let _this = this;
                if (viewName === _this.gridView || viewName === _this.tableView) {
                    _this.selectedListView = viewName;
                }
            }
        }

    }
</script>

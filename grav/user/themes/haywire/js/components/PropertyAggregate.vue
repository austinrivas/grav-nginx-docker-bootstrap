<script>
    // property field definitions TODO: MOVE INTO CMS
    import PROPERTY_FIELDS from '../models/propertyFields';

    // This is a parent component that is responsible for maintaining the state of the map aggregate page
    // it fetches data from the local collections / arc api and feeds the data into the filter / map / list child components
    export default {
        props: [
            'eventBus', // the shared event bus
            'filter', // the currently selected filter
            'filterValue', // the current value to filter by
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
        },

        // runs when component is attached to DOM
        async mounted() {
            let _this = this;
            _this.collection = await _this.executeQuery({
                field: _this.filter ? PROPERTY_FIELDS[_this.filter] : null,
                value: _this.filterValue,
                uri: true
            });
        },

        // provides the data context for the component
        data() {
            // names for the grid and table views
            // these names are used by child components to trigger list view changes
            let gridView = 'grid',
                tableView = 'table';
            return {
                collection: null, // initial collection state
                applyFilterEvent: 'applyFilter', // named event for triggering query execution from child components
                filterKeys: [ // the PropertyModel keys being filtered
                    'acres',
                    'type',
                    'status',
                    'subdivision'
                ],
                gridItemsInRow: 3, // default row length for grid list view
                gridView: gridView, // named grid list view
                listView: gridView, // default list view
                listViewChangeEvent: 'listViewChange', // named event for triggering list view change
                tableView: tableView // named table list view
            }
        },

        computed: {
            // computed prop to show / hide grid list view
            showGrid() {
                let _this = this;
                return _this.listView === _this.gridView;
            },
            // computed prop to show / hide table list view
            showTable() {
                let _this = this;
                return _this.listView === _this.tableView;
            }
        },

        methods: {
            // execute the given query and return the result async
            async executeQuery(query) {
                let _this = this,
                    result = [];
                // if the query is defined with a field and value
                if (query) {
                    // retrieve the query result by accessing the Properties collection methods for the field
                    switch (query.field) {
                        case PROPERTY_FIELDS.acres:
                            let value;
                            if (query.uri) {
                                // parse uri value into array of ints [ 1, 2 ]
                                value = query.value ? query.value.split(',').reduce((accumulator, element) => {
                                    accumulator.push(parseInt(element));
                                    return accumulator;
                                }, []) : null;
                            } else {
                                value = query.value;
                            }
                            if (value && value.length === 2 && value[0] && value[1]) {
                                result = await Properties.findPropertiesByAcreageRange(value[0], value[1]);
                                _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                    filter: 'acres',
                                    filterValue: value
                                });
                            }
                            break;
                        case PROPERTY_FIELDS.subdivision:
                            result = await Properties.findPropertiesBySubdivision(query.value);
                            _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                filter: 'subdivision',
                                filterValue: query.value
                            });
                            break;
                        case PROPERTY_FIELDS.status:
                            result = await Properties.findPropertiesByType(query.value);
                            _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                filter: 'status',
                                filterValue: query.value
                            });
                            break;
                        case PROPERTY_FIELDS.type:
                            result = await Properties.findPropertiesByType(query.value);
                            _this.eventBus.$emit(_this.updateUrlParamsEvent, {
                                filter: 'type',
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
                // return the query result
                return result;
            },
            // handle the executeQuery event
            async handleApplyFilter(query) {
                let _this = this;
                // set the collection property to the result of executing the query
                _this.collection = await _this.executeQuery(query);
            },
            // handle the listViewChange event
            handleListViewChange(type) {
                let _this = this;
                // set the current list view selection to the value of the event
                if (type === _this.gridView || type === _this.tableView) {
                    _this.listView = type;
                }
            }
        }

    }
</script>

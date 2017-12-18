<script>
    // shared event bus import
    import EventBus from '../event-handlers/event-bus';
    // property field definitions TODO: MOVE INTO CMS
    import PROPERTY_FIELDS from '../models/propertyFields';

    // This is a parent component that is responsible for maintaining the state of the map aggregate page
    // it fetches data from the local collections / arc api and feeds the data into the filter / map / list child components
    export default {

        // runs when component is declared in memory
        created() {
            let _this = this;
            // duck type the eventBus before binding events to it
            if (_this.eventBus && _this.eventBus.$on && _this.eventBus.$emit) {
                _this.eventBus.$on(_this.listViewChangeEvent, _this.handleListViewChange);
                _this.eventBus.$on(_this.executeQueryEvent, _this.executeQueryHandler);
            }
        },

        // runs when component is attached to DOM
        async mounted() {
            let _this = this;
            // set initial state of the collection
            _this.collection = await Properties.findAllProperties();
        },

        // provides the data context for the component
        data() {
            // names for the grid and table views
            // these names are used by child components to trigger list view changes
            let gridView = 'grid',
                tableView = 'table';
            return {
                collection: null, // initial collection state
                eventBus: EventBus, // reusable eventBus declaration
                executeQueryEvent: 'executeQuery', // named event for triggering query execution from child components
                gridItemsInRow: 3, // default row length for grid list view
                gridView: gridView, // named grid list view
                listView: gridView, // default list view
                listViewChangeEvent: 'listViewChange', // named event for triggering list view change
                query: { // object that maintains the current query state
                    outFields: ArcModelClass.queryOutfieldsSelectAll(), // default outfields is all fields
                    where: ArcModelClass.queryWhereSelectAll() // default where clause is all properties
                },
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
                let result = [];
                // if the query is defined with a field and value
                if (query && query.field && query.value) {
                    // retrieve the query result by accessing the Properties collection methods for the field
                    switch (query.field) {
                        case PROPERTY_FIELDS.acres:
                            if (query.value.length === 2 && query.value[0] && query.value[1]) {
                                result = await Properties.findPropertiesByAcreageRange(query.value[0], query.value[1]);
                            }
                            break;
                        case PROPERTY_FIELDS.subdivision:
                            result = await Properties.findPropertiesBySubdivision(query.value);
                            break;
                        case PROPERTY_FIELDS.status:
                            result = await Properties.findPropertiesByType(query.value);
                            break;
                        case PROPERTY_FIELDS.type:
                            result = await Properties.findPropertiesByType(query.value);
                            break;
                        default:
                            break;
                    }
                }
                // return the query result
                return result;
            },
            // handle the executeQuery event
            async executeQueryHandler(query) {
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

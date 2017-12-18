<script>
    import EventBus from '../event-handlers/event-bus';
    import PROPERTY_FIELDS from '../models/propertyFields';

    export default {

        created() {
            let _this = this;

            if (_this.eventBus && _this.eventBus.$on && _this.eventBus.$emit) {
                _this.eventBus.$on(_this.listViewChangeEvent, _this.handleListViewChange);
                _this.eventBus.$on(_this.executeQueryEvent, _this.executeQuery);

            }
        },

        async mounted() {
            let _this = this;

            _this.collection = await Properties.findAllProperties();
        },

        data() {
            let gridView = 'grid',
                tableView = 'table';

            return {
                collection: null,
                eventBus: EventBus,
                executeQueryEvent: 'executeQuery',
                gridItemsInRow: 3,
                gridView: gridView,
                listView: gridView,
                listViewChangeEvent: 'listViewChange',
                query: {
                    outFields: ArcModelClass.queryOutfieldsSelectAll(),
                    where: ArcModelClass.queryWhereSelectAll()
                },
                tableView: tableView
            }
        },

        computed: {
            showGrid() {
                let _this = this;
                return _this.listView === _this.gridView;
            },
            showTable() {
                let _this = this;
                return _this.listView === _this.tableView;
            }
        },

        methods: {
            async handleQueryChange() {
                let _this = this;

                // handle query result and fetch data from ArcModel
            },
            async executeQuery(query) {
                let _this = this;

                if (query.field && query.value) {

                    switch (query.field) {
                        case PROPERTY_FIELDS.acres:
                            if (query.value.length === 2 && query.value[0] && query.value[1]) {
                                _this.collection = await Properties.findPropertiesByAcreageRange(query.value[0], query.value[1]);
                            }
                            break;
                        case PROPERTY_FIELDS.subdivision:
                            _this.collection = await Properties.findPropertiesBySubdivision(query.value);
                            break;
                        case PROPERTY_FIELDS.status:
                            _this.collection = await Properties.findPropertiesByType(query.type);
                            break;
                        case PROPERTY_FIELDS.type:
                            _this.collection = await Properties.findPropertiesByType(query.value);
                            break;
                    }

                }
            },
            handleListViewChange(type) {
                let _this = this;

                if (type === _this.gridView || type === _this.tableView) {
                    _this.listView = type;
                }
            }
        }

    }
</script>

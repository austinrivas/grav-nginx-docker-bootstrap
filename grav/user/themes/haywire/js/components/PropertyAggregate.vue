<script>
    import EventBus from '../event-handlers/event-bus'

    export default {

        created() {
            let _this = this;

            if (_this.eventBus && _this.eventBus.$on && _this.eventBus.$emit) {
                _this.eventBus.$on(_this.listViewChangeEvent, _this.handleListViewChange)
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
                gridItemsInRow: 3,
                gridView: gridView,
                listView: gridView,
                listViewChangeEvent: 'listViewChange',
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
            handleListViewChange(type) {
                let _this = this;

                if (type === _this.gridView || type === _this.tableView) {
                    _this.listView = type;
                }
            }
        }

    }
</script>

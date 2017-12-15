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
            return {
                collection: null,
                eventBus: EventBus,
                gridItemsInRow: 3,
                listView: 'grid',
                listViewChangeEvent: 'listViewChange'
            }
        },

        computed: {
            showGrid() {
                let _this = this;
                return _this.listView === 'grid';
            },
            showTable() {
                let _this = this;
                return _this.listView === 'table';
            }
        },

        methods: {
            async handleQueryChange() {
                let _this = this;

                // handle query result and fetch data from ArcModel
            },
            handleListViewChange(type) {
                let _this = this;

                if (type === 'grid' || type === 'table') {
                    _this.listView = type;
                }
            }
        }

    }
</script>

<script>
    export default {

        async mounted() {
            let _this = this;

            _this.collection = await Properties.findAllProperties();
        },

        data() {
            return {
                collection: null,
                gridItemsInRow: 3
            }
        },

        computed: {
            showGrid() {
                return false;
            },
            showTable() {
                return true;
            }
        },

        methods: {
            async handleQueryChange() {
                let _this = this;

                // handle query result and fetch data from ArcModel
            }
        }

    }
</script>

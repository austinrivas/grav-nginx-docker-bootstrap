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

        methods: {
            async handleQueryChange() {
                let _this = this;

                // handle query result and fetch data from ArcModel
            }
        }

    }
</script>
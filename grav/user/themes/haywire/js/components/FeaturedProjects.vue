<script>
    // a component for fetching and render the featured properties of an arc map
    export default {

        // runs when component is attached to the DOM
        async mounted() {
            let _this = this;
            // set the internal collection to the featured arc properties
            _this.collection = await Properties.findFeaturedProperties();
            // map the first collection element to the first prop
            _this.first = _this.collection[0];
            // map the second collection element to the second prop
            _this.second = _this.collection[1];
            // map the third collection element to the third prop
            _this.third = _this.collection[2];
        },

        // Since the featured projects section will always contain 3 properties it is best to declare them explicitly
        // and preserve the ui state for them on load.
        // This avoids UI jank as the properties are fetched and rendered.
        data() {
            return {
                collection: [null, null, null], // collection is initially null to preserve ui state on load
                first: null,
                second: null,
                third: null,
            }
        }
    }
</script>

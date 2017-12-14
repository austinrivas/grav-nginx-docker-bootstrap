<script>
    export default {

        async mounted() {
            const collection = await Properties.findFeaturedProperties();

            this.first = collection[0];
            this.second = collection[1];
            this.third = collection[2];
        },

        data() {
            return {
                first: null,
                second: null,
                third: null,
            }
        }

    }
</script>

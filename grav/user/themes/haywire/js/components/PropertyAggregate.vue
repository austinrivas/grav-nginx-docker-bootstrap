<script>
    export default {

        async mounted() {
            this.collection = await Properties.findAllProperties();
        },

        data() {
            return {
                collection: null
            }
        }

    }
</script>

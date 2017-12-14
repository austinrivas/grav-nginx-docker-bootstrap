<script>
    export default {
        mounted: async function () {
            this.collection = await Properties.findAllProperties();
        },
        data: function () {
            return {
                collection: null
            }
        },
        computed: {},
        methods: {}
    }
</script>

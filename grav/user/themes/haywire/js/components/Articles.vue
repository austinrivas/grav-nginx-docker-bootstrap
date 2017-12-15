<script>
    export default {
        mounted() {
            // 
        },

        data() {
            return {
                activeCategory: 'News'
            }
        },

        methods: {
            filterByCategory(cat)
            {
                this.activeCategory = cat
            }
        },

        mounted() {
            this.activeCategory = this.$refs.filterGroup.dataset.category
        }
    }
</script>

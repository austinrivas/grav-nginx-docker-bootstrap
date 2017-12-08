<script>
    export default {
        props: ['id'],

        mounted() {
            //
            console.log(this.id);
        },

        data() {
            return {}
        },

        computed: {
            isFavorite: () => {
                return true;
            }
        },

        methods: {
            toggleFavorite: () => {
                console.log('toggleFavorite')
            }
        }
    }
</script>

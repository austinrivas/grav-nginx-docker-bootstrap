<script>
    export default {
        props: ['id'],

        async mounted() {
            this.model.id = JSON.parse(this.id);
            this.favorite = await FavoriteProperties.exists(this.model.id);
        },

        data() {
            return {
                favorite: null,
                model: {
                    id: null
                },
                toggling: false
            }
        },

        computed: {
            isFavorite: function () {
                return !this.toggling && this.favorite;
            }
        },

        methods: {
            toggleFavorite: async function (e) {
                e.preventDefault();
                if (!this.toggling) {
                    this.toggling = true;
                    const isFavorite = await FavoriteProperties.exists(this.model.id);
                    if (isFavorite) {
                        this.favorite = !(await FavoriteProperties.remove(this.model) === true);
                    } else {
                        this.favorite = await FavoriteProperties.add(this.model) === true;
                    }
                    this.toggling = false;
                }
            }
        }
    }
</script>

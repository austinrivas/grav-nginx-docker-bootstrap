<script>
    export default {

        props: ['id'],

        data() {
            return {
                toggling: false,
                favorite: false
            }
        },

        computed: {
            isFavorite: function () {
                return this.favorite;
            },
            loaded: function () {
                return !!this.id;
            }
        },

        watch: {
            async id() {
                this.favorite = !this.toggling && await FavoriteProperties.exists(this.id);
            }
        },

        methods: {
            async toggleFavorite(e) {

                e.preventDefault();

                if (!this.toggling && this.id) {

                    this.toggling = true;

                    const model = {id: this.id};

                    if (this.isFavorite) {
                        this.favorite = !(await FavoriteProperties.remove(model) === true);
                    } else {
                        this.favorite = await FavoriteProperties.add(model) === true;
                    }

                    this.toggling = false;
                }
            }
        }
    }
</script>

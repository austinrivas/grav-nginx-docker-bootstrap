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
                let _this = this;

                return !!_this.id;
            }
        },

        watch: {
            async id() {
                let _this = this;

                _this.favorite = !_this.toggling && await FavoriteProperties.exists(_this.id);
            }
        },

        methods: {
            async toggleFavorite(e) {

                let _this = this;

                e.preventDefault();

                if (!_this.toggling && _this.id) {

                    _this.toggling = true;

                    const model = {id: _this.id};

                    if (_this.isFavorite) {
                        _this.favorite = !(await FavoriteProperties.remove(model) === true);
                    } else {
                        _this.favorite = await FavoriteProperties.add(model) === true;
                    }

                    _this.toggling = false;
                }
            }
        }
    }
</script>

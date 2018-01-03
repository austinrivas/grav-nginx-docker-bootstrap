<script>
    // a reuasable component for rendering a favorite icon with state and preserving that state to FavoriteProperties collection
    export default {

        props: [
            'id' // the id of the PropertyModel being rendered
        ],

        async mounted() {
            let _this = this;
            _this.favorite = await _this.getFavoriteState();
        },

        data() {
            return {
                toggling: false, // signals that the ui in a state of change
                favorite: false // whether or not the property has been favorited by the user and persisted to FavoriteProperties collection
            }
        },

        computed: {
            // computed property for conditionally rendering the favorite icons
            isFavorite: function () {
                let _this = this;
                return _this.favorite;
            },
            // computed property for rendering icons based on model loaded state
            loaded: function () {
                let _this = this;
                // typecast value of id to boolean
                return !!_this.id;
            }
        },

        watch: {
            // watch the id property for changes and update the ui
            async id() {
                let _this = this;
                _this.favorite = await _this.getFavoriteState();
            }
        },

        methods: {
            // returns true if the component is not being toggled and the property id exists in the FavoriteProperties collection
            async getFavoriteState() {
                let _this = this;
                return !_this.toggling && await FavoriteProperties.exists(_this.id);
            },
            // async method that toggle the favorited state of a given property
            async toggleFavorite(e) {
                let _this = this;
                e.preventDefault();
                // if the property is not currently being toggled and id is defined
                if (!_this.toggling && _this.id) {
                    // set the toggling state to true to prevent out of sync ui
                    _this.toggling = true;
                    // create a mock model
                    const model = {id: _this.id};
                    // if the property is currently a favorite then remove it from the the FavoriteProperties collection
                    if (_this.isFavorite) { _this.favorite = !(await FavoriteProperties.remove(model) === true); }
                    // if the property is not a favorite the add it to the FavoriteProperties collection
                    else { _this.favorite = await FavoriteProperties.add(model) === true; }
                    // rest the toggling property to false
                    _this.toggling = false;
                }
            }
        }
    }
</script>

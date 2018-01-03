<script>
    // a reusable component for rendering a property in a tile ui
    export default {

        props: [
            'model' // an instance of PropertyModel
        ],

        mounted() {
          let _this = this;
          _this.bindLoadEvents();
        },

        data() {
            return {
                imageLoaded: false
            };
        },

        computed: {
            // computed property for accessing the model id
            id() {
                let _this = this;
                return _this.model && _this.model.id ? _this.model.id : null;
            },
            // computed property for generating the property title
            title() {
                let _this = this;
                return _this.getTitle(_this.model)
            },
            // computed property for showing the totalPrice of a property
            price() {
                let _this = this;
                return _this.model && _this.model.totalPrice ? _this.model.totalPrice : false;
            },
            // computed property for getting the value of imageUrl
            image() {
                let _this = this;
                return _this.model ? _this.model.imageUrl : '';
            },
            imageClass() {
                let _this = this;
                return _this.imageLoaded ? 'loaded' : '';
            },
            url() {
                let _this = this;
                return _this.id ? `/properties/${_this.id}` : false;
            },
            // computed property for getting the value of the property subtitle
            subtitle() {
                let _this = this;
                return _this.model ? _this.model.subdivision : false;
            },
            // computed property for getting the details for a property
            details() {
                // empty details container array
                let _this = this,
                    details = [];
                // if model is defined
                if (_this.model) {
                    if (_this.model.acres) { details.push(`${_this.model.acres} ACRES`); }
                    if (_this.model.type) { details.push(`${_this.model.type}`); }
                    if (_this.model.status) { details.push(`${_this.model.status}`); }
                    if (_this.model.pricePerSqft) { details.push(`${_this.model.pricePerSqft} PSF`); }
                }
                // if model is defined join the details array into a details string
                return _this.model && details.length ? details.join(' | ') : false;
            }
        },

        methods: {
            bindLoadEvents() {
                let _this = this;
                if (_this.$refs.propertyImage && _this.$refs.propertyImage.length) {
                    _this.$refs.propertyImage[0].addEventListener('load', (e) => {
                        _this.imageLoaded = true;
                    });
                }
            },

            getTitle(model) {
                let title = [];
                // if the model is defined
                if (model) {
                    // if the model has an address prop
                    if (model.address) {
                        // add the address value to title array
                        title.push(model.address)
                    }
                    // if the model has a lotId prop
                    if (model.lotId) {
                        // add the lotId value to the title array
                        title.push(`LOT ${model.lotId}`);
                    }
                }
                return title.length ? title.join(' - ') : false;
            }
        }

    }
</script>

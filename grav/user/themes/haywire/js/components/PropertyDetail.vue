<script>
    import PropertyModel from '../models/propertyModel'

    export default {
        props: ['id'],

        async mounted() {
            let _this = this;
            _this.property = await Properties.findPropertyById(_this.id);
        },

        data() {
          return {
              loaded: false,
              property: false,
              notFound: false
          }
        },

        watch: {
            property() {
                let _this = this;
                _this.setLoadingState(_this.property);
            }
        },

        computed: {
            propertyDateAvailable() {
                let _this = this;
                return _this.property && _this.property.dateAvailable ? _this.property.dateAvailable : 'Unknown';
            },
            propertyDescription() {
                let _this = this;
                return _this.property && _this.property.description && _this.property.description.length > 1 ? _this.property.description : "No Description Available";
            },
            propertyDetailClass() {
                let _this = this;
                let arr = _this.getLoadingState(_this.loaded, _this.property, _this.notFound);
                debugger;
                return arr;
            },
            propertyHeaderTitle() {
                // empty array for holding title elements
                let _this = this,
                    title = [];
                // if the model is defined
                if (_this.property) {
                    // if the model has an address prop
                    if (_this.property.address) {
                        // add the address value to title array
                        title.push(_this.property.address)
                    }
                    // if the model has a lotId prop
                    if (_this.property.lotId) {
                        // add the lotId value to the title array
                        title.push(`LOT ${_this.property.lotId}`);
                    }
                }
                // if model is defined join the title elements into a property title
                return _this.property && title.length ? title.join(' - ') : false;
            },
            propertyId() {
                let _this = this;
                return _this.property && _this.property.id ? _this.property.id : null;
            },
            propertyImages() {
                let _this = this;
                if (_this.property && _this.property.imageUrl) {
                    return [null, _this.property.imageUrl, null];
                } else {
                    return [null, null, null];
                }
            },
            propertyInfoTableColumns() {
                let _this = this;
                return [
                    {
                        heading: 'PRICE',
                        key: 'totalPrice',
                        filter: _this.$options.filters.currency
                    },{
                        heading: 'ACRES',
                        key: 'acres'
                    },{
                        heading: 'PRICE PER SQ. FT.',
                        key: 'pricePerSqft',
                        filter: _this.$options.filters.currency
                    },{
                        heading: 'PDI',
                        computed(model) {
                            return 'what is pdi?'
                        }
                    },{
                        heading: 'PARCEL ID',
                        key: 'lotId'
                    }
                ];
            },
            propertyInfoTableModels() {
                let _this = this,
                    models = [];
                if (_this.property) {
                    models.push(_this.property);
                }
                return models;
            },
            propertyTabs() {
                return [
                    {
                        label: 'Test',
                        content: 'This accordion needs content.'
                    },{
                        label: 'Test2',
                        content: 'This accordion needs content also.'
                    }
                ]
            },
            propertyUses() {
                let _this = this;
                return _this.property && _this.property.type ? _this.property.type : "Unknown";
            }
        },
        methods: {
            getLoadingState(loaded, property, notFound) {
                let classes = ['property-detail'];
                if (notFound) {
                    classes.push('not-found');
                } else {
                    if ( loaded === false && property === false ) {
                        classes.push('loading');
                    }
                    if ( loaded === true && property === true ) {
                        classes.push('loaded');
                    }
                }
                return classes;
            },
            setLoadingState(model) {
                let _this = this;
                _this.loaded = true;
                if (!model) {
                    _this.notFound = true;
                }
            }
        }
    }
</script>

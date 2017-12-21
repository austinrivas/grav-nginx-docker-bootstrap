<script>
    import PropertyModel from '../models/propertyModel';

    export default {
        props: [
            'id',
            'description'
        ],

        async mounted() {
            let _this = this;
            _this.collection = await _this.createCollection(_this.id);
        },

        data() {
            return {
                collection: []
            }
        },

        watch: {
            async id() {
                let _this = this;
                _this.collection = await _this.createCollection(_this.id);
            }
        },

        methods: {
            async createCollection(id) {
                let collection = [];

                if (id) {
                    let model = await Properties.findPropertyById(id);
                    if (model instanceof PropertyModel) {
                        collection.push(model);
                    }
                }

                return collection;
            }
        }
    }
</script>

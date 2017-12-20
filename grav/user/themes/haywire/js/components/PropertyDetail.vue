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
              loading: true,
              property: false
          }
        },

        watch: {
            property() {
                let _this = this;
                _this.loading = false;
            }
        },

        computed: {
            propertyExists() {
                let _this = this;
                return !_this.loading && _this.property instanceof PropertyModel;
            }
        }
    }
</script>

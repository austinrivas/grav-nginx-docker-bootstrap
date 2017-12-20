<script>
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
                _this.loading = !(!!_this.id && !!_this.property) && (typeof _this.property === 'boolean');
            }
        },

        computed: {
            propertyExists() {
                let _this = this;
                return !(typeof _this.property === 'undefined');
            }
        }
    }
</script>

<script>
    export default {
        methods: {
            async getGravConfig(config) {
                let _this = this,
                    refs = Object.keys(config);
                if (refs && refs.length) {
                    return await refs.reduce(_this.getGravProperty, Object.assign({}, config));
                } else {
                    return config;
                }
            },
            getGravProperty(accumulator, key) {
                let _this = this,
                    $ref = `GRAV${key}`;
                accumulator[key] = _this.$refs[$ref] && _this.$refs[$ref].content ?  _this.$refs[$ref].content : null;
                return accumulator;
            }
        }
    }
</script>

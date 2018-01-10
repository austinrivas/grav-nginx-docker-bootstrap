<script>

    import ScrollDownMixin from './mixins/ScrollDown.vue';

    export default {
        mixins: [ScrollDownMixin],

        mounted() {
            let _this = this;

            if (typeof(_this.$refs.section) !== "undefined" && _this.$refs.section && _this.$refs.section.offsetHeight) {
                _this.scrollElement = _this.$refs.section;
                _this.scrollOffsetHeight = _this.$refs.section.offsetHeight;
            }
        },

        data() {
            return {
                scrollElement: null,
                scrollOffsetHeight: null
            }
        }
    }
</script>

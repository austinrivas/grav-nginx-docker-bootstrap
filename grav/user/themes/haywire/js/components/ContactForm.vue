<script>

    import ScrollDownMixin from './mixins/ScrollDown.vue'

    export default {
        mixins: [ScrollDownMixin],

        mounted() {
            let _this = this;

            if (typeof(_this.$refs.notice) !== "undefined" && _this.$refs.notice && _this.$refs.notice.offsetHeight) {
                _this.scrollElement = _this.$refs.notice;
                _this.scrollOffsetHeight = _this.$refs.notice.offsetHeight - 80;
                _this.scrollDown();
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

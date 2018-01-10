<script>
    import VueScrollTo from 'vue-scrollto';

    export default {
        methods: {
            scrollDown() {
                let _this = this;

                if (_this.scrollElement && _this.scrollOffsetHeight !== undefined && _this.scrollOffsetHeight !== null) {
                    const scrollCanceleable = _this.scrollCancelable !== undefined || _this.scrollCancelable !== null ? _this.scrollCancelable : true,
                        scrollContainer = _this.scrollContainer || 'body',
                        scrollDuration = _this.scrollDuration || 500,
                        scrollEasing = _this.scrollEasing || 'ease-in',
                        scrollOnCancel = _this.scrollOnCancel || function () {},
                        scrollOnDone = _this.scrollOnDone || function () {},
                        scrollX = _this.scrollX !== undefined || _this.scrollX !== null ? _this.scrollX : false,
                        scrollY = _this.scrollY !== undefined || _this.scrollY !== null ? _this.scrollY : true;

                    VueScrollTo.scrollTo(_this.scrollElement, scrollDuration, {
                        cancelable: scrollCanceleable,
                        container: scrollContainer,
                        easing: scrollEasing,
                        offset: _this.scrollOffsetHeight,
                        onCancel: scrollOnCancel,
                        onDone: scrollOnDone,
                        x: scrollX,
                        y: scrollY
                    });
                }
            }
        }
    }
</script>

<script>
    export default {
        props: ['images'],

        computed: {
            imageUrls() {
                let _this = this;

                if (_this.images && _this.images.length) {
                    return _this.images.reduce((accumulator, image) => {
                        if (!image) {
                            image = '';
                        }
                        accumulator.push(image);
                        return accumulator;
                    }, []);
                } else {
                    return [];
                }
            }
        }
    }
</script>

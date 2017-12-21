<script>
    export default {
        props: ['images'],

        data() {
            return {
                placeholderImageUrl: 'http://via.placeholder.com/580x350'
            }
        },

        computed: {
            imageUrls() {
                let _this = this;

                if (_this.images && _this.images.length) {
                    return _this.images.reduce((accumulator, image) => {
                        if (!image) {
                            image = _this.placeholderImageUrl;
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

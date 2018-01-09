<script>

var VueScrollTo = require('vue-scrollto');

    export default {
        methods: {
            scrollDown() {

            	const height = this.$refs.section.offsetHeight

            	var options = {
				    container: 'body',
				    easing: 'ease-in',
				    offset: height,
				    cancelable: true,
				    onDone: function() {
				      // scrolling is done
				    },
				    onCancel: function() {
				      // scrolling has been interrupted
				    },
				    x: false,
				    y: true
				}

				var vueScroll = VueScrollTo.scrollTo(this.$refs.section, 500, options)
            }
        }
    }
</script>

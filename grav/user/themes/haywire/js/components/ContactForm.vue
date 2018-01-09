<script>

var VueScrollTo = require('vue-scrollto');

    export default {
    	mounted(){
    		if ( typeof(this.$refs.notice) !== "undefined" && this.$refs.notice ) {
    			this.scrollDown()
    		}
    	},
        methods: {
            scrollDown() {

            	const height = this.$refs.notice.offsetHeight

            	var options = {
				    container: 'body',
				    easing: 'ease-in',
				    offset: (height - 80),
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

				var vueScroll = VueScrollTo.scrollTo(this.$refs.notice, 500, options)
            }
        }
    }
</script>

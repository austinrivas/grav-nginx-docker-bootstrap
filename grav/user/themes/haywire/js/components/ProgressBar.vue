<script>
    // NProgress Bar GH Page
    // https://github.com/rstacruz/nprogress
    import NProgress from '../vendor/nProgress';
    export default {
        template: `<div id="progress-bar"></div>`,
        created() {
            window.addEventListener('load', () => {
                if (NProgress && NProgress.done) {
                    // complete progress bar loading animation
                    NProgress.done();
                }
            });
        },
        mounted() {
            let _this = this;
            if (NProgress && NProgress.configure && NProgress.start) {
                NProgress.configure(_this.config);
                NProgress.start();
            }
        },
        data() {
            return {
                config: {
                    parent: '#progress-bar',
                    showSpinner: false
                }
            };
        }
    }
</script>

<script>
    // NProgress Bar GH Page
    // https://github.com/rstacruz/nprogress
    import NProgress from '../vendor/nProgress';
    export default {
        template: `<div class="bar" role="bar"></div>`,
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
                    showSpinner: false
                }
            };
        }
    }
</script>

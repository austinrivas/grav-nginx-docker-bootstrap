<script>
    // reusable nav component that toggles its own open close state
    export default {

        data() {
            return {
                navIsActive: false
            }
        },

        methods: {
            // method that toggles the nav active state between true / false
            toggleNav() {
                let _this = this;
                _this.navIsActive = !_this.navIsActive;
            }
        }

    }
</script>

<script>
    export default {
        props: [
            'changeEvent',
            'options',
            'parentEventBus',
            'selected'
        ],

        created() {
            let _this = this;

            if (_this.parentEventBus && _this.parentEventBus.$on && _this.parentEventBus.$emit) {
                _this.eventBus = _this.parentEventBus;
            }
        },

        mounted() {
            let _this = this;

            _this.selectedOption = _this.selected;
        },

        data() {
            let _this = this;

            return {
                eventBus: {
                    $on() {
                        console.log('No parent event bus defined', _this.parentEventBus);
                    },
                    $emit() {
                        console.log('No parent event bus defined', _this.parentEventBus);
                    }
                },
                selectedOption: null
            }
        },

        watch: {
            selected() {
                let _this = this;
                _this.selectedOption = _this.selected;
            }
        },

        methods: {
            handleSelectChange(e) {
                let _this = this;

                if (_this.changeEvent && _this.changeEvent.length) {
                    _this.eventBus.$emit(_this.changeEvent, _this.selectedOption);
                }
            }
        }
    }
</script>

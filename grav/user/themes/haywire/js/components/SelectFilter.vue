<script>
    // generic select component that emits change events on a shared event bus
    export default {
        props: [
            'changeEvent', // name change event
            'eventBus', // shared eventBus
            'options', // selectable options
            'selected' // current selection as defined by parent component
        ],

        // runs when component is attached to the DOM
        mounted() {
            let _this = this;
            // set the currently selected option to the value of the selected prop
            _this.selectedOption = _this.selected;
        },


        data() {
            return {
                selectedOption: null // default selected option
            }
        },

        watch: {
            // watch the value of the selected prop for changes
            selected() {
                let _this = this;
                // set the selectedOption to the new value of selected
                _this.selectedOption = _this.selected;
            }
        },

        methods: {
            // event handler for selections
            handleSelectChange(e) {
                let _this = this;
                // if changeEvent is defined emit a change event using the current selected option as the value
                if (_this.changeEvent && _this.changeEvent.length) {
                    _this.eventBus.$emit(_this.changeEvent, _this.selectedOption);
                }
            }
        }
    }
</script>

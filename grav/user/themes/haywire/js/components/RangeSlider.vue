<script>
    // a generic component for a range slider that emits change events on a shared event bus
    export default {
        props: [
            'changeEvent', // named change event
            'eventBus', // shared event bus
            'maxValue', // max value of range slider
            'minValue', // min value of the range slider
            'outputFunction', // function for generating the output label of the range slider
            'step', // range step value
            'values' // selected values as defined by the parent component
        ],

        // runs when component is declared in memory
        created() {
            let _this = this;
            // if outputFunction is defined and a function, set it as the outputFactory
            if (_this.outputFunction && typeof _this.outputFunction === 'function') {
                _this.outputFactory = _this.outputFunction;
            }
        },

        // runs when component is attached to the DOM
        async mounted() {
            let _this = this;
            // default slider step
            _this.sliderStep = _this.step ? _this.step : _this.sliderStep;
            _this.minSliderValue = _this.minValue;
            _this.maxSliderValue = _this.maxValue;
            // if values are defined use them, else use min / max values for initial selected state
            _this.valueSliderA = _this.values && _this.values.length === 2 ? _this.values[0] : _this.minSliderValue;
            _this.valueSliderB = _this.values && _this.values.length === 2 ? _this.values[1] : _this.maxSliderValue;
            // order the selected slider values [ min, max ]
            _this.sliderValues = await _this.getSliderValues([_this.valueSliderA, _this.valueSliderB]);
        },

        data() {
            return {
                minSliderValue: null,
                maxSliderValue: null,
                outputFactory(values) { console.log('No output function for range slider', values) }, // mock outputFactory
                sliderStep: 1,
                sliderValues: [], // [ min, max ]
                valueSliderA: null,
                valueSliderB: null
            }
        },

        computed: {
            // computed prop that returns the result of running the outputFactory method with the current slider values
            sliderOutput() {
                let _this = this;
                return _this.outputFactory(_this.sliderValues);
            }
        },

        watch: {
            // watch the valueSliderA prop
            async valueSliderA() {
                let _this = this;
                _this.sliderValues = await _this.getSliderValues();
            },
            // watch the valueSliderB prop
            async valueSliderB() {
                let _this = this;
                _this.sliderValues = await _this.getSliderValues();
            },
            // watch the maxValue prop
            maxValue() {
                let _this = this;
                // set the maxSliderValue to the maxValue prop
                _this.maxSliderValue = _this.maxValue;
                // if the value for sliderB is undefined set it to max value
                if (!_this.valueSliderB) { _this.valueSliderB = _this.maxValue; }
            },
            // watch the minValue prop
            minValue() {
                let _this = this;
                // set the minSliderValue to the maxValue prop
                _this.minSliderValue = _this.minValue;
                // if the value for sliderA is undefined set it to min value
                if (!_this.valueSliderA) { _this.valueSliderA = _this.minValue; }
            },
            // watch the values prop
            values() {
                let _this = this;
                // when values changes set the valueSliderA, valueSliderB props accordingly
                if (_this.values && _this.values.length === 2) {
                    _this.valueSliderA = _this.values[0];
                    _this.valueSliderB = _this.values[1];
                }
            }
        },

        methods: {
            // parse the values for slider A and slider B into an array and then do a bitwise array swap to order the values in [ min, max ] order
            async getSliderValues() {
                let _this = this,
                    array = await [_this.valueSliderA, _this.valueSliderB].reduce((accumulator, value) => {
                        accumulator.push(JSON.parse(value));
                        return accumulator;
                    }, []);
                return _this.bitwiseArraySwap(array);
            },
            // order the 2 elements of a [ number, number ] array in [ min, max ] order
            bitwiseArraySwap(array) {
                if (array && array.length === 2) {
                    if (array[0] > array[1]) {
                        [array[1], array[0]] = [array[0], array[1]]
                    }
                }
                return array;
            },
            // change handler for slider values
            handleChange(e) {
                let _this = this;
                // if changeEvent is defined emit a change event on the shared event bus using the current values of the slider
                if (_this.changeEvent && _this.changeEvent.length) {
                    _this.eventBus.$emit(_this.changeEvent, _this.sliderValues);
                }
            }
        }
    }
</script>

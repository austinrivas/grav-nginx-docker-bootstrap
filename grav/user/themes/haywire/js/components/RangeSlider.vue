<script>
    import Slider from '../vendor/nouiSlider'

    // a generic component for a range slider that emits change events on a shared event bus
    export default {
        props: [
            'changeEvent', // named change event
            'eventBus', // shared event bus
            'maxValue', // max value of range slider
            'minValue', // min value of the range slider
            'outputFunction', // function for generating the output label of the range slider
            'sliderId', // the id of the nouiSlider dom target
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
            // set the min / max values of the slider based on input props
            [_this.minSliderValue, _this.maxSliderValue] = [_this.minValue, _this.maxValue];
            // if values are defined use them, else use min / max values for initial selected state
            [_this.valueSliderA, _this.valueSliderB] = [
                _this.values && _this.values.length === 2 ? _this.values[0] : _this.minSliderValue,
                _this.values && _this.values.length === 2 ? _this.values[1] : _this.maxSliderValue
            ];
            // order the selected slider values [ min, max ]
            _this.sliderValues = [_this.valueSliderA, _this.valueSliderB];
            _this.sliderConfig = _this.getSliderConfig(_this.maxSliderValue, _this.minSliderValue, _this.sliderValues, _this.sliderStep);
        },

        data() {
            return {
                minSliderValue: null,
                maxSliderValue: null,
                outputFactory(values) { console.log('No output function for range slider', values) }, // mock outputFactory
                slider: null,
                sliderConfig: null,
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
                _this.sliderValues = [_this.valueSliderA, _this.valueSliderB];
            },
            // watch the valueSliderB prop
            async valueSliderB() {
                let _this = this;
                _this.sliderValues =[_this.valueSliderA, _this.valueSliderB];
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
                    [_this.valueSliderA, _this.valueSliderB] = [_this.values[0], _this.values[1]];
                }
            },
            // watch for changes to sliderValues and emit change events
            sliderValues() {
                let _this = this;
                // if changeEvent is defined emit a change event on the shared event bus using the current values of the slider
                if (_this.changeEvent && _this.changeEvent.length) {
                    _this.eventBus.$emit(_this.changeEvent, _this.sliderValues);
                }
            },
            sliderConfig() {
                let _this = this,
                    sliderConfig = _this.sliderConfig,
                    sliderId = _this.sliderId,
                    sliderChangeEvent = 'change',
                    sliderChangeHandler = _this.sliderChangeHandler;
                if (sliderId &&
                    sliderChangeEvent &&
                    sliderChangeHandler &&
                    sliderConfig.range.min &&
                    sliderConfig.range.max &&
                    sliderConfig.start &&
                    sliderConfig.start.length === 2 &&
                    sliderConfig.step) {
                    _this.slider = _this.createSlider(sliderId, sliderChangeEvent, sliderConfig, sliderChangeHandler)
                }
            }
        },

        methods: {
            createSlider(id, changeEvent, config, changeHandler) {
                let slider = document.getElementById(id);
                Slider.create(slider, config);
                slider.noUiSlider.on(changeEvent, changeHandler);
                return slider;
            },
            getSliderConfig(maxValue, minValue, values, step) {
                return {
                    connect: true,
                    range: {
                        'min': minValue,
                        'max': maxValue
                    },
                    behaviour: 'drag',
                    start: values,
                    step: step
                }
            },
            sliderChangeHandler(values, handle, unencoded, tap, positions) {
                let _this = this;
                _this.sliderValues = unencoded && unencoded.length === 2 ? unencoded : [];
            }
        }
    }
</script>

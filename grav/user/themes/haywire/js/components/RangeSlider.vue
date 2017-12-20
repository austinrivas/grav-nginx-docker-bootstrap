<script>
    // noUiSlider <https://refreshless.com/nouislider/>
    import Slider from '../vendor/nouiSlider'

    // a wrapper component for a noUiSlider <https://refreshless.com/nouislider/> that emits change events on a shared event bus
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
            // if values are defined use them, else use min / max values for initial selected state
            _this.sliderValues = [
                _this.values && _this.values.length === 2 ? _this.values[0] : _this.minValue,
                _this.values && _this.values.length === 2 ? _this.values[1] : _this.maxValue
            ];
            _this.sliderConfig = _this.getSliderConfig(_this.maxValue, _this.minValue, _this.sliderValues, _this.sliderStep);
        },

        data() {
            return {
                noUiSliderChangeEvent: 'change',
                outputFactory(values) { console.log('No output function for range slider', values) }, // mock outputFactory
                slider: null,
                sliderConfig: null,
                sliderStep: 1,
                sliderValues: [], // [ min, max ]
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
            // watch the values prop
            values() {
                let _this = this;
                // when values changes set the valueSliderA, valueSliderB props accordingly
                if (_this.values && _this.values.length === 2) {
                    _this.sliderValues = _this.values;
                }
            },
            // watch the sliderConfig property and initialize the slider when it has the required props
            sliderConfig() {
                let _this = this,
                    sliderConfig = _this.sliderConfig,
                    sliderId = _this.sliderId,
                    sliderChangeEvent = _this.noUiSliderChangeEvent,
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
            },
            // watch the slider values prop and update the noUiSlider instance if it is defined
            sliderValues() {
                let _this = this;
                if (_this.slider && _this.slider.noUiSlider) {
                    _this.slider.noUiSlider.set(_this.sliderValues);
                }
            }
        },

        methods: {
            // create a noUiSlider component and attach it to the target element
            createSlider(id, changeEvent, config, changeHandler) {
                let slider = document.getElementById(id);
                Slider.create(slider, config);
                slider.noUiSlider.on(changeEvent, changeHandler);
                return slider;
            },
            // create a noUiSlider config object https://refreshless.com/nouislider/
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
            // event handler for the noUiSlider change event
            sliderChangeHandler(values, handle, unencoded, tap, positions) {
                let _this = this;
                _this.sliderValues = unencoded && unencoded.length === 2 ? unencoded : [];
                _this.eventBus.$emit(_this.changeEvent, _this.sliderValues);
            }
        }
    }
</script>

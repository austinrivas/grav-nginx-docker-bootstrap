<script>
    import EventBus from '../event-handlers/event-bus';

    export default {
        props: [
            'changeEvent',
            'values',
            'minValue',
            'maxValue',
            'outputFunction',
            'step'
        ],

        created() {
            let _this = this;

            if (_this.outputFunction && typeof _this.outputFunction === 'function') {
                _this.outputFactory = _this.outputFunction;
            }
        },

        async mounted() {
            let _this = this;

            _this.sliderStep = _this.step || 1;
            _this.minSliderValue = _this.minValue || 0;
            _this.maxSliderValue = _this.maxValue || 5;
            _this.valueSliderA = _this.values && _this.values.length === 2 ? _this.values[0] : _this.minSliderValue;
            _this.valueSliderB = _this.values && _this.values.length === 2 ? _this.values[1] : _this.maxSliderValue;
            _this.sliderValues = await _this.getSliderValues([_this.valueSliderA, _this.valueSliderB]);
        },

        data() {
            return {
                minSliderValue: null,
                maxSliderValue: null,
                outputFactory(values) { console.log('No output function for range slider', values) },
                sliderStep: null,
                sliderValues: [],
                valueSliderA: null,
                valueSliderB: null
            }
        },

        computed: {
            sliderOutput() {
                let _this = this;
                return _this.outputFactory(_this.sliderValues);
            }
        },

        watch: {
            async values() {
                let _this = this;

                if (_this.values && _this.values.length === 2) {
                    _this.valueSliderA = _this.values[0];
                    _this.valueSliderB = _this.values[1];
                }
            },
            async valueSliderA() {
                let _this = this;

                _this.sliderValues = await _this.getSliderValues();
            },
            async valueSliderB() {
                let _this = this;

                _this.sliderValues = await _this.getSliderValues();
            }
        },

        methods: {
            async getSliderValues() {
                let _this = this,
                    array = await [_this.valueSliderA, _this.valueSliderB].reduce((accumulator, value) => {
                        accumulator.push(JSON.parse(value));
                        return accumulator;
                    }, []);

                return _this.bitwiseArraySwap(array);


            },
            bitwiseArraySwap(array) {
                if (array && array.length === 2) {
                    if (array[0] > array[1]) {
                        [array[1], array[0]] = [array[0], array[1]]
                    }
                }

                return array;
            },
            handleChange(e) {
                let _this = this;

                EventBus.$emit(_this.changeEvent, _this.sliderValues);
            }
        }
    }
</script>

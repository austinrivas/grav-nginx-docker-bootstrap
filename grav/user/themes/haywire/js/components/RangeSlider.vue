<script>
    import EventBus from '../event-handlers/event-bus';

    export default {
        props: [
            'initialValues',
            'step',
            'minValue',
            'maxValue'
        ],

        mounted() {
            let _this = this;

            _this.valueSliderA = 1;
            _this.valueSliderB = 4;
            _this.sliderStep = _this.sliderStep || 1;
            _this.minSliderValue = _this.minValue || 0;
            _this.maxSliderValue = _this.maxValue || 5;
            _this.changeEvent = 'sliderChange';

        },

        data() {
            return {
                changeEvent: null,
                minSliderValue: null,
                maxSliderValue: null,
                sliderStep: null,
                sliderValues: [],
                valueSliderA: null,
                valueSliderB: null
            }
        },

        computed: {
            sliderOutput() {
                let _this = this;
                return _this.getSliderOutput(_this.sliderValues);
            }
        },

        watch: {
            async valueSliderA() {
                let _this = this;

                _this.sliderValues = await _this.getSliderValues([_this.valueSliderA, _this.valueSliderB]);
            },
            async valueSliderB() {
                let _this = this;

                _this.sliderValues = await _this.getSliderValues([_this.valueSliderA, _this.valueSliderB]);
            }
        },

        methods: {
            async getSliderValues(array) {
                let _this = this;

                return await _this.bitwiseArraySwap(array)
                    .reduce((accumulator, value) => {
                        accumulator.push(JSON.parse(value));
                        return accumulator;
                    }, []);
            },
            bitwiseArraySwap(array) {
                if (array && array.length === 2) {
                    if (array[0] > array[1]) {
                        [array[1], array[0]] = [array[0], array[1]]
                    }
                }

                return array;
            },
            getSliderOutput(values) {
                if (values && values.length === 2) {
                    return `${values[0]} to ${values[1]} Acres`;
                } else {
                    return `Undefined Range`;
                }
            },
            handleChange(e) {
                let _this = this;

                EventBus.$emit(_this.changeEvent, _this.sliderValues);
            }
        }
    }
</script>

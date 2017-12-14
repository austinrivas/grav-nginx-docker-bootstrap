<script>
    import EventBus from '../event-handlers/event-bus';

    export default {
        props: ['options', 'selected', 'changeEvent'],

        mounted () {
            let _this = this;

            _this.selectedOption = _this.selected;
        },

        data () {
          return {
              selectedOption: null
          }
        },

        watch: {
            selected () {
                let _this = this;
                _this.selectedOption = _this.selected;
            }
        },

        methods: {
            handleSelectChange (e) {
                let _this = this;

                EventBus.$emit(_this.changeEvent, _this.selectedOption);
            }
        }
    }
</script>

<script>
    // import the event bus to be shared between the child components of this page state
    import EventBus from '../event-handlers/event-bus'
    // a reusable component that maintains the page state via url params
    export default {
        props: [],

        // runs when component is declared in memory
        async created() {
            let _this = this;
            // set the value of urlParams to be the result or parsing the url
            _this.urlParams = await _this.getUrlParams(window.location.search);
        },

        // runs when component is attached to DOM
        mounted() {},

        // provides the data context for the component
        data() {
            return {
                eventBus: EventBus, // shared event bus
                urlParams: {} // initial url param state
            }
        },

        methods: {
            // async function that returns a map of key value pairs
            async getUrlParams(search) {
                // define the initial empty url state
                let initialParams = {};
                // if search is defined
                if (search && search.length) {
                    // char that separates the query from the url
                    let querySeparator = '?',
                        // char that separates the individual query keys
                        keySeparator = '&',
                        // char that separates the key from its value
                        valueSeparator = '=',
                        // define the array index of the where the query params start
                        index = search.indexOf(querySeparator) + 1;
                    // slice the array at the index of the first query param
                    return await search.slice(index)
                        // split the resulting array at the key separators
                        .split(keySeparator)
                        // reduce the resulting array of keys into a key value map
                        .reduce((params, hash) => {
                            let [key, value] = hash.split(valueSeparator);
                            params[key] = decodeURIComponent(value);
                            return params;
                        }, initialParams);
                } else return initialParams;
            }
        }
    }
</script>

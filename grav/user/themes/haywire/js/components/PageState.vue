<script>
    // import the event bus to be shared between the child components of this page state
    import EventBus from '../event-handlers/event-bus'

    // a reusable component that maintains the page state via url params
    export default {
        // runs when component is declared in memory
        created() {
            let _this = this;
            _this.urlParts = _this.getUrlParts(window.location.href);
            // set the value of urlParams to be the result or parsing the url
            _this.urlParams = _this.getUrlParams(window.location.search);
            // duck type the eventBus before binding events to it
            if (_this.eventBus && _this.eventBus.$on && _this.eventBus.$emit) {
                _this.eventBus.$on(_this.updateUrlParamsEvent, _this.handleUpdateUrlParams);
            }
        },

        // provides the data context for the component
        data() {
            return {
                eventBus: EventBus, // shared event bus
                updateUrlParamsEvent: 'updateUrlParams', // named update url params event
                urlParams: {}, // initial url param state,
                urlParts: [] // the result of calling getUrlParts
            }
        },

        watch: {
            // watch the value of the urlParams property and update the url whenever it changes
            urlParams() {
                let _this = this;
                _this.updateUrlState(_this.urlParams, window.location.href);
            }
        },

        methods: {
            // async function that returns a map of key value pairs
            getUrlParams(search) {
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
                    return search.slice(index)
                        // split the resulting array at the key separators
                        .split(keySeparator)
                        // reduce the resulting array of keys into a key value map
                        .reduce((params, hash) => {
                            let [key, value] = hash.split(valueSeparator);
                            params[key] = window.decodeURIComponent(value);
                            return params;
                        }, initialParams);
                } else return initialParams;
            },
            getUrlParts(url) {
                if (url) {
                    return url.split('/');
                }
            },
            // event handler for updateUrlParams event
            handleUpdateUrlParams(params) {
                let _this = this;
                // if params are defined
                if (params) {
                    // reduce the params into a urlParams map of key value pairs
                    // use Object.assign to trigger a change event that vue can observe
                    _this.urlParams = Object.assign({}, Object.keys(params).reduce((urlParams, key) => {
                        urlParams[key] = params[key];
                        return urlParams;
                    }, _this.urlParams));
                }
            },
            // function that takes a key value pair and creates a url from an existing url that includes the serialized key value pair as query params
            updateQueryString(key, value, url) {
                // create a param'd regex for query params
                let re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
                    hash;

                if (re.test(url)) {
                    // if the value to be added is not undefined or null add it ot the url
                    if (typeof value !== 'undefined' && value !== null) {
                        return url.replace(re, '$1' + key + "=" + value + '$2$3');
                    // else remove the null param from the url
                    } else {
                        hash = url.split('#');
                        url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                        if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                            url += '#' + hash[1];
                        }
                        return url;
                    }
                } else {
                    // if the value to be added is not undefined or null add it to the url
                    if (typeof value !== 'undefined' && value !== null) {
                        let separator = url.indexOf('?') !== -1 ? '&' : '?';
                        hash = url.split('#');
                        url = hash[0] + separator + key + '=' + value;
                        if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                            url += '#' + hash[1];
                        }
                        return url;
                    // return the unchanged url
                    } else {
                        return url;
                    }
                }
            },
            updateUrlState(urlParams, url) {
                let _this = this;
                if (urlParams && url) {
                    // reduce the current url into a mapped state of the query params and replace the current url state in history
                    window.history.pushState({}, null, Object.keys(urlParams).reduce((accumulator, key) => {
                        return _this.updateQueryString(key, urlParams[key], accumulator);
                    }, url));
                }
            }
        }
    }
</script>

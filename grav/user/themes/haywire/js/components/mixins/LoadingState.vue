<script>
export default {
    methods: {
        getLoadingState(classes, loaded, notFound, model, modelDefinition) {
                let _this = this;
                // clone the classes array into a new array
                classes = classes && classes.length && classes.slice ? classes.slice(0) : [];
                // if the model is not found add the not found class to the classes array
                if (notFound) {
                    classes.push(_this.notFoundClass);
                } else {
                    // if the model is not loaded and model is not defined add the loading class to the classes array
                    if (loaded === false && model === false) {
                        classes.push(_this.loadingClass);
                        // if the model is loaded and model is defined then add the loaded class to the classes array
                    } else if (loaded === true && model instanceof modelDefinition) {
                        classes.push(_this.loadedClass);
                    }
                }
                return classes;
            },
            setLoadingState(model) {
                let _this = this;
                _this.loaded = true;
                if (!model) {
                    _this.notFound = true;
                }
            }
        }
    }
</script>
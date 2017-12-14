<script>
    import PROPERTY_FIELDS from '../models/propertyFields';
    import _includes from 'lodash/includes'

    export default {

        mounted: async function () {
            let _this = this;

            if (_this.selectedFilterField) {
                _this.selectedFilterOptions = await _this.getDistinctFilterOptions(PROPERTY_FIELDS.type);
            }

            setTimeout(function () {
                _this.selectedFilterField = PROPERTY_FIELDS.type;
            }, 100)
        },

        data: function () {
            return {
                filterFields: [
                    PROPERTY_FIELDS.subdivision,
                    PROPERTY_FIELDS.type,
                    PROPERTY_FIELDS.status,
                    PROPERTY_FIELDS.acres
                ],
                selectedFilterField: null,
                selectedFilterOptions: [],
                selectedFilterValue: null
            }
        },

        computed: {
            showSlider: function () {
                let _this = this;

                return _this.selectedFilterField === PROPERTY_FIELDS.acres;
            },
            showFilterOptions: function () {
                let _this = this;

                return _includes(_this.filterFields, _this.selectedFilterField);
            },
            filters: function () {
                let _this = this;

                return _this.filterFields.reduce((accumulator, field) => {
                    accumulator.push({text: field, value: field});
                    return accumulator;
                }, []);
            }
        },

        watch: {
            selectedFilterField: async function () {
                let _this = this,
                    features = await _this.getDistinctFilterOptions(_this.selectedFilterField);

                if (features && features.length) {
                    _this.selectedFilterOptions = features.reduce((accumulator, feature) => {
                        let filterValue = feature.attributes[_this.selectedFilterField];
                        accumulator.push({ text: filterValue, value: filterValue });
                        return accumulator;
                    }, []);
                }
            }
        },

        methods: {
            getDistinctFilterOptions: async function (field) {
                return await ArcModel.executeQuery([field], ArcModelClass.queryWhereSelectAll(), true);
            }
        }
    }
</script>

<script>
    export default {
        props: [
            'columns',
            'models'
        ],

        computed: {
            headers() {
                let _this = this;
                return _this.createHeaders(_this.columns);
            },
            rows() {
                let _this = this;
                return _this.createRows(_this.columns, _this.models);
            }
        },

        methods: {
            createHeaders(columns) {
                if (columns && columns.length) {
                    return columns.reduce((accumulator, column) => {
                        if (column.heading) {
                            accumulator.push(column.heading);
                        }
                        return accumulator;
                    }, []);
                } else {
                    return [];
                }
            },
            createRows(columns, models) {
                let getColumnValue = function (column, model) {
                    let computed = column.computed,
                        key = column.key;
                    if (key) {
                        return model[key];
                    } else if (computed && typeof computed === 'function') {
                        return computed(model);
                    } else {
                        return null;
                    }
                };
                if (models && models.length && columns && columns.length) {
                    return models.reduce((rows, model) => {
                        let row = columns.reduce((row, column) => {
                            let value = getColumnValue(column, model),
                                filter = column.filter;
                            row.push(filter && typeof filter === 'function' ? filter(value) : value);
                            return row;
                        }, []);
                        rows.push(row);
                        return rows;
                    }, []);
                } else {
                    return [];
                }
            }
        }
    }
</script>

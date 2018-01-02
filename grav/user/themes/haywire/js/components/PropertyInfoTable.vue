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
            },
            mobileRows() {
                let _this = this;
                return _this.createMobileRows(_this.columns, _this.models);
            }
        },

        methods: {
            applyColumnFilter(filter, value) {
                return filter && typeof filter === 'function' ? filter(value) : value;
            },
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
                let _this = this;
                if (models && models.length && columns && columns.length) {
                    return models.reduce((rows, model) => {
                        let row = columns.reduce((row, column) => {
                            let value = _this.getColumnValue(column, model)
                            row.push( _this.applyColumnFilter(column.filter, value) );
                            return row;
                        }, []);
                        rows.push(row);
                        return rows;
                    }, []);
                } else {
                    return [];
                }
            },
            createMobileRows(columns, models) {
                let _this = this,
                    model = models && models.length ? models[0] : null;
                if (model && columns && columns.length) {
                    return columns.reduce((accumulator, column) => {
                        accumulator.push({
                            value: column.heading,
                            class: 'header'
                        });
                        let value = _this.getColumnValue(column, model)
                        accumulator.push({
                            value: _this.applyColumnFilter(column.filter, value),
                            class: 'cell'
                        });
                        return accumulator;
                    }, []);
                } else {
                    return [];
                }
            },
            getColumnValue(column, model) {
                let computed = column.computed,
                    key = column.key;
                if (key) {
                    return model[key];
                    } else if (computed && typeof computed === 'function') {
                        return computed(model);
                    } else {
                    return null;
                }
            }
        }
    }
</script>
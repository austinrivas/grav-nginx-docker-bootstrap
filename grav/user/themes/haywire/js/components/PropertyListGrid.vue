<script>
    export default {
        props: [
            'itemsInRow',
            'collection'
        ],

        async mounted() {
            let _this = this;

            if (_this.collection && _this.collection.length) {
                _this.rows = await _this.createRows(_this.collection);
            }

            _this.rowLength = _this.itemsInRow || 3;
        },

        data() {
            return {
                rows: []
            }
        },

        watch: {
            async collection() {
                let _this = this;

                if (_this.collection && _this.collection.length) {
                    _this.rows = await _this.createRows(_this.collection);
                }
            }
        },

        methods: {
            async createRows(collection) {
                let _this = this;

                if (collection && collection.length) {
                    let rows = await collection.reduce((rows, model) => {

                        let currentRow = rows && rows.length > 0 ? rows[rows.length - 1] : [];

                        if (currentRow.length === _this.rowLength) {
                            let newRow = [];

                            newRow.push(model);
                            rows.push(newRow)
                        } else {
                            currentRow.push(model);

                            if (rows.length > 0) {
                                rows[rows.length - 1] = currentRow;
                            } else {
                                rows.push(currentRow);
                            }
                        }

                        return rows;
                    }, []);

                    return await _this.fillLastRow(rows);
                } else {
                    return [];
                }
            },
            async fillLastRow(rows) {
                let _this = this;

                if (rows && rows.length > 0) {
                    let lastRow = rows[rows.length - 1],
                        remainder = lastRow.length % _this.rowLength;

                    if (remainder !== 0) {
                        for (let i = 0; i < _this.rowLength - remainder; i++) {
                            lastRow.push(null);
                        }
                    }

                    rows[rows.length - 1] = lastRow;
                }

                return rows;
            }
        }
    }
</script>

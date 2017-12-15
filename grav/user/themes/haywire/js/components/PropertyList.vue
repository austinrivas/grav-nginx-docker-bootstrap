<script>
    export default {
        props: ['properties'],
        mounted() {},
        data() {
            return {
                rows: []
            }
        },
        watch: {
            async properties() {
                let _this = this;

                if (_this.properties && _this.properties.length) {
                    _this.rows = await _this.createRows(_this.properties);
                }
            }
        },
        methods: {
            async createRows(collection) {
                let _this = this,
                    rows = await collection.reduce((rows, model) => {

                    let currentRow = rows && rows.length > 0 ? rows[rows.length - 1] : [];

                    if (currentRow.length === 3) {
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
            },
            async fillLastRow(rows) {
                if (rows &&rows.length > 0) {
                    let lastRow = rows[rows.length - 1];

                    let remainder = lastRow.length % 3;

                    if (remainder !== 0) {
                        for (let i = 0; i < 3 - remainder; i++) {
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

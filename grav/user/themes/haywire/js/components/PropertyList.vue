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
                    _this.rows = await _this.properties.reduce((rows, model) => {

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

                    if (_this.rows && _this.rows.length > 0) {
                        let lastRow = _this.rows[_this.rows.length - 1];

                        let remainder = lastRow.length % 3;

                        if (remainder !== 0) {
                            for (let i = 0; i < 3 - remainder; i++) {
                                lastRow.push(null);
                            }
                        }
                    }
                }
            }
        },
        method: {}
    }
</script>

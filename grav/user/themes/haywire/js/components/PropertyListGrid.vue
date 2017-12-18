<script>
    // generic component for rendering a collection in a tile view
    export default {
        props: [
            'itemsInRow', // how many items you want in each row of the grid
            'collection' // the collection of models to be rendered
        ],

        // runs when component is attached to the DOM
        async mounted() {
            let _this = this;
            // if collection is defined
            if (_this.collection && _this.collection.length) {
                _this.rows = await _this.createRows(_this.collection);
            }
            // if itemsInRow set rowLength, else use default value
            _this.rowLength = _this.itemsInRow ? _this.itemsInRow : _this.rowLength;
        },

        data() {
            return {
                rows: [],
                rowLength: 3
            }
        },

        watch: {
            // watch collection for changes
            async collection() {
                let _this = this;
                // when collection changes update the rows
                _this.rows = await _this.createRows(_this.collection);
            }
        },

        methods: {
            // map the collection of models into rows for rendering
            async createRows(collection) {
                let _this = this;
                // if collection is defined and populated
                if (collection && collection.length) {
                    // reduce the collection into an array of rows with rowLength items each e.g collection.length = 5 results in [ [ model, model, model ], [ model, model, null ] ]
                    let rows = await collection.reduce((rows, model) => {
                        // the current row is either the last row or an empty array if this is the first iteration
                        let currentRow = rows && rows.length > 0 ? rows[rows.length - 1] : [];
                        // if the currentRow already has rowLength elements
                        if (currentRow.length === _this.rowLength) {
                            // create a new row
                            let newRow = [];
                            // add model to new row
                            newRow.push(model);
                            // add new row to rows array
                            rows.push(newRow)
                        } else {
                            // add the current model to the currentRow
                            currentRow.push(model);
                            // if this is not the first row
                            if (rows.length > 0) {
                                // set the last row of the rows array to be the currentRow
                                rows[rows.length - 1] = currentRow;
                            } else {
                                // add the currentRow to the rows array
                                rows.push(currentRow);
                            }
                        }
                        return rows;
                    }, []);
                    // fill the last row of the rows array with null values to preserve layout
                    return await _this.fillLastRow(rows);
                } else {
                    return [];
                }
            },
            // a method to fill the last row of a rows array with null elements to preserve the grid layout
            async fillLastRow(rows) {
                let _this = this;
                // if rows is defined
                if (rows && rows.length > 0) {
                    // get the last row of the array
                    let lastRow = rows[rows.length - 1],
                        // get the number of remaining element slots in the row
                        remainder = lastRow.length % _this.rowLength;
                    // if there are remaining slots in the row
                    if (remainder !== 0) {
                        // user the remainder as an index value to fill the row with null values
                        for (let i = 0; i < _this.rowLength - remainder; i++) { lastRow.push(null); }
                    }
                    // set the last element of the rows array to be the newly filled lastRow
                    rows[rows.length - 1] = lastRow;
                }
                return rows;
            }
        }
    }
</script>

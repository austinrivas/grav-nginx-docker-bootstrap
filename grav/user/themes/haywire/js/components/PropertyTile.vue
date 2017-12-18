<script>
    import PropertyModel from "../models/propertyModel";

    // a reusable component for rendering a property in a tile ui
    export default {

        props: [
            'model' // an instance of PropertyModel
        ],

        computed: {
            // computed property for accessing the model id
            id() {
                return this.model && this.model.id ? this.model.id : null;
            },
            // computed property for generating the property title
            title() {
                // empty array for holding title elements
                let title = [];
                // if the model is defined
                if (this.model) {
                    // if the model has an address prop
                    if (this.model.address) {
                        // add the address value to title array
                        title.push(this.model.address)
                    }
                    // if the model has a lotId prop
                    if (this.model.lotId) {
                        // add the lotId value to the title array
                        title.push(`LOT ${this.model.lotId}`);
                    }
                }
                // if model is defined join the title elements into a property title
                return this.model && title.length ? title.join(' - ') : false;
            },
            // computed property for showing the totalPrice of a property
            price() {
                return this.model && this.model.totalPrice ? this.model.totalPrice : false;
            },
            // computed property for getting the value of imageUrl
            image() {
                return this.model ? this.model.imageUrl : false;
            },
            // computed property for getting the value of the property subtitle
            subtitle() {
                return this.model ? this.model.subdivision : false;
            },
            // computed property for getting the details for a property
            details() {
                // empty details container array
                let details = [];
                // if model is defined
                if (this.model) {
                    if (this.model.acres) { details.push(`${this.model.acres} ACRES`); }
                    if (this.model.type) { details.push(`${this.model.type}`); }
                    if (this.model.status) { details.push(`${this.model.status}`); }
                    if (this.model.pricePerSqft) { details.push(`${this.model.pricePerSqft} PSF`); }
                }
                // if model is defined join the details array into a details string
                return this.model && details.length ? details.join(' | ') : false;
            }
        }

    }
</script>

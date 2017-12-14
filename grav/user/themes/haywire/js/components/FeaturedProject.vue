<script>
    import PropertyModel from "../models/propertyModel";

    export default {

        props: ['model'],

        computed: {
            id() {
                return this.model && this.model.id ? this.model.id : null;
            },
            title() {

                let title = [];

                if (this.model) {
                    if (this.model.address) {
                        title.push(this.model.address)
                    }

                    if (this.model.lotId) {
                        title.push(`LOT ${this.model.lotId}`);
                    }
                }

                return this.model && title.length ? title.join(' - ') : false;
            },
            price() {
                return this.model && this.model.totalPrice ? this.model.totalPrice : false;
            },
            image() {
                return this.model ? this.model.imageUrl : false;
            },
            subtitle() {
                return this.model ? this.model.subdivision : false;
            },
            details() {

                let details = [];

                if (this.model) {

                    if (this.model.acres) {
                        details.push(`${this.model.acres} ACRES`);
                    }

                    if (this.model.type) {
                        details.push(`${this.model.type}`)
                    }

                    if (this.model.status) {
                        details.push(`${this.model.status}`);
                    }

                    if (this.model.pricePerSqft) {
                        details.push(`${this.model.pricePerSqft} PSF`);
                    }
                }

                return this.model && details.length ? details.join(' | ') : false;
            }
        }

    }
</script>

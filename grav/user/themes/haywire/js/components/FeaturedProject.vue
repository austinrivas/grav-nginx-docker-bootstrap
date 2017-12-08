<script>
    import PropertyModel from "../models/propertyModel";

    export default {
        props: ['model'],

        computed: {
            id: function () {
                return this.model && this.model.id ? this.model.id : null;
            }
//            ,
//            propImg: function () {
//                return this.model ? this.model.imgUrl : null;
//            },
//            subtitle: function () {
//                return this.model ? "subtitle" : null;
//            },
//            propDetails: function () {
//                return this.model ? "details" : null;
//            }
        }
    }
</script>

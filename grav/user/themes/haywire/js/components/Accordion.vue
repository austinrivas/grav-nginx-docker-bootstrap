<script>
    export default {
        props: ['tabs'],

        methods: {
            tabId(id) {
                return `tab-${id}`;
            }
        }
    }
</script>

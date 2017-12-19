<script>
import axios from 'axios';


export default {

    data() {
        return {
            error: '',
            submitting: false,
            success: ''
        }
    },

    methods: {
        submit(e)
        {
            var classDef = this
            e.preventDefault() 
            this.errorInEmail = false
            console.log(this.$refs.email.value)
            if ( !this.$refs.email.value || this.submitting ) { 
                this.error = 'Please enter a valid email'
                return false
            }

            this.submitting = true

            const data = this.serialize(this.$refs.Newsletter)
            var formData = new FormData()

            for( var k in data ) {
                formData.append(k, data[k])
            }

            // this.$http.post('/newsletter/signup', data).then(function (response) {
            //     // Success
            //     console.log(response.data)
            // },function (response) {
            //     // Error
            //     console.log(response.data)
            // });

            axios.post(`/newsletter-signup`, formData)
                .then(response => {
                  // JSON responses are automatically parsed.
                  if( response.data ) {
                    classDef.success = 'Thank you for signing up to our newsletter!'
                  }
                  classDef.submitting = false
                  classDef.error = false
                })
                .catch(e => {
                  classDef.error = 'Sorry we are experiencing technical difficulties at the time. Please try again later.'
                  classDef.submitting = false
                  classDef.success = false
                })
        },

        serialize (form) {
            var data = {};
            var inputs = [].slice.call(form.getElementsByTagName('input'));
            inputs.forEach(input => {
              data[input.name] = input.value;
            });
            return data
        }
    },
}
</script>

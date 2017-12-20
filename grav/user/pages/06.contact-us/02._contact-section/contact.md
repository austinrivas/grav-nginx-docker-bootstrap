---
contact:
    titleOne: 'Lakewood Ranch Commercial'
    titleTwo: 'Commercial Contacts'
    address: '<strong>LWR Commercial Realty</strong><br>14400 Covenant Way Lakewood Ranch, FL 34202'
    phone: 941.907.6677
    hours:
        -
            day: 'Mon. - Fri 9:00 am - 5:30 pm EST'
        -
            day: 'Sat. - Sun 10:00 am - 6:00 pm EST'
persons:
    -
        name: 'John Doe'
        title: CEO
        email: john@doe.com
        phone: 333-444-5555
    -
        name: 'Bradley Pitts'
        title: CFO
        email: bradley@pitts.com
        phone: 555-666-7777

form:
    action: /contact-us
    name: Contact
    classes: columns is-multiline is-gapless
    buttons:
        - type: submit
          value: Submit
          classes: form-submit button is-primary
          outerclasses: is-full columns is-gapless
          classes: is-full column
    fields:
        - name: firstname
          label: First Name
          type: text
          placeholder: First Name
          autofocus: true
          outerclasses: "is-half column"
          classes: "input is-primary-invert"
          validate:
            required: true
            message: 'Please enter a valid first name'
        - name: lastname
          label: Last Name
          type: text
          placeholder: Last Name
          outerclasses: "is-half column"
          classes: "input is-primary-invert"
          validate:
            required: true
            message: 'Please enter a valid last name'
        - name: email
          label: Email Address
          type: email
          placeholder: Email Address
          outerclasses: "is-half column"
          classes: "input is-primary-invert"
          validate:
            required: true
            message: 'Please enter a valid email address'
            pattern: (?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))
        - name: phone
          label: Phone
          type: text
          placeholder: Phone
          outerclasses: "is-half column"
          classes: "input is-primary-invert"
          validate:
            required: true
            message: 'Please enter a valid phone number'
        - name: contact
          label: Preferred Method of Contact
          type: text
          placeholder: Enter Name
          outerclasses: "is-half column"
          classes: "input is-primary-invert"
          validate:
            required: true
            message: 'Please specify your contact preference'
        - name: topic
          label: What can we help you with?
          type: select
          outerclasses: "is-half column"
          classes: "input is-primary-invert"
          options: 
              properties: 'Commercial Properties'
              lots: 'Commercial Lots'
          validate:
            required: true
            message: 'Please select what we can help you with'
        - name: message
          label: Message
          type: textarea
          outerclasses: "is-full column"
          classes: "textarea is-primary-invert"
        - name: news_letter
          type: checkbox
          classes: "label checkbox is-primary-invert"
          outerclasses: is-full column
          label: "FPO: Yes I'd like to receive updated news and information"
    process:
        - email:
            from: "{{ config.plugins.email.from }}"
            to:
              - "{{ form.value.email }}"
            subject: "LWR Commercial Inquiry from: {{ form.value.name|e }}"
            body: "{% include 'forms/data.html.twig' %}"
        - message: Thank you for contacting us. We will get back to you shortly!
        - mailchimp:
            required_fields: [news_letter]
            lists: [bb0fc48ece]
            field_mappings:
                FNAME: firstname
                LNAME: lastname
                PHONE: phone
                EMAIL: email
---

Please use the form below to contact us with any questions or comments you may have.
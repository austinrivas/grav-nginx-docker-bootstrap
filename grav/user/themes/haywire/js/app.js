/**
* Include polyfill for vue (IE)
*/

import "babel-polyfill";
import ArcModel from "./models/arcModel";
import PropertyModel from "./models/propertyModel"

/**
 * Load all of this project's JavaScript dependencies including Vue
 */

require('./bootstrap');

window.Vue = require('vue');
window.ArcModel = ArcModel;
window.PropertyModel = PropertyModel;

/**
 * Create a fresh Vue application instance and attach it to
 * the page. You may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('navbar', require('./components/Navbar.vue'));
Vue.component('arcmap', require('./components/ArcMap.vue'));

const app = new Vue({
    el: '#app'
});

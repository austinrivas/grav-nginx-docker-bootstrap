/**
* Include polyfill for vue (IE)
*/

import "babel-polyfill";
import ArcModel from "./models/arcModel";
import PropertyModel from "./models/propertyModel"
import PropertyCollection from "./models/propertyCollection"
import FavoritePropertiesCollection from "./models/favoritePropertiesCollection"

/**
 * Load all of this project's JavaScript dependencies including Vue
 */

window.Vue = require('vue');
window.ArcModel = ArcModel;
window.PropertyModel = PropertyModel;
window.PropertyCollection = PropertyCollection;
window.FavoritePropertiesCollection = FavoritePropertiesCollection;

/**
 * Create a fresh Vue application instance and attach it to
 * the page. You may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('arcmap', require('./components/ArcMap.vue'));
Vue.component('favorite-icon', require('./components/FavoriteIcon.vue'));
Vue.component('featured-project', require('./components/FeaturedProject.vue'));
Vue.component('featured-projects', require('./components/FeaturedProjects.vue'));
Vue.component('navbar', require('./components/Navbar.vue'));

const app = new Vue({
    el: '#app'
});

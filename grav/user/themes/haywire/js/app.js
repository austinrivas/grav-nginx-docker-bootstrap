/**
* Include polyfill for vue (IE)
*/

import 'babel-polyfill';

// Resources and Collections
import ArcModel from './models/arcModel';
import PropertyCollection from './models/propertyCollection';
import FavoritePropertiesCollection from './models/favoritePropertiesCollection';

// Vue and Vue Filters
import Vue from 'vue';
import VueCurrencyFilter from './filters/vue-currency-filter';

// Vue Components
import ArcMap from './components/ArcMap.vue';
import FavoriteIcon from './components/FavoriteIcon.vue';
import FeaturedProject from './components/FeaturedProject.vue';
import FeaturedProjects from './components/FeaturedProjects.vue';
import Navbar from './components/Navbar.vue';

Vue.component('arcmap', ArcMap);
Vue.component('favorite-icon', FavoriteIcon);
Vue.component('featured-project', FeaturedProject);
Vue.component('featured-projects', FeaturedProjects);
Vue.component('navbar', Navbar);

/**
 * Load all of this project's JavaScript dependencies including Vue
 */

// For easy reference
window.Vue = Vue;

// Create Resource and Collection Singletons
window.ArcModel = new ArcModel();
window.ArcModelClass = ArcModel;
window.Properties = new PropertyCollection();
window.FavoriteProperties = new FavoritePropertiesCollection();

/**
 * Create a fresh Vue application instance and attach it to
 * the page. You may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.use(VueCurrencyFilter, {
    symbol : '$',
    thousandsSeparator: ',',
    fractionCount: 0,
    fractionSeparator: '.',
    symbolPosition: 'front',
    symbolSpacing: true
});

window.App = new Vue({
    delimiters: ['${', '}'],
    el: '#app'
});

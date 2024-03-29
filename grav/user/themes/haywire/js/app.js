/**
 * Include polyfill for vue (IE)
 */

import 'babel-polyfill';

// NodeList polyfill for IE, still doing this in 2018
(function () {
    if (typeof NodeList.prototype.forEach === "function") { return false; }
    NodeList.prototype.forEach = Array.prototype.forEach;
})();

// Resources and Collections
import ArcModel from './models/arcModel';
import PropertyCollection from './models/propertyCollection';
import FavoritePropertiesCollection from './models/favoritePropertiesCollection';

// Vue and Vue Filters
import Vue from 'vue';
import VueCurrencyFilter from './filters/vue-currency-filter';

// Event Handlers
import EventBus from './event-handlers/event-bus';
import ImageLoader from './event-handlers/image-loader';

// Vue Components
import Accordion from './components/Accordion';
import ArcMap from './components/ArcMap.vue';
import Articles from './components/Articles.vue';
import ContactForm from './components/ContactForm.vue';
import FavoriteIcon from './components/FavoriteIcon.vue';
import FeaturedProjects from './components/FeaturedProjects.vue';
import Hero from './components/Hero.vue';
import Navbar from './components/Navbar.vue';
import NewsletterSignup from './components/NewsletterSignup.vue';
import PageState from './components/PageState.vue';
import ProgressBar from './components/ProgressBar.vue';
import PropertyAggregate from './components/PropertyAggregate.vue';
import PropertyDescription from './components/PropertyDescription.vue';
import PropertyDetail from './components/PropertyDetail.vue';
import PropertyFilter from './components/PropertyFilter.vue';
import PropertyHeader from './components/PropertyHeader.vue';
import PropertyImageGallery from './components/PropertyImageGallery.vue';
import PropertyInfoTable from './components/PropertyInfoTable.vue';
import PropertyListGrid from './components/PropertyListGrid.vue';
import PropertyListTable from './components/PropertyListTable.vue';
import PropertyTile from './components/PropertyTile.vue';
import RangeSlider from './components/RangeSlider.vue';
import SelectFilter from './components/SelectFilter.vue';

// Vue Component declaration
Vue.component('accordion', Accordion);
Vue.component('arcmap', ArcMap);
Vue.component('articles', Articles);
Vue.component('contact-form', ContactForm);
Vue.component('favorite-icon', FavoriteIcon);
Vue.component('featured-projects', FeaturedProjects);
Vue.component('hero', Hero);
Vue.component('navbar', Navbar);
Vue.component('newsletter-signup', NewsletterSignup);
Vue.component('page-state', PageState);
Vue.component('progress-bar', ProgressBar);
Vue.component('property-aggregate', PropertyAggregate);
Vue.component('property-description', PropertyDescription);
Vue.component('property-detail', PropertyDetail);
Vue.component('property-filter', PropertyFilter);
Vue.component('property-header', PropertyHeader);
Vue.component('property-image-gallery', PropertyImageGallery);
Vue.component('property-info-table', PropertyInfoTable);
Vue.component('property-list-grid', PropertyListGrid);
Vue.component('property-list-table', PropertyListTable);
Vue.component('property-tile', PropertyTile);
Vue.component('range-slider', RangeSlider);
Vue.component('select-filter', SelectFilter);

/**
 * Load all of this project's JavaScript dependencies including Vue
 */

// For easy reference
window.Vue = Vue;
window.VueEventBus = EventBus;

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
    symbol: '$',
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

// initialize ImageLoader class to animate in images on load
new ImageLoader();

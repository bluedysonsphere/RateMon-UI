import Vue from 'vue';
import App from './App.vue';
//import router from './router';
//import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import axios from 'axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app');

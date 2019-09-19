import Vue from 'vue';
import VueLodash from 'vue-lodash';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '../sass/style.scss';
import App from './App';
import router from './router';
import store from './store';

Vue.use(BootstrapVue);
Vue.use(VueLodash);
Vue.use(require('vue-moment'));

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';
import App from './App';
import router from './router';
import './bus.js';
import currencyFilter from './Filters/currency';
import dataFilter from './Filters/data';
import 'bootstrap';






 
Vue.use(VueAxios, axios);


Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW', zhTWValidate);


axios.defaults.withCredentials = true;
Vue.config.productionTip = false;

Vue.component('Loading',Loading);
Vue.filter('currency', currencyFilter);
Vue.filter('date', dataFilter);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


//路由的導航守衛，限制使用者藉由非認證方式登入
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
    const vm = this;
    axios.post(api).then(response =>{
      console.log(response.data);
      if(response.data.success){
        // vm.$router.push('/');
        next();
      }else{
        next({
          path: '/login',
        });
      }
    });
  }else{
    next();
  }
})
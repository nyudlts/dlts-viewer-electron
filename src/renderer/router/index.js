import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/book/ifa_frdl_book000002/1',
      name: 'book',
      component: require('@/components/Book').default,
    },
    {
      path: '*',
      redirect: '/book/ifa_frdl_book000002/1',
    },
  ],
});

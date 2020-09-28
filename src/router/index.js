import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/pages/Login'
import Products from '@/components/pages/Products'
import Orders from '@/components/pages/Orders'
import Coupons from '@/components/pages/Coupons'
import CustomerOrders from '@/components/pages/CustomerOrders'
import CustomerCheckout from '@/components/pages/CustomerCheckout'
import Index from '@/components/userpages/Index'
import UserPrdoucts from '@/components/userpages/products'
import UserIndex from '@/components/userpages/Content'
import UserLogin from '@/components/userpages/UserLogin'
import UserCart from '@/components/userpages/Cart'
import checkoutsuccess from '@/components/userpages/Checkout-success'



Vue.use(Router)

export default new Router({
  mode: "history",
  linkActiveClass: 'active',
  routes: [
    {
      path: '/user',
      name: 'index',
      component: Index,
      children:[
        {
          path: 'checkoutsuccess',
          name: 'checkoutsuccess',
          component: checkoutsuccess,
        },

                {
          path: 'products',
          name: 'UserPrdoucts',
          component: UserPrdoucts,
        },
        {
          path: 'index',
          name: 'UserIndex',
          component: UserIndex,
        },
        {
          path: 'cart',
          name: 'UserCart',
          component: UserCart,
        },
        {
          path: 'login',
          name: 'UserLogin',
          component: UserLogin,
        },
      ]
    },
    {
      path: '*',
      redirect: '/login',
    },

    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: { requiresAuth: true },
    // },

    {
      path: '/login',
      name: 'Login',
      component: Login,
    },

    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
      ],
    },

    {
      path: '/',
      name: 'Dashboard2',
      component: Dashboard,
      children: [
        {
          path: 'customer_orders',
          name: 'CustomerOrder',
          component: CustomerOrders,
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout,
        },
      ],
    },

  ],
});
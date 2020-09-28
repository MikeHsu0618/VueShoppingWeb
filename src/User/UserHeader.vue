<template>
    <div>
        <nav class="navbar navbar-expand-md navbar-light bg-white">
    <div class="container">
      <button class="navbar-toggler d-md-none d-flex align-items-center" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i class="material-icons">
          menu
        </i>
      </button>
      <router-link to="/user/index" class="nav-link">
       <img src="@/assets/images/logo-all-dark.svg" width="220" height="40" alt="" class="d-none d-md-inline-block">
        <img src="@/assets/images/logotype-sm-dark.svg" width="114" height="18" alt="" class="d-inline-block d-md-none">
      </router-link>
      <router-link to="/user/cart" 
      class="nav-link d-flex align-items-center order-md-1" style="position:relative"><i class="material-icons">
        shopping_cart
        </i> <div class="cartNum text-white"  >{{cart.Qty}}</div></router-link>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item <% if (current === 'index') { %>active<%} %>">

            <router-link to="/user/index" class="nav-link">首頁</router-link>
          </li>
          <li class="nav-item <% if (current === 'products') { %>active<%} %>">
            <router-link to="/user/products" class="nav-link">甜點</router-link>
          </li>
          <li class="nav-item <% if (current === 'register') { %>active<%} %>">
            <router-link to="/user/login" class="nav-link">登入</router-link>
          </li>
        </ul>
      </div>
    </div>
        </nav>
    </div>
</template>


<script>
export default {
    data(){
    return {
      cart:{
      Qty: 0,
    },
    }
  },
  methods: {
        getCart(){
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            this.$http.get(api).then(response =>{
            response.data.data.carts.forEach(item => {
                vm.cart.Qty+=item.qty

            });

            });
        },
        
    
  },
  created(){
        const vm = this;
    this.getCart()
    vm.$bus.$on('cartQtyUpdate',function(){
            vm.cart.Qty=0;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            vm.$http.get(api).then(response =>{
            if(response.data.data.carts[0].qty){
              response.data.data.carts.forEach(item => {
                
              vm.cart.Qty+=item.qty;

            });
            }


            });
    });
  }
}
</script>


<style >
  .cartNum{

    position: absolute;
    bottom: 8px;
    text-align: center;
    font-weight:bold ;
    width:15px;
    font: 0.8em sans-serif;
    background-color: red;
    border-radius: 15px;
  }
</style>
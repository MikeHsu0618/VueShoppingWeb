<template>

    <div>
        <div class="container px-0 px-md-3">
  <header class="header">
    <div class="header-main-image bg-cover" style="background-image: url(https://images.unsplash.com/photo-1512484457149-266d165a4eca?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=786581a33fd6c9343735655439ce2e5a&auto=format&fit=crop&w=1380&q=80)"></div>
    <h1 class="text-hide">
      想吃甜點是不需要理由的
      <img src="/images/lg-想吃甜點是不需要理由的.svg" width="89" class="header-image-context" alt="">
    </h1>
    
  </header>
</div>

<section class="container my-6">
  <div class="row">
    <div class="col-md-4 mb-5">
      <h2 class="mb-0 py-3 text-center bg-primary text-white h4">甜點類別</h2>
      <div class="list-group text-center">
        <a href="#" class="list-group-item list-group-item-action h4 active">
          所有甜點（48）
        </a>
        <a href="#" class="list-group-item list-group-item-action h4">本日精選（10）</a>
        <a href="#" class="list-group-item list-group-item-action h4">人氣推薦（26）</a>
        <a href="#" class="list-group-item list-group-item-action h4">新品上市（12）</a>
        <a href="#" class="list-group-item list-group-item-action h4 disabled">絕版品</a>
      </div>
    </div>

    <div class="col-md-8">
      <div class="row">
        <!-- 產品 Start -->
    <div class="col-md-6" v-for="item in products" :key="item.id">
      <div class="item-card mb-4">
        <div class="item-image" :style="{ 'background-image': 'url(' + item.imageURL + ')' }">
          <div class="item-tag">{{item.category}}</div>
          <div class="item-stared-icon">
            <label class="ui-checked-display">
              <input type="checkbox" class="ui-checkbox">
              <i class="material-icons ui-show">
                favorite
              </i>
              <i class="material-icons ui-hidden">
                favorite_border
              </i>
            </label>
          </div>
        </div>
        <div class="item-body d-flex text-center">
          <div class="item-name col">{{item.title}}</div>
          <strong class="item-price col">NT$ {{item.price}}</strong>
        </div>
        <div class="d-flex">
        <div class="col-md-6 text-md btn-lg btn-primary-lighter btn btn-block" @click.prevent="getProduct(item.id)">
            <i class="fas fa-spinner fa-spin"  v-if="item.id == status.loadingItem" ></i>
            查看更多
        </div>
        <div class="col-md-6 text-md btn-lg btn-primary-lighter btn btn-block" style="margin:0px" @click.prevent="addtoCart(item.id)">
            <i class="fas fa-spinner fa-spin"  v-if="item.id == status.loadingItem2" ></i>
            加入購物車

        </div> 
        </div>
     
        
      </div>
    </div>

        <!-- 產品 End -->
      </div>
      <Pg :pages="pagination" @turnPage='getProducts'></Pg>
       <!-- Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageURL" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right" v-if="product.description">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
               <strong v-if="product.num">小計{{ product.num * product.price }}元</strong> 
            </div>
            <button type="button" class="btn btn-primary"
              @click="addtoCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem2"></i>
              加到購物車
            </button>
                        </div>
                    </div>
                </div>
            </div>
        <!-- Modal -->
      

    </div>
  </div>
</section>
    </div>
</template>

<script>
//在不同的分頁有用到JQUERY需要載入
import $ from 'jquery';
import Pg from '../Pagination'

export default {
    components:{
       Pg,
    },
    data(){
        return {
            products:[],
            product:{},
            pagination:{},
            tempProduct:{},
            isLoading:false,
                        status:{
                loadingItem:'',
                loadingItem2:'',
            },
        };
    },
    methods: {
        getProducts(page = 1){
    const vm = this;
    const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
    console.log(process.env.APIPATH,process.env.CUSTOMPATH)
    vm.isLoading = true;
    //開始頁面整理動畫
    this.$http.get(api).then(response =>{
        console.log(response.data);
        vm.isLoading = false;
        //關閉頁面整理動畫
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
    });
        },
        getProduct(id){
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
            vm.isLoading = true;
            vm.status.loadingItem=id;
    //開始頁面整理動畫
    this.$http.get(api).then(response =>{
        console.log(response.data);
        vm.isLoading = false;
        //關閉頁面整理動畫
        
        vm.product = response.data.product;
        $('#productModal').modal('show');
        vm.status.loadingItem='';
         });
        },        
        addtoCart(id, qty =1){
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            vm.status.loadingItem2=id;
            //開始頁面整理動畫
            this.$http.post(api, { "data": { "product_id" : id,"qty": qty } }).then(response =>{
            console.log(response.data);
            //關閉頁面整理動畫
            vm.status.loadingItem2='';
            $('#productModal').modal('hide');
            this.$bus.$emit('cartQtyUpdate', 2);
            });
            },

    },
    created(){
        this.getProducts();
        
    },
}
</script>


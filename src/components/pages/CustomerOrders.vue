<template>
    <div>
        <loading :active.sync="isLoading" >
        </loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key=item.id>
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; 
                    background-position: center"
                    :style="{backgroundImage:`url(${item.imageURL})`}"
                    >
                    </div>
                    <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{item.title}}</a>
                    </h5>
                    <p class="card-text"></p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
                        <del class="h6" v-if="item.price">原價 {{item.origin_price}}元</del>
                        <div class="h5" v-if="item.price">現在只要{{item.price}} 元</div>
                    </div>
                    </div>
                    <div class="card-footer d-flex text-sm">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                        <i class="fas fa-spinner fa-spin"  v-if="item.id == status.loadingItem"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                        <i class="fas fa-spinner fa-spin"  v-if="item.id == status.loadingItem2" ></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
            <div class="col-md-8 mb-8 m-auto">
                <table class="table">
                    <thead>
                        <th></th>
                        <th>品名</th>
                        <th>數量</th>
                        <th>單價</th>
                    </thead>
                    <tbody>
                        <tr v-for="item in cart.carts" :key="item.id">
                        <td class="align-middle">
                            <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteCartItem(item.id)">
                            <i class="far fa-trash-alt"></i>
                            </button>
                        </td>
                        <td class="align-middle">
                            {{ item.product.title }}
                            <div class="text-success" v-if="item.coupon">
                            已套用優惠券
                            </div>
                        </td>
                        <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                        <td class="align-middle text-right">{{ item.final_total }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                        <td colspan="3" class="text-right">總計</td>
                        <td class="text-right">{{ cart.total }}</td>
                        </tr>
                        <tr  v-if="cart.total != cart.final_total">
                        <td colspan="3" class="text-right text-success">折扣價</td>
                        <td class="text-right text-success">{{ cart.final_total }}</td>
                        </tr>
                    </tfoot>
                    </table>
                    <div class="input-group mb-3 input-group-sm ">
                    <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" @click="addCouponCode()">
                        套用優惠碼
                        </button>
                    </div>
                    </div>
            </div>
            <div class="my-5 row justify-content-center ml-auto mr-auto">
                <form style="width:100%"  @submit.prevent="CreateOrder()">
                    <div class="form-group">
                    <label for="useremail">Email</label>
                    <input type="email" class="form-control" name="email" id="useremail"
                        :class="{'is-invalid': errors.has('email')}"
                        v-model="form.user.email" placeholder="請輸入 Email" v-validate="'required|email'">
                    <span class="text-danger"  v-if="errors.has('email')">
                        {{errors.first('email')}}
                    </span>
                    </div>
                
                    <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <input type="text" class="form-control" name="name" id="username"
                        :class="{'is-invalid': errors.has('name')}"
                        v-model="form.user.name" placeholder="輸入姓名" v-validate="'required'">
                    <span class="text-danger" v-if="errors.has('name')">必須輸入姓名</span>
                    </div>

                    <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <input type="tel" class="form-control" id="usertel" name="phoneNumnber" 
                     :class="{'is-invalid': errors.has('phoneNumnber')}"
                    v-validate="'required'" v-model="form.user.tel" placeholder="請輸入電話">
                     <span class="text-danger" v-if="errors.has('phoneNumnber')">必須輸入聯絡方式</span>
                    </div>
                
                    <div class="form-group">
                    <label for="useraddress">收件人地址</label>
                    <input type="text" class="form-control" name="address" id="useraddress" 
                     v-validate="'required'" :class="{'is-invalid': errors.has('address')}"
                    v-model="form.user.address"
                        placeholder="請輸入地址">
                    <span class="text-danger"  v-if="errors.has('address')">地址欄位不得留空</span>
                    </div>
                
                    <div class="form-group">
                    <label for="comment">留言</label>
                    <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                    </div>
                    <div class="text-right">
                    <button class="btn btn-danger">送出訂單</button>
                    </div>
                </form>
                </div>
        </div>
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
</template>

<script>
import $ from 'jquery';

export default {
    data() {
        return {
            products:[],
            product:{},
            cart:[],
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
                },
            isLoading:false,
            status:{
                loadingItem:'',
                loadingItem2:'',
            },
            coupon_code:'',
        }
    },

    methods: {
        getProducts(page =1) {
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
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
        vm.getCart();
         });
        },
        getCart(){
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            vm.isLoading = true;
            //開始頁面整理動畫
            this.$http.get(api).then(response =>{
            console.log(response.data.data.carts);
            vm.cart = response.data.data;
            vm.isLoading = false;

            //關閉頁面整理動畫
            });
        },
        deleteCartItem(id){            
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
            vm.isLoading = true;
            //開始頁面整理動畫
            this.$http.delete(api).then(response =>{
            console.log(response);
            vm.getCart();
            vm.isLoading = false;
            //關閉頁面整理動畫
            });   
        },
        addCouponCode(){
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
            const coupon = {
                code: vm.coupon_code
            }
            vm.isLoading = true;
            //開始頁面整理動畫
            this.$http.post(api, {data:coupon}).then(response =>{
            console.log(response);
            vm.getCart();
            vm.isLoading = false;
            //關閉頁面整理動畫
            });   
        },
        CreateOrder() {
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;

            // vm.isLoading = true;
            //開始頁面整理動畫
            this.$validator.validate().then((result) => {
            if (result) {
            this.$http.post(api, {data:vm.form}).then(response =>{
            console.log('訂單已建立',response);
            if(response.data.success){
                vm.$router.push(`/customer_checkout/${response.data.orderId}`)
            }
            vm.getCart();
            vm.isLoading = false;
            //關閉頁面整理動畫
                        });   
                // 當驗證成功時執行 AJAX 的行為
                        } else {
                            console.log("欄位不完整")
                // 驗證失敗產生的行為
            }
            })




        }
        },
    created(){
        this.getProducts();
        this.getCart();
    },
}
</script>
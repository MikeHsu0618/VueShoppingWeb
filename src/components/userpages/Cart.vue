<template>
    <div>
        <section class="container my-md-5">
  <div class="row carts">
    <div class="col-md-7">
      <h1 class="bg-primary-lighter h4 mb-0 py-4 text-center">
        您的購物車
      </h1>
            <div class="cart-row d-flex flex-column flex-md-row py-3" v-for="item in cart" :key="item.id">
        <div class="d-flex align-items-center flex-grow-1 mr-md-3">
          <div class="my-4 mr-4 flex-grow-1 flex-md-grow-0">
            <div class="cart-image"  :style="{ 'background-image': 'url(' + item.product.imageURL + ')' }"></div>
          </div>
          <div class="d-flex align-items-md-center flex-column flex-md-row flex-md-grow-1">
            <div class="flex-fill mr-md-4">
              <span class="h5">{{item.product.title}}</span><br>
              <span>NT$ {{item.product.price}}</span>
              <div class="text-success" v-if="item.coupon">
              已套用優惠券
              </div>
            </div>
            <div class="cart-control ml-md-auto mt-3 mt-md-0">
              <div class="input-group carts-input-group">
                      <div style="font-size:1.25rem;padding-left:30px">{{item.qty}}{{item.product.unit}}</div>
                <div class="input-group-append">

                </div>
              </div>
            </div>
          </div>
        </div>
                <div class="price ml-md-auto align-items-center py-3 justify-content-end d-flex flex-md-row-reverse">
          <a href="#" class="btn d-none d-md-block" @click.prevent="deleteCartItem(item.id)"><span class="material-icons">delete_outline</span></a>
          <div class="d-flex flex-column">
            <span class="h5 mb-0 mr-md-3" v-if=" !item.coupon">NT$ {{item.total}}</span>
            <del class="h5 mb-0 mr-md-3" v-if="item.coupon">
              NT$ {{item.qty * item.product.price}}</del>
            <span class="h5 mb-0 mr-md-3" v-if="item.coupon">NT$ {{item.final_total}}</span>            
          </div>
        </div>
            </div>
        <div class="input-group mb-3 input-group-sm mt-3">
          <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="addCouponCode()">
                        套用優惠碼
                  </button>
                 </div>
        </div>            

    </div>

    <!-- form -->
    
    <div class="col-md-5">
      <form width="100%"  @submit.prevent="CreateOrder()">
      <div class="negative-row-margin mx-lg-0">
        <div class="p-5 bg-primary text-primary-lighter">
          <div class="form-row mb-5">
            <div class="col-6">
              <h1 class="text-primary-lighter">運送</h1>
            </div>
            <div class="col-6 d-flex align-items-center">
              <div class="process-steps w-100">
                <div class="step-circle material-icons active"></div>
                <div class="step-circle material-icons"></div>
                <div class="step-circle material-icons"></div>
              </div>
            </div>
          </div>
        
          <div class="form-row">
            <div class="col-12">
              <div class="form-group">
                <label class="h4" for="name">Email</label>
                <input type="email" class="form-control form-control-lg bg-primary-lighter" name="email" id="useremail"
                        :class="{'is-invalid': errors.has('email')}"
                        v-model="form.user.email" placeholder="請輸入 Email" v-validate="'required|email'">
              </div>
              <div class="form-group">
                <label class="h4" for="name">收件人姓名</label>
                <input type="text" class="form-control form-control-lg bg-primary-lighter" name="name" id="username"
                        :class="{'is-invalid': errors.has('name')}"
                        v-model="form.user.name" placeholder="輸入姓名" v-validate="'required'">
              </div>
            </div>

          </div>
        
          <div class="form-group">
            <label class="h4" for="tel">電話</label>
                    <input type="tel" class="form-control form-control-lg bg-primary-lighter" id="usertel" name="phoneNumnber" 
                     :class="{'is-invalid': errors.has('phoneNumnber')}"
                    v-validate="'required'" v-model="form.user.tel" placeholder="請輸入電話">            
          </div>
        
          <label class="h4" for="city">地址</label>

          <div class="form-group mb-0">
            <input type="text" class="form-control form-control-lg bg-primary-lighter" name="address" id="useraddress" 
                     v-validate="'required'" :class="{'is-invalid': errors.has('address')}"
                    v-model="form.user.address"
                        placeholder="請輸入地址">
          </div>
        </div>
      </div>
            
      <div class="p-md-3 py-3 pt-0 cart-msg-box">
        <h2 class="text-center cart-msg-title h4 py-3">訂單摘要</h2>
        <hr class="border-white mt-0">
        <div class="d-flex justify-content-between mb-2">
          <span class="h6">小計</span>
          <span class="h6"  v-if="cart_total">NT$ {{cart_total.total}}</span>
        </div>
        <div class="d-flex justify-content-between mb-3 text-danger">
          <span>折扣</span>
          <span >NT$ -{{cart_total.total - cart_total.final_total}}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span class="h5">總計</span>
          <span class="h5" v-if="cart_total">NT$ {{cart_total.final_total}}</span>
        </div>
      </div>
      <div class="negative-row-margin mx-md-0">
        <button class="btn btn-accent btn-block btn-lg py-3 text-primary">
          確認結帳
          </button>
      </div>
          </form>
    </div>

  </div>
</section>
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
            orderId:'',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
                },
            cart_total:{},
            isLoading:false,
            status:{
                loadingItem:'',
                loadingItem2:'',
            },
            coupon_code:'',
        }
    },

    methods: {

        getCart(){
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            vm.isLoading = true;
            //開始頁面整理動畫
            this.$http.get(api).then(response =>{
            console.log(response.data.data);
            vm.cart = response.data.data.carts;
            vm.cart_total = {total: response.data.data.total,
                             final_total: response.data.data.final_total
                                  }
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
        CreateOrder() {
            const vm = this;
            const api =  `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;

            // vm.isLoading = true; //開始頁面整理動畫

            this.$validator.validate().then((result) => {
            if (result) {
            this.$http.post(api, {data:vm.form}).then(response =>{
            console.log('訂單已建立',response);
            if(response.data.success){
                vm.orderId = response.data.orderId;
                vm.payOrder()
            }
            vm.getCart();
            vm.isLoading = false;//關閉頁面整理動畫
                        });   
                        } else {
                            console.log("欄位不完整")
                // 驗證失敗產生行為
            }
            })
        },
        payOrder(){
             const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/pay/${this.orderId}`;
            vm.isLoading = true;
            //開始頁面整理動畫
            this.$http.post(api).then(response =>{
                console.log(response.data);
                vm.isLoading = false;
                if (response.data.success){
                    alert(response.data.message);
                    this.$bus.$emit('cartQtyUpdate', 2);
                    vm.$router.push(`/user/checkoutsuccess`)
                }else{
                    alert(response.data.message);
                }

            });
        }       
        },
    created(){

        this.getCart();
    },
}
</script>
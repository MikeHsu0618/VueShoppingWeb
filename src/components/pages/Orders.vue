<template>
    <div>
        <loading :active.sync="isLoading" >
        </loading>
        <div class="text-right">
            <button class="btn  btn-primary mt-3"  @click="openModal(true)">建立新訂單</button>
        </div>
      <table class="table mt-4">
            <thead>
                <tr>
                    <th width="80">購買時間</th>
                    <th width="150">Email</th>
                    <th >購買款項</th>
                    <th width="80">應付金額</th>
                    <th width="80">是否付款</th>
                    <th width="130" class="text-center">編輯</th>
                </tr>
            </thead>
                <tbody>
                    <tr v-for="(item, key) in orders" :key="key"
                        :class="{'text-secondary': !item.is_paid}">
                        <td>{{ item.create_at | date }}</td>
                        <td><span v-text="item.user.email" v-if="item.user"></span></td>
                        <td>
                            <ul class="list-unstyled">
                            <li  class="d-flex text-right" v-for="(product, i) in item.products" :key="i">
                              <span> {{ product.product.title }}</span> <span class="flex-grow-1">數量：{{ product.qty }}{{ product.product.unit }}</span>
                               
                            </li>
                            </ul>
                        </td>
                        <td class="text-right">{{ item.total | currency }}</td>
                        <td>
                            <strong v-if="item.is_paid" class="text-success">已付款</strong>
                            <span v-else class="text-muted">尚未付款</span>
                        </td>

                            <td class="text-right">
                            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                            <button class="btn btn-danger btn-sm" @click="deleteProduct(item)">刪除</button>
                            
                        </td>
                        </tr>
                </tbody>
      </table>
            <Pg :pages="pagination" @turnPage='getOrders'></Pg>

        <!-- Modal -->
<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>新增產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label for="image">輸入圖片網址</label>
              <input type="text" class="form-control" id="image"
                v-model="tempProduct.imageURL"
                placeholder="請輸入圖片連結">
            </div>
            <div class="form-group">
              <label for="customFile">或 上傳圖片
                <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
              </label>
              <input type="file" id="customFile" class="form-control"
                ref="files" @change="uploadFile()">
            </div>
            <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
              class="img-fluid" :src="tempProduct.imageURL" alt="">
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title"
              v-model="tempProduct.title"
                placeholder="請輸入標題">
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input type="text" class="form-control" id="category"
                v-model="tempProduct.category"
                  placeholder="請輸入分類">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input type="unit" class="form-control" id="unit"
                v-model="tempProduct.unit"
                  placeholder="請輸入單位">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
              <label for="origin_price">原價</label>
                <input type="number" class="form-control" id="origin_price"
                v-model="tempProduct.origin_price"
                  placeholder="請輸入原價">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input type="number" class="form-control" id="price"
                v-model="tempProduct.price"
                  placeholder="請輸入售價">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea type="text" class="form-control" id="description"
              v-model="tempProduct.description"
                placeholder="請輸入產品描述"></textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea type="text" class="form-control" id="content"
              v-model="tempProduct.content"
                placeholder="請輸入產品說明內容"></textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                v-model="tempProduct.is_enabled"
                :true-value="1"
                :false-value="0"
                  id="is_enabled">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" @click="updateOrders">確認</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>刪除產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-danger"
          >確認刪除</button>
      </div>
    </div>
  </div>
</div>
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
            orders: [],
            pagination:{},
            tempProduct:[],
            isNew:false,
            isLoading:false,
            status:{
                fileUploading:false,

            }
        };
    },
    methods: {
        getOrders(page = 1){
    const vm = this;
    const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/orders?page=${page}`;
    console.log(process.env.APIPATH,process.env.CUSTOMPATH)
    vm.isLoading = true;
    //開始頁面整理動畫
    this.$http.get(api).then(response =>{
        console.log(response.data.orders);
        vm.isLoading = false;
        vm.orders = response.data.orders;
        //關閉頁面整理動畫
        // vm.orders = response.data.orders;(在找到如何新增訂單前先用預設的)
        vm.pagination = response.data.pagination;
    });
        },
        openModal(isNew, item){
            
            //利用Methods方式開啟Modal，確保在created後才能使用
            if(isNew){
                this.tempProduct={};
                this.isNew=true;
            }else{
                this.tempProduct= Object.assign({}, item);
                //為了避免item傳參考temProduct的值，利用ES6函式Object重組物件
                this.isNew=false;
            }
            $('#productModal').modal('show');
        },
        updateOrders(){
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order`;
            let httpMethod = 'post';
            //傳入isNew，判斷是否為編輯或新增(編輯方式為'put')
           if(!vm.isNew){
            api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order/${vm.tempProduct.id}`;
            httpMethod = 'put';
           }
        
        console.log(process.env.APIPATH,process.env.CUSTOMPATH)
        this.$http[httpMethod](api, {orders:[...vm.tempProduct]}).then(response =>{
            if(response.data.success){
                $('#productModal').modal('hide');
                vm.getOrders();
            }else{
                $('#productModal').modal('hide');
                console.log('新增失敗')
            }

    });
        },



},
    created(){
        this.getOrders();
        
    },
}
</script>
<template>
    <div>
        <loading :active.sync="isLoading" >
        </loading>
        <div class="text-right">
            <button class="btn  btn-primary mt-3"  @click="openModal(true)">建立優惠券</button>
        </div>
      <table class="table mt-4">
            <thead>
                <tr>
                    <th >名稱</th>
                    <th width="100">折扣百分比</th>
                    <th width="120">到期日</th>
                    <th width="80">是否啟用</th>
                    <th width="130" class="text-center">編輯</th>
                </tr>
            </thead>
                <tbody>
                    <tr v-for="(item, key) in coupons" :key="key">
                        <td>{{ item.title }}</td>
                        <td>{{ item.percent }}%</td>
                        <td>{{ item.due_date  | date}}</td>
                        <td>
                          <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
                          <span v-else class="text-muted">未啟用</span>
                        </td>
                            <td class="text-right">
                            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                            <button class="btn btn-danger btn-sm" @click="deleteProduct(item)">刪除</button>
                            
                        </td>
                        </tr>
                </tbody>
      </table>
            <Pg :pages="pagination" @turnPage='getCoupons'></Pg>

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

          <div class="col-sm">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title"
              v-model="tempCoupon.title"
                placeholder="請輸入標題">
            </div>

            <div class="form-row">
              <div class="form-group col-md">
                <label for="category">優惠碼</label>
                <input type="text" class="form-control" id="category"
                v-model="tempCoupon.code"
                  placeholder="請輸入分類">
              </div>

            </div>

            <div class="form-row">
              <div class="form-group col-md">
              <label for="origin_price">到期日</label>
                <input type="date" class="form-control" id="origin_price"
                v-model="timestamp">
              </div>
            </div>
              <div class="form-row">
              <div class="form-group col-md">
              <label for="origin_price">折扣百分比</label>
                <input type="number" class="form-control" id="origin_price"
                v-model="tempCoupon.percent"
                  placeholder="請輸入百分比">
              </div>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                v-model="tempCoupon.is_enabled"
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
        <button type="button" class="btn btn-primary" @click="updateCoupons">確認</button>
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
        是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
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
            coupons: [],
            pagination:{},
            tempCoupon:[],
            isNew:false,
            isLoading:false,
            timestamp:'',
        };
    },
    methods: {
    //       due_date() {
    //   const vm = this;
    //   const timestamp = Math.floor(new Date(vm.due_date) / 1000);
    //   vm.tempCoupon.due_date = timestamp;
    // },
        getCoupons(page = 1){
    const vm = this;
    const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
    vm.isLoading = true;
    //開始頁面整理動畫
    this.$http.get(api).then(response =>{
        console.log(response.data);
        vm.isLoading = false;
        //關閉頁面整理動畫
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
        console.log(vm.coupons)
    });
        },
        openModal(isNew, item){
            
            //利用Methods方式開啟Modal，確保在created後才能使用
            if(isNew){
                this.tempCoupon={};
                this.isNew=true;
            }else{
                this.tempCoupon= Object.assign({}, item);
                //為了避免item傳參考temProduct的值，利用ES6函式Object重組物件
                this.isNew=false;
            }
            $('#productModal').modal('show');
        },
        updateCoupons(){
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
            let httpMethod = 'post';
            //傳入isNew，判斷是否為編輯或新增(編輯方式為'put')
           if(!vm.isNew){
            api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
            httpMethod = 'put';
           }
        
            console.log(api)
            vm.tempCoupon.due_date = Math.floor(new Date(vm.timestamp) / 1000);
            console.log(vm.tempCoupon.due_date)
            this.$http[httpMethod](api, {data:vm.tempCoupon}).then(response =>{
            if(response.data.success){
                $('#productModal').modal('hide');
                vm.getCoupons();
            }else{
                $('#productModal').modal('hide');
                console.log('新增失敗')
            }

    });
        },
        deleteProduct(item){
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${item.id}`;
            this.$http.delete(api).then(response =>{
          if(response.data.success){
                vm.getCoupons();
            }else{
                console.log('刪除失敗')
            }
    
            });
       },
},
    created(){
        this.getCoupons();
        
    },
}
</script>
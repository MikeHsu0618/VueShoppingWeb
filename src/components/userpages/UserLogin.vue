<template>
    <div>
        <section class="container px-0 px-md-3 my-md-6">
  <div class="row no-gutters justify-content-center">
    <div class="col-md-10">
      <div class="p-5 bg-primary d-md-none">
        <h1 class="mt-2 mb-2 text-center text-white">會員登入</h1>
      </div>
      <div class="row no-gutters flex-md-row-reverse">
        <div class="col-md-6 py-md-3">
          <div class="bg-primary-lighter p-5">
            <h2 class="h4 text-center text-primary-light mb-5 d-none d-md-block">—— 連結社群帳號 ——</h2>
            <div class="row no-gutters">
              <div class="col-4 col-md-12 mb-md-4">
                <button class="btn btn-brand-light btn-block btn-lg py-3 h-100">
                  <img src="@/assets/images/ic-facebook-logotype.svg" class="img-fluid" width="108" alt="">
                </button>
              </div>
              <div class="col-4 col-md-12 mb-md-4">
                <button class="btn btn-brand-light btn-block btn-lg py-3 h-100">
                  <img src="@/assets/images/ic-google.svg" class="img-fluid" width="94" alt="">
                </button>
              </div>
              <div class="col-4 col-md-12 mb-md-4">
                <button class="btn btn-brand-light btn-block btn-lg py-3 h-100">
                  <img src="@/assets/images/ic-yahoo.svg" class="img-fluid" width="97" alt="">
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-5 bg-primary d-md-block d-none">
            <h1 class="mt-2 mb-2 text-center text-white">會員登入</h1>
          </div>
          <div class="p-5 pt-md-0 bg-primary">
            <div class="form-square form-square-withicon d-flex justify-content-between mb-3">
              <label for="username" class="material-icons form-square-icon-left">
                person
              </label>
              <input type="text" id="username" class="form-input w-100" placeholder="電子信箱/手機號碼">
              <!-- 注意：電子信箱/手機號碼 所以 type 要用 text -->
            </div>
            <div class="form-square form-square-withicon d-flex justify-content-between mb-3">
              <label for="password" class="material-icons form-square-icon-left">
                vpn_key
              </label>
              <input type="password" id="password" class="form-input w-100" placeholder="請輸入使用者密碼">
              <!-- 注意：電子信箱/手機號碼 所以 type 要用 text -->
            </div>
            <div class="custom-control custom-checkbox mb-0">
              <input type="checkbox" class="custom-control-input" id="rememberme">
              <label class="custom-control-label text-white" for="rememberme">記住我</label>
            </div>
          </div>
          <button class="btn btn-accent btn-block rounded-0 btn-lg py-3 text-primary">登入帳號</button>
          <router-link to="/login">
           <button class="btn btn-accent btn-block rounded-0 btn-lg py-3 text-white bg-primary">切換到管理者</button>
          </router-link>
          
        </div>

      </div>
    </div>
  </div>
</section>
    </div>
</template>

<script>

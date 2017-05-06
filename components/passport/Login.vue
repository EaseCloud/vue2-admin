<template>
  <div class="ant-card ant-card-bordered block-login"
       style="width: 600px; margin: 0 auto;">
    <div class="ant-card-body">
      <header class="page-header">
        <h1 class="page-title">{{config.platform_name}}管理后台</h1>
      </header>
      <div class="form-wrapper">
        <div class="ant-form ant-form-horizontal">
          <div class="ant-row ant-form-item">
            <div class="ant-col-6 ant-form-item-label">
              <label>登录名</label>
            </div>
            <div class="ant-col-14">
              <div class="ant-form-item-control">
                <div class="ant-input-wrapper">
                  <input type="text" placeholder="用户名"
                         @keypress.enter="submit"
                         v-model="username"
                         class="ant-input ant-input-lg" title/>
                </div>
              </div>
            </div>
          </div>
          <div class="ant-row ant-form-item">
            <div class="ant-col-6 ant-form-item-label">
              <label>密码</label>
            </div>
            <div class="ant-col-14">
              <div class="ant-form-item-control">
                <div class="ant-input-wrapper">
                  <input type="password" placeholder="密码"
                         @keypress.enter="submit"
                         v-model="password"
                         class="ant-input ant-input-lg" title/>
                </div>
              </div>
            </div>
          </div>
          <div class="ant-row ant-form-item">
            <div class="ant-col-14 ant-col-offset-6">
              <div class="ant-form-item-control">
                <div class="ant-input-wrapper">
                  <button class="ant-btn ant-btn-primary ant-btn-lg"
                          type="submit" @click="submit">登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      submit() {
        const vm = this;
        if(vm.config.action_login) {
          return vm.config.action_login(vm.username, vm.password);
        }
        return vm.login(vm.username, vm.password).then(user => {
          if (!user.is_staff) {
            vm.notify('用户不具备管理员权限');
          } else {
            vm.$router.push({ name: 'main' });
          }
        });
      },
    },
  };
</script>


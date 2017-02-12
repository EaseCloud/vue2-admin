<template>

  <div>
    <header class="page-header">
      <h3 class="page-header-title">修改密码</h3>
      <h4 class="page-header-subtitle">修改当前用户的密码</h4>
      <div class="tooltips">
        <!--<v-button v-if="me.is_superuser" type="dashed"-->
                  <!--v-link="{query: {load_menu:1}}">重新加载菜单-->
        <!--</v-button>-->
      </div>
    </header>

    <div class="page-body">
      <div class="one-col-form ant-form ant-form-horizontal">
        <div class="ant-row ant-form-item">
          <div class="ant-col-6 ant-form-item-label">
            <label>旧密码</label>
          </div>
          <div class="ant-col-14 ant-form-item-control">
            <input class="ant-input" title
                   @keypress.enter="submit"
                   type="password" v-model="old_password"/>
          </div>
        </div>
        <div class="ant-row ant-form-item">
          <div class="ant-col-6 ant-form-item-label">
            <label>新密码</label>
          </div>
          <div class="ant-col-14 ant-form-item-control">
            <input class="ant-input" title
                   @keypress.enter="submit"
                   type="password" v-model="new_password"/>
          </div>
        </div>
        <div class="ant-row ant-form-item">
          <div class="ant-col-6 ant-form-item-label">
            <label>确认新密码</label>
          </div>
          <div class="ant-col-14 ant-form-item-control">
            <input class="ant-input" title
                   @keypress.enter="submit"
                   type="password" v-model="confirm_password"/>
          </div>
        </div>
        <div class="ant-col-16 ant-col-offset-6">
          <div class="ant-form-item-control ">
            <v-button size="large" type="primary"
                      @click="submit">提交
            </v-button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script lang="babel">
  export default {
    route: { canReuse: false },
    data() {
      return {
        model: 'User',
        old_password: '',
        new_password: '',
        confirm_password: '',
      };
    },
    methods: {
      reload() {
      },
      submit() {
        const vm = this;
        if (!vm.new_password) {
          this.notify('新密码不能为空', '操作失败');
        } else if (vm.new_password !== vm.confirm_password) {
          this.notify('两次输入的新密码不同，请重新输入', '操作失败');
        } else if (vm.new_password === vm.old_password) {
          this.notify('新密码与旧密码不能相同', '操作失败');
        } else {
          vm.api().save({
            action: 'change_password',
          }, {
            password_old: vm.old_password,
            password_new: vm.new_password,
          }).then(() => {
            vm.old_password = '';
            vm.new_password = '';
            vm.confirm_password = '';
          });
        }
      },
    },
  };
</script>

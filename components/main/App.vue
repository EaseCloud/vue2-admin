<template>
  <div id="main">
    <header id="masthead" class="clearfix" v-if="me">
      <nav class="nav">
        <ul>
          <template v-for="item in config.tooltip_menus">
            <li>
              <a :href="item.href" target="_blank">{{item.label}}</a>
            </li>
            <li><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span></li>
          </template>
          <li>
            <span class="anticon anticon-user"></span>
            <span>{{me.username}}</span>
          </li>
          <li><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span></li>
          <li>
            <router-link :to="{name: 'main_change_password'}">
              <span class="anticon anticon-unlock"></span>
              修改密码
            </router-link>
          </li>
          <li><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span></li>
          <li>
            <a href="javascript:" @click="logout">
              <span class="anticon anticon-logout"></span>
              退出
            </a>
          </li>
        </ul>
      </nav>
    </header>

    <div v-if="me">

      <sidebar ref="sidebar" :class="{'no-sidebar': $root.hide_sidebar}"></sidebar>

      <a class="btn-toggle-sidebar"
         :class="{'no-sidebar': $root.hide_sidebar}"
         @click="$root.toggleSidebar()"></a>

      <section class="main-container"
               :class="{'no-sidebar': $root.hide_sidebar}">
        <div class="main-container-panel">
          <router-view></router-view>
        </div>
      </section>

    </div>
  </div>
</template>

<script type="text/babel" lang="babel">
  export default{
    methods: {
      reload() {
        const vm = this;
        // 登录判定，没有登录者踢出
        vm.authenticate().then(() => {
          // 已经登陆，如果是直接访问，跳转到功能页
          if (vm.$route.name === 'main') {
            if(vm.config.on_login) {
              vm.config.on_login(vm);
            } else if(vm.config.init_route) {
              vm.$router.push(vm.config.init_route || { name: 'main_user_list' });
            } else {
              vm.notify('请在配置中配置 on_login(vm) 事件 或 init_route 初始路由');
            }
          }
        }, () => {
          // 尚未登录，跳转回登录页面
          vm.$router.push({ name: 'passport_login' });
        });
      },
    },
  };
</script>


<template>
  <aside id="sidebar" class="aside-container">
    <h1 class="site-title">{{config.platform_name}}管理后台{{config.version}}</h1>
    <ul class="menu">
      <li v-for="menu in menus"
          :class="{collapsed: menu.expanded===false, expanded: menu.expanded}">
        <a href="javascript:" @click="toggle(menu, $event)">
          {{ menu.title }}
          <span class="sub-title">{{ menu.sub_title }}</span>
          <span class="tip anticon anticon-down" v-if="menu.expanded===false"></span>
          <span class="tip anticon anticon-up" v-if="menu.expanded===true"></span>
        </a>
        <ul class="submenu" v-if="menu.sub_menus">
          <li v-for="submenu in menu.sub_menus"
              :class="{'type-divider': submenu.divider_title}">
            <template v-if="submenu.divider_title">
              {{ submenu.divider_title }}
            </template>
            <router-link :to="submenu.link" v-else
                         :class="{active: submenu.link.name===$route.name}">
              {{ submenu.title }}
              <span class="sub-title">{{ submenu.sub_title }}</span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script lang="babel">
  import menus from '../../../config/menus';

  export default {
    data() {
      return {
        menus,
      };
    },
    methods: {
      toggle(menu, event) {
        const vm = this;
        // 如果有链接直接跳转
        if (menu.link) {
          vm.$router.push(menu.link);
          return;
        }
        // 不能展开就忽略操作
        if (!('expanded' in menu)) return;
        // 折叠其他所有的
        vm.menus.forEach(m => {
          if (m !== menu) m.expanded = false;
        });
        menu.expanded = !menu.expanded;
        if (event) event.preventDefault();
      },
    },
    mounted() {
      // 启动的时候展开当前的菜单
      const vm = this;
      vm.menus.forEach(menu => {
        if (menu.link && menu.link.name === vm.$route.name) {
          vm.toggle(menu);
          return;
        }
        menu.sub_menus.forEach(submenu => {
          if (submenu.link && submenu.link.name === vm.$route.name) {
            vm.toggle(menu);
          }
        });
      });
    },
  };
</script>


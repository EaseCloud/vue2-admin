<template>
  <div id="sidebar" class="aside-container">
    <h1 class="site-title">{{config.platform_name}} {{config.version}}</h1>
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
  </div>
</template>

<script type="text/babel">
  import menus from '../../../config/menus';
  import api from '../../resource/api';

  export default {
    data() {
      return {
        menus: [],
      };
    },
    methods: {
      reload() {
        const vm = this;
        const config = vm.config;
        let promiseLoadMenus = Promise.resolve(menus);
        // 默认情况下在 config.menus 下面配置菜单列表
        if (config.dynamic_menus) {
          const menuConfig = {
            model: 'Menu',
            action: 'get_user_menu',
          };
          if (typeof config.dynamic_menus === 'function') {
            // 如果指定了自行计算 menu 的处理函数，直接使用处理结果
            // 代入 menus
            config.dynamic_menus.apply(vm, []).then(menus => {
              vm.menus = menus;
            });
            return;
          } else if (typeof config.dynamic_menus === 'object') {
            // 否则如果指定了其他的菜单获取 model，异步获取菜单
            if (!config.dynamic_menus.model) {
              console.warn(
                '请在 config 下配置 dynamic_menus.model，缺省为 Menu'
              );
            } else {
              menuConfig.model = config.dynamic_menus.model;
            }
            if (!config.dynamic_menus.action) {
              console.warn(
                '请在 config 下配置 dynamic_menus.action，缺省为 get_user_menu'
              );
            } else {
              menuConfig.action = config.dynamic_menus.action;
            }
          }
          promiseLoadMenus = api(menuConfig.model).get({
            action: menuConfig.action,
            project: config.project || '',
          }).then(resp => {
            return resp.data;
          });
        }
        promiseLoadMenus.then(menus => {
          let anyExpanded = false;
          menus.forEach(menu => {
            if (menu.sub_menus && menu.sub_menus.length) {
              menu.expanded = false;
              if (!anyExpanded) {
                menu.sub_menus.forEach(subMenu => {
                  if (subMenu.link && subMenu.link.name === vm.$route.name) {
                    menu.expanded = true;
                    anyExpanded = true;
                  }
                });
              }
            }
          });
          vm.menus = menus;
        });
      },
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
          if (m !== menu && ('expanded' in menu)) m.expanded = false;
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


<template>
  <aside id="sidebar" class="aside-container">
    <h1 class="site-title">地主淘管理后台</h1>
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
  export default {
    data() {
      return {
        menus: [{
          title: '客户管理',
          expanded: false,
          sub_menus: [
            { title: '客户列表', link: { name: 'main_customer_list' } },
            { title: '实名认证', link: { name: 'main_personal_validation_list' } },
          ],
        }, {
          title: '商户管理',
          expanded: false,
          sub_menus: [
            { title: '店铺管理', link: { name: 'main_shop_list' } },
            { title: '工商认证', link: { name: 'main_institution_validation_list' } },
            { title: '门店认证', link: { name: 'main_entity_store_validation_list' } },
            { title: '举报管理', link: { name: 'main_inform_list' } },
          ],
        }, {
          title: '商品管理',
          expanded: false,
          sub_menus: [
            { title: '商品列表', link: { name: 'main_goods_list' } },
          ],
        }, {
          title: '订单管理',
          expanded: false,
          sub_menus: [
            { title: '订单列表', link: { name: 'main_order_list' } },
            { title: '评价列表', link: { name: 'main_order_comment_list' } },
            { title: '退款管理', link: { name: 'main_refund_list' } },
          ],
        }, {
          title: '财务管理',
          expanded: false,
          sub_menus: [
            { title: '提现管理', link: { name: 'main_withdraw_list' } },
            { title: '财务流水', link: { name: 'main_transaction_list' } },
          ],
        }, {
          title: '需求管理',
          expanded: false,
          sub_menus: [
            { title: '需求管理', link: { name: 'main_demand_list' } },
            { title: '红包记录', link: { name: 'main_leaflet_list' } },
          ],
        }, {
          title: '社区管理',
          expanded: false,
          sub_menus: [
            { title: '紧急救助', link: { name: 'main_urgency_list' } },
            { title: '社区公告', link: { name: 'main_social_article_list' } },
          ],
        }, {
          title: '广告管理',
          expanded: false,
          sub_menus: [
            { title: '广告位管理', link: { name: 'main_advert_list' } },
            { title: '广告列表', link: { name: 'main_advert_list' } },
            { title: '广告设置', link: { name: 'main_advert_settings' } },
          ],
        }, {
          title: '积分管理',
          expanded: false,
          sub_menus: [
            { title: '集团管理', link: { name: 'main_credit_group_list' } },
            { title: '积分流水', link: { name: 'main_credit_transaction_list' } },
          ],
        }, {
          title: '文章管理',
          expanded: false,
          sub_menus: [
            { title: '文章管理', link: { name: 'main_article_list' } },
//            { title: '反馈管理', link: { name: 'main_feedback_list' } },
          ],
        }, {
          title: '系统管理',
          expanded: false,
          sub_menus: [
//            { title: '操作员管理', link: { name: 'main_user_list' } },
            { title: '系统设置', link: { name: 'main_admin_settings' } },
            { title: '修改密码', link: { name: 'main_change_password' } },
//            { title: '权限管理', link: { name: 'main_group_list' } },
          ],
//        }, {
//          title: '仲裁管理',
//          expanded: false,
//          sub_menus: [
//            { title: '仲裁列表', link: { name: 'main_appeal_list' } },
//          ],
        }],
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


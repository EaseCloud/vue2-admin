/* 侧栏菜单样例，支持二级菜单 */

export default [{
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
    { title: '商品管理', link: { name: 'main_goods_list' } },
  ],
}];

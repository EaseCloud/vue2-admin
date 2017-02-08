/* eslint-disable */

export default [
  // 对应 menus.js 中的客户管理
  { path: '/customer', name: 'main_customer_list', component: require('./main/CustomerList.vue') },
  { path: '/customer/:id', name: 'main_customer_edit', component: require('./main/CustomerEdit.vue') },
  { path: '/personal/validation/', name: 'main_personal_validation_list', component: require('./main/PersonalValidationList.vue') },
  { path: '/personal/validation/:id', name: 'main_personal_validation_edit', component: require('./main/PersonalValidationEdit.vue') },
  // 对应 menus.js 中的商户管理
  { path: '/shop', name: 'main_shop_list', component: require('./main/ShopList.vue') },
  { path: '/shop/:id', name: 'main_shop_edit', component: require('./main/ShopEdit.vue') },
  { path: '/goods', name: 'main_goods_list', component: require('./main/GoodsList.vue') },
  { path: '/goods/:id', name: 'main_goods_edit', component: require('./main/GoodsEdit.vue') },
];

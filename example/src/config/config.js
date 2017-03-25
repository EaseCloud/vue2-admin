/* 程序配置 */
export default {
  // API Root，指定后台地址
  api_root: (process.env.NODE_ENV === 'production') ? '/api' : 'http://127.0.0.1:8000/api',
  // 平台名称
  platform_name: '地主淘',
  // 版本号
  version: 'v0.1',
  // 初始路由
  init_route: { name: 'main_user_list' },
  // 右上角的按钮链接
  tooltip_menus: [
    // { label: '原型', href: 'http://example.com/prototype/' },
  ],
  // 权限菜单配置
  dynamic_menus: false,
  // dynamic_menus: {
  //   model: 'Menu',
  //   action: 'get_user_menu',
  // }
};


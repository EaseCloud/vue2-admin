/* 程序配置 */
export default {
  // 平台标识符，暂用于区分菜单
  project: 'myproject',
  // API Root，指定后台地址
  api_root: (process.env.NODE_ENV === 'production') ? '/api' : 'http://127.0.0.1:8000/api',
  // API 格式，串接在 VueResource 字符串后面的格式
  api_format: '{/id}{/action}/',
  api: {
    site_a: 'http://a.example.com/api',
    site_b: 'http://b.example.com/api',
    site_c: 'http://c.example.com/api',
  },
  // 平台名称
  platform_name: 'Vue2 Admin',
  // 版本号
  version: '1.0',
  // 初始路由
  init_route: { name: 'main_user_list' },
  // 右上角的按钮链接
  tooltip_menus: [
    // { label: '原型', href: 'http://example.com/prototype/' },
  ],
  // 是否传送跨域 cookie
  cross_origin: true,
  // 权限菜单配置
  dynamic_menus: false,
  // dynamic_menus: {
  //   model: 'Menu',
  //   action: 'get_user_menu',
  // }
  // Faking user
  // current_user: {
  //   id: 0,
  //   username: 'root',
  //   is_staff: true,
  //   // is_superuser: true,
  //   is_active: true,
  // },
};


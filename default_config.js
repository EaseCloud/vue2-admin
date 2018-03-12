/* 程序配置 */

export default {
  // 平台标识符，暂用于区分菜单
  project: 'vue2-admin',
  // API Root，指定后台地址
  api_root: (process.env.NODE_ENV === 'production') ? '/bowei/api' : '/api',
  // 多套 API
  // api: {
  //   site_a: 'http://a.example.com/api',
  //   site_b: 'http://b.example.com/api',
  //   site_c: 'http://c.example.com/api'
  // },
  // API 格式，串接在 VueResource 字符串后面的格式
  api_format: '{/id}{/action}/',
  // api model 是否自动调整 (underscore: 自动将驼峰转换为下划线格式; off: 不自动转换)
  // 缺省 underscore
  api_model_adjust: 'underscore',
  // 提交表单类型
  api_media_type: 'multipart',
  // 平台名称
  platform_name: '博威智慧社区WEB端后台',
  // 版本号
  version: '1.0',
  // // 初始路由
  init_route: { name: 'main_plot_list' },
  // // 初始登录的处理 function(vm)
  // on_login (vm) {
  //   vm.$router.replace(this.init_route)
  // },
  // 右上角的按钮链接
  tooltip_menus: [
    // { label: '原型', href: 'http://example.com/prototype/' },
  ],
  // 是否传送跨域 cookie
  cross_origin: true,
  // 权限菜单配置
  dynamic_menus: false,
  // 是否不加载 Vue Beauty 库
  skip_vue_beauty: false,
  // dynamic_menus: {
  //   model: 'Menu',
  //   action: 'get_user_menu',
  // },
  // // Faking user
  // current_user: {
  //   id: 0,
  //   username: 'root',
  //   is_staff: true,
  //   // is_superuser: true,
  //   is_active: true,
  // },
  extra_routes: [],
  main_routes: [],
  router_filter (routes) {
    return routes
  },
  // 是否显示忘记密码
  show_forgot: false,
  image_src_field: 'image'
}

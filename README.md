Vue2 Admin
==========

本仓库是一个 Vue2 环境下搭建的一套后台管理框架，通过 RESTful (目前仅支持 Django REST Framework) 的后台模式，融合\
Ant Design 的 UI 框架构造的一套强大的数据驱动框架，目前主要依赖如下的架构：

* Vue2 全家桶
* ant-design
* 
* Django
* Django REST Framework


1. Installation - 安装
----------------------

### 1.1. 首先创建一个新的 vue 项目，然后创建 git 仓库

```
vue init webpack myproject
cd myproject
git init
cd src
git submodule add -b master https://github.com/easecloud/vue2-admin.git
cd ..
```

### 1.2. 配置并安装依赖

将下面这段加到项目仓库的 `package.json` 中

```
{
  // ...
  "dependencies": {
    "vue2-admin": "file:src/vue2-admin",
    // ...
  },
  // ...
}
```

### 1.3. 配置初始样例代码程序

然后，将 `src/vue2-admin/example` 下面的文件覆盖到项目目录下：

```
cp -r src/vue2-admin/example/* ./
```

### 1.4. 安装依赖，运行项目

```
# 如果在中国大陆有墙可考虑用 cnpm
npm i
npm run dev
```

2. Config - 配置项
------------------

创建项目后，在 `/src/config/` 目录下有基本的配置项，整个项目级别的配置可以在这里进行配置。

### 2.1. config.js

这个变量输出一个字典，每一个项是一个配置值，可以根据环境变量等动态配置。

config 对象放在了 mixins 的 computed 属性中，因此对于任意的组件对象调用 
`vm.config` 可以获取到 config 对象（vm 就是组件的对象实例，相当于组件内部方法的 this）。

#### 2.1.0. config.project - 项目名称

这里应该是一个符合正则 `[A-Za-z0-9-_]*` 的字符串（建议）。

设定这个名称的作用在于标识每个项目，建议与当前的项目 `package.json` 的名称一致。

这个设定的作用在于，如果同一个套 API 后台对应多个 vue2-admin 前端，

菜单的配置和权限在后台会重叠混淆，这个时候使用 project 配置项可以将其区分。

#### 2.1.1. config.api_root - API 根目录

重要，这个指定了后台 REST API 的根目录，可以使用相对或者绝对路径。

**范例配置：**

```
api_root: (process.env.NODE_ENV === 'production') ? 
  'http://example.com/api' : '/api',
```

如上，在生产环境下，API 的根目录指定为 `http://example.com/api`；

否则，API 根目录使用本域下面的 `/api` 目录作为根目录。

这里需要特殊说明的是，所有 REST 结构的 URL 规范统一使用如下格式：

```
http://example.com/api/{model}{/id}{/action}
```

其中 id 和 action 是可选的，每一个 model 对应一个 VueResource 对象。

我们可以通过组件内部的 `this.api('ModelName')` 来获取这个 VueResource 对象。

其余可以参照 VueResource 的使用。

#### 2.1.2. config.platform_name - 平台名称

相当于项目名称，会显示在登录界面以及管理界面左上角的标题等地方。

#### 2.1.3. config.version

版本号，主要用于显示。

#### 2.1.4. config.init_route - 初始路由

请配置为一个 Vue-Route 配置。

**默认值：** `{ name: 'main_user_list' }`

#### 2.1.5. config.tooltip_menus - 右上角菜单

登录面板之后，右上角（用户名/修改密码/退出）这几个功能按钮的左侧可以自定义配置链接。

每个链接按钮接受一个对象，指定 label 显示标签和 href 跳转链接

**范例配置：**

```
  tooltip_menus: [
    { label: '前台首页', href: 'http://example.com/' },
    { label: '原型', href: 'http://example.com/prototype/' },
    { label: '问题跟踪', href: 'http://example.com/issue/' },
  ],
```

#### 2.1.6. config.dynamic_menus - 菜单权限配置

**默认值：** false

当此选项为 false 的时候，任何用户进入系统都能够看到 `/src/config/menus.js` 定义的所有菜单。

如果定义为 true 或者一个 `{ model: 'Xxx', action: 'xxx_xxx' }` 的对象，
则会根据 api 获取当前用户能够显示的菜单进行部分显示。

**范例配置：**

```
  dynamic_menus: {
    model: 'Menu',
    action: 'get_user_menu',
  },
```

如果设置为 true，则等同于上面的对象配置。

这种情况下，用户登录后，会请求 `${api_root}/menu/get_user_menu` 的地址获取可用菜单。

这个接口返回的菜单列表格式应与 `/src/config/menu.js` 的一致。

关于菜单配置，详见下一节。

### 2.2. 菜单配置

菜单配置设定了左侧

通过编辑 `/src/config/menu.js` 来编辑菜单。

**范例配置：**

```
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
```

如上范例配置，系统支持两级菜单，其中两级菜单项都有 title 属性用于设定菜单的显示文本。

另外，子菜单还应当设置一个 link 属性指定一个 route 对象绑定到具体的控件。

### 2.3. 路由配置

为了使路由配置文件尽量简短，我们将路由配置文件与组件放在同一个目录 `/src/components/routes.js`
下面，并且用一层结构定义，目的是尽量扁平，避免嵌套。

**范例配置：**

``` 
export default [
  { path: '/order_detail', name: 'main_order_detail_list', component: require('./OrderDetailList.vue') },
  { path: '/order_detail/:id', name: 'main_order_detail_edit', component: require('./OrderDetailEdit.vue') },
  // ...
];
```

这里，我们有一个基本的命名映射规则，下面举例说明映射规则：

* 前端/列表路由: name 使用 `main_${model_underscore}_list` 表示；
* 前端/单例路由: name 使用 `main_${model_underscore}_edit`，params 的 id 表示主键，
  id 为 0 表示新建；
* 前端/列表组件: 文件名使用 `ModelCamelcaseList.vue` 表示；
* 前端/单例组件：文件名使用 `ModelCamelcaseEdit.vue` 表示；
* 后台/列表路由URL：使用 `${api_root}/model_underscore/:action` 表示，
  action 指示对所有该模型实例的操作；
* 后台/单例路由URL：使用 `${api_root}/model_underscore/:id/:action` 表示，
  action 指示对单个实例执行相关的动作；
* 后台 view 层类名使用 `ModelCamelcaseViewSet` 命名（Django REST Framework）
* 后台 serializer 层类名使用 `ModelCamelcaseSerializer` 命名（Django REST Framework）
* 后台 model 层类名使用 `ModelCamelcase` 命名（Django）
* 数据库表使用 `${app}_${model_underscore}` 命名

总之，前后台我们以 ModelName 的模型命名为分解，从前后贯穿所有层，以大道统一和默契，
使得程序的理解和表达都能够更为便捷。

### 2.4. 常量选项

我们放了一个常量配置的文件在 `/src/config/choices.js` 中。

这个对象放在了 mixins 的 computed 属性中，可以通过 `vm.chcoices` 取得。

我们可以将一些常量选项放在这里，在组件的 markup 和方法中调用都非常方便。

**样例配置：**

```
export default {
  user_is_active: {
    ALL: '全部',
    True: '未锁定',
    False: '已锁定',
  },
  is_active: {
    ALL: '全部',
    True: '上架',
    False: '下架',
  },
};
```

3. Components - 组件
--------------------

所有的页面组件文件 (ComponentName.vue) 都应当放在 `/src/components` 目录下面，
并且注册对应的路由；对其余组件的组织本框架没有限制和建议，可以完全自由组织。

理论上，组件内的编程可以完全自由组织，但是本框架为组件的编写提供了一系列便利，具体如下：

* 整体按照 AntDesign 组件定义 UI 风格，集成 vue-beauty 作为组件库；
* 对于模型的操作暂时提供了 ListView 和 EditView 两种页面整体架构；
* 提供了各种字段类型的拾取，包括图片、日期、地图位置等；
* 灵活的数据驱动以及多表现形式（弹窗、嵌套、对象拾取）的组合；

### 3.1. Fields - 公共属性/公共数据

#### 3.1.1. vm.me (computed)

#### 3.1.2. vm.choices (computed)

#### 3.1.3. vm.areaData (computed)

#### 3.1.4. vm.config (computed)

#### 3.1.5. vm.model (data)

#### 3.1.6. vm.modelUnderscore (computed)


### 3.2. Methods - 公共方法/接口约定方法

#### 3.2.1. vm.reload() (interface)

#### 3.2.2. vm.api(model=null) (public)

#### 3.2.3. vm.authenticate(reload=false) (public)

#### 3.2.4. vm.login(username, password) (public)

#### 3.2.5. vm.logout() (public)

#### 3.2.6. vm.updateModel() (public)

#### 3.2.7. vm.deleteModel() (public)

#### 3.2.8. vm.getDistrict(adcode=86) (public)

#### 3.2.9. vm.getDistrictNameByCode(adcode) (public)

#### 3.2.10. vm.getDistrictParentCode(adcode) (public)

#### 3.2.10. vm.getUrlFromRoute(route, absolute=true) (public)

#### 3.2.11. vm.trim(str) (public)

#### 3.2.12. vm.toCamel(str) (public)

#### 3.2.13. vm.toDash(str) (public)

#### 3.2.14. vm.toUnderScore(str) (public)

#### 3.2.15. vm.getColValue(col, item) (public)

#### 3.2.16. vm.evaluate(self, field, item) (public)

#### 3.2.17. vm.setQueryKey(key, value) (public)

#### 3.2.18. vm.removeQueryKey(key) (public)


### 3.3. Filters - 公共过滤器

#### 3.3.1. currency(note='￥')


### 3.4. Root App Data - 根组件数据（总线数据）

#### 3.4.1. vm.$root.current_user

TODO: 尚未撰写

#### 3.4.2. vm.$root.loading

TODO: 尚未撰写

#### 3.4.3. vm.$root.pager

TODO: 尚未撰写

### 3.5. Global Components - 公共组件

#### 3.5.1. Antd/vue-beauty 系列组件

#### 3.5.2. Datepicker

#### 3.5.3.


4. Data Driven Pattern - 数据驱动模式
-------------------------------------

### 4.1. 列表数据

### 4.2. 列表字段

### 4.3. 表单数据

### 4.4. 表单字段







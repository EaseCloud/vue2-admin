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

#### 3.2.16. vm.evaluate(self, item, keyStr) (public)

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

#### 4.1.1. ListView 和 ListViewTable 组件

#### 4.1.2. 属性

##### model

##### pk

##### title

##### subtitle

##### options

###### options.can_create

###### options.can_edit

###### options.can_delete

###### options.can_select

###### options.show_pager

###### options.show_actions

##### cols **\[重要]**

##### actions

##### hooks

###### hooks.item_before_render

### 4.2. 列表字段

#### 4.2.1. 对象渲染过程

1. 逐个字段处理 hooks.item_before_render
1. 调用 `getColValue(col, item)`（具体参见 4.2.2 各字段方法的说明）
  * 根据 key 来定位对象属性
  * 将得到的对象属性使用 `col.filter` 过滤
  * 将过滤后的属性使用 `col.mapper` 映射
1. 将 `getColValue(col, item)` 最终的取值根据不同的字段类型渲染到列表元素中

#### 4.2.2. 字段属性定义

##### 【重要】动态求值说明

所有的字段属性都支持动态求值\ *（暂未完全实现）*，也就是说，假设这个属性 `col.prop`
正常使用可能是一个字符串或者字典等类型，
但是我们可以将其设置成一个函数，那么这个属性具体使用的取值就采用 `col.prop(item)` 来使用。

##### col.id （可选)

给这个字段设定一个可选的标识符(id)，目前已实现的作用如下，日后还会扩充：

1. 在 EditView 或者 EmbedForm 中使用 `col.type == list-view` 字段的时候，
   绑定后通过 `vm.fields[i].ref` 即可获取到该内部 ListViewTable 的组件对象。

##### col.display

列的样式，有如下几种选项：

* normal: 正常 `form-horizontal` 布局，列名占 `col-6`，内容占其余的 `col-18`
* full: 列名独立 h 标签占一行（如果列名为空则忽略），内容另开一行，默认占满宽度 `col-24`

##### col.span

列内容的 `v-col` 的宽度比例 span 值，参照 vue-beauty 的 col 组件的 span 属性。

##### col.type

字段的类型，默认为 readonly。

支持的类型请参见 4.2.4 字段类型。

##### col.key

字段的键值，假设在列表中遍历的对象为 item，则实际渲染的值为 vm.getColValue(item)。

**缺省**

实际字段取值时直接返回 item 整个对象。

**取值为字符串**

首先会按照 `.` 字符分割 `col.key` 取值字符串，然后尝试对 item 的嵌套成员取值：

例如：`col.key = 'a.b.c'`

则实际取值为 `item['a']['b']['c']`，如果中途出现取值失败，最终会返回 null。

**取值为函数（动态求值）**

会直接返回 `col.key(item)` 的结果（应当为一个字符串）然后按照字符串的情况执行。

举个例子，列表返回的模型格式如下：

```
{
  id: 32,
  name: '张三',
  user_item: {
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    avatar: {
      id: 66,
      image: 'https://example.com/media/avatar-32.png',
    },
  },
}
```

那么我们设定这样的 col 值就可以输出邮箱（注意 key 的取值）：

```
cols: [
  // ...
  { title: '邮箱', key: 'user_item.email' },
],
```

##### col.description

##### col.mapper

设置一个字典，在 getColValue 的 filter 之后进行查表过滤。

一般用于一些选项的便捷输出，因为后台记录的是选项的值，需要输出选项的显示名称时很好用。

可以设置一个特殊的 `__else__` 映射值，任何未查到的字段输出这个值。

举个例子：

`/src/config/choices.js`

```
export default {
  // ...
  order_status: {
    PENDING: '等待付款',
    PAID: '等待发货',
    DELIVERED: '等待收货',
    COMPLETE: '已完成',
    __else__: '未知状态',
  },
};
```

```
cols: [
  // ...
  { title: '状态', key: 'status', mapper: vm.choices.order_status },
],
```

**支持动态求值：**也可以指定为一个方法，如果指定为方法，则上述查表的字典则使用 `col.mapper(item)` 的返回值。

##### col.title

显示在列表头部的标签名称。

##### col.style

应用在该列主要元素上的样式。

##### col.tdStyle

在该列对应的 `<td>` 元素上应用的样式。

##### col.thStyle

在该列对应的表头 `<th>` 元素上应用的样式。

#### 4.2.3. 字段通用方法

##### col.filtering

##### col.filter

必须为一个

##### col.ordering

接受一个字符串，直接对应 api 调用的 QueryString `?ordering=xxx,xxx`。

后台应按照传入的这个查询，对返回列表进行排序。

按照 Django Rest Framework 惯例，直接开启对应的 OrderingFilter backend 即可直接支持。

```
# =========== REST Framework ==============
REST_FRAMEWORK = {
    # ...
    'DEFAULT_FILTER_BACKENDS': (
        # ...
        'rest_framework.filters.OrderingFilter',
    ),
    # ...
}
```

#### 4.2.4. 字段类型

注意：ListView 默认类型为 label，EditView 默认类型为 input。

##### input \[EditView]

##### label \[ListView/EditView]

直接输出字段内容，html 标签会被自动转移，例如 `<a href="http://somewhere.com">xxx</a>`
会变成文本渲染，而不会渲染成一个链接。

如果需要输出 html 实体，请使用 html 类型输出。

##### (deprecated) readonly \[ListView]

label 的别名，已经废弃，仅 ListView 保留支持，请避免使用。

##### html \[ListView/EditView]

同样直接输出字段内容，但是支持 html 实体输出，暂时不支持组件实体，只支持原生 html 标签。

##### image-text \[ListView]

图文消息，返回先是一段文本，后面是一系列图片，点击图片可以预览。

**选项**

* `key` 这里传入的 key 应当是这样的格式：{text, images}，text 为文本内容对应的字段名称，
  images 为图集内容对应的字段名称，如果是一个字符串，则认为是仅传入 images。

##### link \[ListView]

##### image \[ListView/EditView]

##### switch \[ListView/EditView]

##### number \[EditView]

##### datepicker \[EditView]

##### select (尚未实现) \[EditView]

##### radio \[EditView]

##### radio-button \[EditView]

##### qrcode \[EditView]

##### gellery \[EditView]

##### geo \[EditView]

##### district \[EditView]

##### list-view \[EditView]

##### object \[EditView]

### 4.3. 表单数据

#### 4.3.1. EditView 和 EmbedForm 组件

#### 4.3.2. 属性
### 4.4. 表单字段

## 5. 样例

### 5.1. vm.modalForm()

获取指定格式的表单值

```
vm.modalForm({
  title: '请输入关键词',
  fields: [{
    type: 'text',
    name: 'username',
    label: '登录名',
    value: '',
  }, {
    type: 'password',
    name: 'password',
    label: '密码',
  }, {
    type: 'number',
    name: 'age',
    label: '年龄',
    placeholder: '年龄',
  }, {
    type: 'date',  // datetime 也可以
    name: 'date_created',
    label: '注册时间',
    readonly: true,
  }, {
    type: 'textarea',
    name: 'introduction',
    label: '个人简介',
  }, {
    type: 'district',
    name: 'district_id',
    label: '地区',
  }, {
    type: 'select',
    name: 'agree',
    label: '同意',
    choices: [
      {text: '好', 'yes'},
      {text: '不好', 'no'},
    ]
  }, {
    type: 'multi-select',
    name: 'hobbies',
    label: '同意',
    choices: [
      {text: '好', 'yes'},
      {text: '不好', 'no'},
    ]
  }, {
    type: 'object',
    name: 'district_id',
    label: '推荐人',

  }],
}).then(data => {
  console.log(data);
});
```


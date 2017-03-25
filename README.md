Vue2 Admin
==========

本仓库是一个 Vue2 环境下搭建的一套后台管理框架，通过 RESTful (目前仅支持 Django REST Framework) 的后台模式，融合\
Ant Design 的 UI 框架构造的一套强大的数据驱动框架，目前主要依赖如下的架构：

* Vue2 全家桶
* ant-design
* 
* Django
* Django REST Framework


1. 安装
-------

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

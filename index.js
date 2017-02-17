/** Absolute Imports */
// Ant Design UI - 恶魔模式
import 'antd/dist/antd.less';
// import 'font-awesome/less/font-awesome.less';

import VueRouter from 'vue-router';
// import Deferred from 'es6-deferred';

/** Relative Imports */
import './assets/css/style.less';
// import './lib/vue-beauty/package/style/vue-beauty.min.css';
// import VueAntd from './lib/vue-beauty/vb';

import VueAntd from './lib/vue2-antd';
import VueHtml5Editor from './plugins/vue-html5-editor';
import GeoPicker from './plugins/geo-picker';
import Notifier from './plugins/notifier';
import mixins from './mixins';

// 应用内配置文件
import config from '../config/config';
// Components routes and entrance
import routes from '../components/routes';

export default {
  install(Vue, options = {}) {
    // -------------------------
    // Vue Plugins
    // -------------------------
    Vue.use(VueAntd);
    Vue.use(Notifier);
    Vue.use(GeoPicker);
    Vue.use(VueHtml5Editor, {
      // global component name
      name: 'vue-html5-editor',
      // default en-us, en-us and zh-cn are built-in
      language: 'zh-cn',
      // the modules you don't want
      hiddenModules: [],
      // keep only the modules you want and customize the order.
      // can be used with hiddenModules together
      visibleModules: [
        'text',
        'color',
        'font',
        'align',
        'list',
        'link',
        'unlink',
        'tabulation',
        'image',
        'hr',
//      'eraser',
//      'undo',
//      'full-screen',
//      'info',
      ],
      // extended modules
      modules: {
        // omit,reference to source code of build-in modules
      },
    });

    // -------------------------
    // Vue Mixin
    // -------------------------
    Vue.mixin(mixins);

    // -------------------------
    // Vue resource config
    // -------------------------
    Vue.http.options.root = config.api_root || '/api';
    Vue.http.options.credentials = true;
    Vue.http.options.xhr = { withCredentials: true };

    // -------------------------
    // Vue notify http error
    // -------------------------
    Vue.http.interceptors.push((req, next) => {
      const request = req;
      request.headers = request.headers || {};
      // 对响应结果的业务处理
      next(response => {
        if (window.app && window.app.notify) {
          if (response.data && response.data.msg) {
            // console.log(response);
            if (response.data.ok) {
              window.app.notify(response.data.msg, '接口调用成功');
            } else {
              window.app.notify(response.data.msg, '接口调用失败');
            }
          } else if (response.status >= 400) {
            window.app.notify(response.body, `接口调用失败：${response.status}`);
          }
        }
        return response;
      });
    });

    // ----------------------------
    // Vue http api loading counter
    // ----------------------------
    (() => {
      let counter = 0;
      // Loading 计数器处理
      Vue.http.interceptors.push((request, next) => {
        counter += 1;
        if (window.app && window.app.loading) {
          window.app.loading.counter = counter;
        }
        next(() => {
          counter -= 1;
          if (window.app && window.app.loading) {
            window.app.loading.counter = counter;
          }
        });
      });
    })();

    // -------------------------
    // Vue router config
    // -------------------------

    Vue.use(VueRouter);

    const router = new VueRouter({
      routes: [{
        // 内部指定登录页面
        path: '/passport',
        name: 'passport',
        component: require('./components/passport/App.vue'),  // eslint-disable-line
        children: [{
          path: '/passport/login',
          name: 'passport_login',
          component: require('./components/passport/Login.vue'),  // eslint-disable-line
        }],
      }, {
        path: '/',
        name: 'main',
        component: require('./components/main/App.vue'),  // eslint-disable-line
        children: [{
          path: '/change/password',
          name: 'main_change_password',
          component: require('./components/main/ChangePassword.vue'),  // eslint-disable-line
        }, ...routes],
      }, {
        // 内部指定 404 页面
        path: '*',
        name: 'not_found',
        component: require('./components/NotFound.vue'),  // eslint-disable-line
      }],
    });

    // router.beforeEach((to, from, next) => {
    //   // noReuse 模式，启用组件内参数跳转自动 reload
    //   if (to.name === from.name && window.app) {
    //     const vm = window.app.$router.app;
    //     window.afterRoutePromise = new Deferred();
    //     console.log('dododo');
    //     window.afterRoutePromise.then(() => {
    //       delete window.afterRoutePromise;
    //       console.log('then');
    //       console.log('before-reload', vm);
    //       if (vm.reload) {
    //         console.log('reload', vm);
    //         vm.$nextTick(() => {
    //           vm.reload();
    //         });
    //       }
    //     });
    //   }
    //   next();
    // });

    router.afterEach(route => {
      // 将路由信息分级放置到 body 的 class 里面
      let name = 'app';
      let classNames = 'app';
      if (route.name) {
        route.name.split('_').forEach(str => {
          if (str) {
            name += `-${str}`;
            classNames += ` ${name}`;
          }
        });
      }
      // // 强制启动路由跳转后激活 reload
      // if (window.afterRoutePromise) {
      //   window.afterRoutePromise.resolve();
      // }
      document.body.className = classNames;
      console.log(`>>> ${route.name}`);
    });

    const AppConstructor = Vue.extend(require('./components/App.vue'));  // eslint-disable-line
    window.app = new AppConstructor({ router, el: '#app' });
  },
};


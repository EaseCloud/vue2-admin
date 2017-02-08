import 'font-awesome/less/font-awesome.less';

// Ant Design UI - 恶魔模式
import 'antd/dist/antd.less';

import './assets/css/style.less';

import VueAntd from './lib/vue2-antd';
import VueHtml5Editor from './plugins/vue-html5-editor';
import GeoPicker from './plugins/geo-picker';
import Notifier from './plugins/notifier';
import mixins from './mixins';

// 应用内配置文件
import { API_ROOT } from '../config/config';

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
    Vue.http.options.root = API_ROOT;
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
  },
};

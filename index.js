import 'font-awesome/less/font-awesome.less';

// Ant Design UI - 恶魔模式
import 'antd/dist/antd.less';

import './assets/css/style.less';

import VueAntd from './lib/vue2-antd';
import VueHtml5Editor from './plugins/vue-html5-editor';
import GeoPicker from './plugins/geo-picker';
import Notifier from './plugins/notifier';
import mixins from './mixins';

export default {
  install(Vue, options = {}) {
    // Install mixin.
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
    Vue.mixin(mixins);
  },
};

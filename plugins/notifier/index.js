import Deferred from 'es6-deferred';
import NotifierRegistry from './NotifierRegistry.vue';
import api from '../../resource/api';

export default {
  install(Vue, opts) {
    Vue.mixin({
      components: { NotifierRegistry },
      computed: {
        vmNotifier() {
          return this.$root.$refs.notifier;
        },
      },
      mounted() {
        const vm = this;
        if (vm.$root === vm && vm.$route && !vm.vmNotifier) {
          const msg = '请在路由根的插件内置入 <notifier-registry ref="notifier"/>';
          console.error(msg);
        }
      },
      methods: {
        /**
         * 弹出提示框，类似于 alert，具体参数参照 vue-beauty 文档
         * @link https://fe-driver.github.io/vue-beauty/#!/components/notification
         * @param content
         * @param title
         * @param options:
         *   options.duration: 整数，自动关闭时间，0 为不自动关闭
         *   options.type: 提示类型图标 success/error/info/warning
         *   options.top: 离顶部的高度，默认 24
         */
        notify(content, title = '系统消息', options = {}) {
          this.$notification[options && options.type || 'info']({
            message: title,
            description: content,
            duration: options && options.duration || 4.5,
            top: options && options.top || 24,
          });
          // const vm = this.vmNotifier;
          // const DEFAULTS = {
          //   type: 'info',
          //   duration: 3000,
          // };
          // const item = Object.assign({ title, content }, options, DEFAULTS);
          // vm.itemsNotify.unshift(item);
          // setTimeout(() => {
          //   vm.itemsNotify.shift(item);
          // }, item.duration);
        },
        // dismissNotify(index) {
        //   const vm = this.vmNotifier;
        //   vm.itemsNotify.splice(index, 1);
        // },
        confirm(content, title = '操作确认', options = {}) {
          const vm = this.vmNotifier;
          const DEFAULTS = {
            size: 'md',  // sm/lg/md
          };
          const deferred = new Deferred();
          const item = Object.assign({
            title,
            content,
            deferred,
          }, options, DEFAULTS);
          vm.itemsConfirm.unshift(item);
          return deferred.promise;
        },
        confirmAction(success = true, index = -1, params = {}) {
          const vm = this.vmNotifier;
          const pos = index === -1 ? vm.itemsConfirm.length - 1 : index;
          const item = vm.itemsConfirm[pos];
          vm.itemsConfirm.splice(pos, 1);
          return item.deferred[success ? 'resolve' : 'reject'](params);
        },
        modalForm(form) {
          const vm = this.vmNotifier;
          form.deferred = new Deferred();
          vm.modalFormData = form;
          return form.deferred.promise;
        },
        modalFormAction(success = true) {
          const vm = this.vmNotifier;
          const deferred = vm.modalFormData.deferred;
          const form = {};
          if (success) {
            vm.modalFormData.fields.forEach(item => {
              form[item.name] = item.value;
            });
            if ((vm.modalFormData.validator instanceof Function)
              && !vm.modalFormData.validator(form)) {
              return false;
            }
          }
          vm.modalFormData = null;
          return deferred[success ? 'resolve' : 'reject'](form);
        },
        pickImage() {
          const vm = this.vmNotifier;
          const deferred = new Deferred();
          vm.imagepicker.deferred = deferred;
          vm.$refs.uploader.click();
          return deferred.promise;
        },
        pickImageAction() {
          const vm = this.vmNotifier;
          const deferred = vm.imagepicker.deferred;
          vm.imagepicker.deferred = null;
          const formdata = new FormData();
          const files = vm.$refs.uploader.files;
          if (!files.length) {
            return deferred.reject('尚未选择图片文件');
          }
          formdata.append('image', files[0]);
          return api('Image').save(formdata).then(
            resp => deferred.resolve(resp.data)
          );
        },
      },
    });
  },
};

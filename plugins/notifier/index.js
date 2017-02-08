import Deferred from 'es6-deferred';
import NotifierRegistry from './NotifierRegistry.vue';
import api from '../../resource/api';

export default {
  install(Vue, opts) {
    Vue.mixin({
      components: { NotifierRegistry },
      computed: {
        vmNotifier() {
          return this.$root.$refs.notifier
            || this.$root.$children[0].$refs.notifier;
        },
      },
      mounted() {
        if (this.$root === this && !this.vmNotifier) {
          const msg = '请在路由根的插件内置入 <notifier-registry ref="notifier"/>';
          console.error(msg);
          return false;
        }
      },
      methods: {
        notify(content, title = '系统消息', options = {}) {
          const vm = this.vmNotifier;
          const DEFAULTS = {
            type: 'info',
            duration: 3000,
          };
          const item = Object.assign({ title, content }, options, DEFAULTS);
          vm.itemsNotify.unshift(item);
          setTimeout(() => {
            vm.itemsNotify.shift(item);
          }, item.duration);
        },
        dismissNotify(index) {
          const vm = this.vmNotifier;
          vm.itemsNotify.splice(index, 1);
        },
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

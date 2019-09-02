import Deferred from 'es6-deferred';
import NotifierRegistry from './NotifierRegistry.vue';
import api from '../../resource/api';

export default {
  install (Vue, opts) {
    Vue.mixin({
      components: { NotifierRegistry },
      computed: {
        vmNotifier () {
          return this.$root.$refs.notifier;
        },
      },
      mounted () {
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
         * @param options:2
         *   options.duration: 整数，自动关闭时间，0 为不自动关闭
         *   options.type: 提示类型图标 success/error/info/warning
         *   options.top: 离顶部的高度，默认 24
         */
        notify (content, title = '系统消息', options = {}) {
          this.$notification[options && options.type || 'info']({
            message: title,
            description: content,
            duration: options && options.duration || 4.5,
            top: options && options.top || 24,
          });
        },
        confirm (content, title = '操作确认', options = {}) {
          // const vm = this.$root;
          return new Promise((resolve, reject) => {
            Vue.$modal.confirm({
              title,
              content,
              onOk: resolve,
              onCancel: reject,
            });
          });
        },
        modalForm (form) {
          const vm = this.vmNotifier;
          form.modalType = 'modalForm';
          form.deferred = new Deferred();
          //vm.modalFormData = form;
          vm.modalForms.push(form);
          return form.deferred.promise;
        },
        modalFormAction (form, success = true) {
          const vm = this.vmNotifier;
          const deferred = form.deferred;
          const formData = {};
          if (success) {
            let checkRequiredOk = true;
            let isNumberOk = true;
            form.fields.forEach(field => {
              if (field.type === 'object' && typeof field === 'object') {
                formData[field.name] = field.value[field.options.pk || 'id'];
              } else {
                formData[field.name] = field.value;
              }
              if (field.required && (!formData[field.name] && formData[field.name] !== 0)) {
                vm.$message.warning(`必须填写${field.title || field.label}`);
                checkRequiredOk = false;
              }
              if (field.isDigit && !Number.isInteger(Number(field.value))) {
                vm.$message.warning(`必须填写数字${field.title}`);
                isNumberOk = false;
              }
            });
            if (!checkRequiredOk) return false;
            if (!isNumberOk) return false;
            if ((form.validator instanceof Function)
              && !form.validator(formData)) {
              return false;
            }
          }
          vm.modalForms.splice(vm.modalForms.indexOf(form), 1);
          return deferred[success ? 'resolve' : 'reject'](formData);
        },
        pickObject (field) {
          const vm = this.vmNotifier;
          field.modalType = 'objectPicker';
          field.deferred = new Deferred();
          // 如果 field.multi = true，支持同时返回多个对象 id
          vm.modalForms.push(field);
          return field.deferred;
        },
        pickObjectAction (field, value) {
          const vm = this.vmNotifier;
          vm.modalForms.splice(vm.modalForms.indexOf(field), 1);
          field.value = value;
          field.deferred.resolve(field);
        },
        pickFile () {
          const vm = this.vmNotifier;
          const deferred = new Deferred();
          vm.filepicker.deferred = deferred;
          vm.$refs.uploader_file.click();
          return deferred.promise;
        },
        pickFileAction () {
          const vm = this.vmNotifier;
          const deferred = vm.filepicker.deferred;
          vm.filepicker.deferred = null;
          const files = [...vm.$refs.uploader_file.files];
          vm.$refs.uploader_file.value = null;
          return deferred.resolve(files);
        },
        pickImage () {
          const vm = this.vmNotifier;
          const deferred = new Deferred();
          vm.imagepicker.deferred = deferred;
          vm.$refs.uploader.click();
          return deferred.promise;
        },
        pickImageAction () {
          const vm = this.vmNotifier;
          const deferred = vm.imagepicker.deferred;
          vm.imagepicker.deferred = null;
          const formdata = new FormData();
          const files = [...vm.$refs.uploader.files];
          vm.$refs.uploader.value = null;
          if (!files.length) {
            return deferred.reject('尚未选择图片文件');
          }
          formdata.append('image', files[0], files[0].name);
          return api('Image').save(formdata).then(
            resp => deferred.resolve(resp.data)
          );
        },
        /**
         * 管理员密码验证
         * @param needVerify
         * @returns {*}
         */
        verifyPassword (needVerify = false) {
          const vm = this;
          if (!needVerify) return Promise.resolve();
          return new Promise((resolve, reject) => {
            vm.modalForm({
              title: '请输入管理员密码',
              fields: [{
                type: 'password',
                name: 'password',
                label: '管理员密码',
                value: '',
              }],
              validator (data) {
                if (!data.password.length) {
                  vm.notify('密码不能为空');
                  return false;
                }
                return true;
              },
            }).then(data => {
              vm.api('User').save({
                action: 'verify_password',
              }, {
                password: data.password,
              }).then(() => {
                resolve();
              }, () => {
                reject('密码错误');
              });
            });
          });
        },
      },
    });
  },
};

import ListViewDialog from './ListViewDialog.vue';

export default {
  install(Vue) {
    const ListViewDialogComponent = Vue.extend(ListViewDialog);
    Vue.mixin({
      components: { ListViewDialog },
      computed: {},
      methods: {
        /**
         * 弹出一个列表选择对话框
         * 可以通过选择元素返回一个或多个 id
         */
        showListViewDialog(field) {
          if (!field) return Promise.reject(
            '请传入按照 EmbedForm 规格定义的 object 类型字段定义对象');
          return new Promise((resolve, reject) => {
            const el = document.createElement('div');
            el.innerHTML = `<list-view-dialog
                   :options="options"></list-view-dialog>`;
            this.$root.$el.appendChild(el);
            new ListViewDialogComponent({
              el,
              data: {
                options: field.options,
              },
              methods: {
                /**
                 * 成功回调
                 * @param result: id 值（单个）或者 id 数组
                 */
                submit(result) {
                  // console.log('123');
                  this.$destroy();
                  el.parentElement.removeChild(el);
                  resolve(result);
                },
                cancel() {
                  // debugger;
                  // console.log('12356');
                  this.$destroy();
                  el.parentElement.removeChild(el);
                  reject();
                },
              }
            });
          });
        },
      },
    });
  },
};


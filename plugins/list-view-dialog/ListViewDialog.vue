<template>
  <div class="ant-modal-wrap block-modal-form"
       :class="{invisible: false}">
    <div role="document" class="ant-modal" style="width: 840px;">
      <div class="ant-modal-content">
        <button class="ant-modal-close" @click="cancel">
          <span class="ant-modal-close-x"></span>
        </button>
        <div class="ant-modal-header">
          <div class="ant-modal-title">{{options.title||'查看列表'}}</div>
        </div>
        <div class="ant-modal-body">
          <list-view-table :model="options.model"
                           :pk="options.pk"
                           :cols="options.cols"
                           :options="options"
                           :actions="actions"
                           :pager="pager"
                           :filters="options.filters"
                           ref="table"
          ></list-view-table>
        </div>
        <div class="ant-modal-footer">
          <button type="button"
                  @click="cancel"
                  class="ant-btn">
            <span>取消</span>
          </button>
          <button type="button"
                  @click="submit()"
                  class="ant-btn ant-btn-primary">
            <span>确认</span>
          </button>
        </div>
      </div>
      <div tabindex="0" style="width: 0; height: 0; overflow: hidden;">sentinel</div>
    </div>
  </div>
</template>

<script type="text/babel">
  export default {
    props: {
      options: Object,
    },
    data() {
      const vm = this;
      return {
        actions: [{
          title: '选择',
          action(item) {
            vm.submit(item[vm.options.pk || 'id']);
          },
        }],
        pager: {
          page: 1,
          page_size: 10,
          page_count: 1,
        },
      };
    },
    methods: {
      submit() {
        const vm = this;
//        debugger;
//        console.log('hahaha');
        // 提交多个
//        if (!vm.$refs.table.selectedItems && vm.$refs.table.selectedItems.length) {
//          vm.$message.warning('请至少选择一个元素返回');
//          return;
//        }
        vm.submit(vm.$refs.table.selectedItems);
      },
//      doQuery(query) {
//        const vm = this;
//        if (query.page) {
//          vm.pager.page = query.page;
//        }
//      },
    },
  };
</script>

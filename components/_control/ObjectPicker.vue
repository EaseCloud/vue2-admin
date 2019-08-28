<template>
  <div class="ant-modal-wrap block-modal-form"
       :class="{invisible: false}"
       style="z-index: 1">
    <div role="document" class="ant-modal" style="width: 840px;">
      <div class="ant-modal-content">
        <button class="ant-modal-close" @click="$emit('cancel')">
          <span class="ant-modal-close-x"></span>
        </button>
        <div class="ant-modal-header">
          <div class="ant-modal-title">选取对象</div>
        </div>
        <div class="ant-modal-body">
          <list-view-table :model="options.model"
                           :pk="options.pk"
                           :cols="options.cols"
                           :options="{show_pager: true, can_select: multi, show_actions: !multi}"
                           :actions="actions"
                           :pager="pager"
                           :filters="options.filters"
                           ref="listView"
          ></list-view-table>
        </div>
        <div class="ant-modal-footer">
          <button type="button"
                  @click="$emit('cancel')"
                  class="ant-btn">
            <span>取消</span>
          </button>
          <button type="button"
                  v-if="multi"
                  @click="$emit('input', $refs.listView.selectedItems)"
                  class="ant-btn ant-btn-primary">
            <span>确认</span>
          </button>
        </div>
      </div>
      <div tabindex="0" style="width: 0; height: 0; overflow: hidden;">sentinel</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Object,
    multi: Boolean,
  },
  data () {
    const vm = this;
    return {
      actions: [{
        title: '选择',
        action (item) {
          vm.$emit('input', item[vm.options.pk || 'id']);
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
  },
};
</script>

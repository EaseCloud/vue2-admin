<template>

  <list-view :model="model"
             title="客户管理"
             subtitle="实名认证"
             :options="options"
             :cols="cols"
             :actions="actions"
             ref="view">
  </list-view>

</template>

<script lang="babel">
//  import * as api from '../../resource/api';

  export default {
    data() {
      const vm = this;
      return {
        model: 'PersonalValidation',
        options: {
//          can_create: true,
          can_edit: true,
//          can_delete: true,
        },
        cols: [
          { title: 'ID', key: 'id' },
          { title: '头像', key: 'customer_item.avatar_url', type: 'image', width: 75, height: 75 },
          { title: '昵称', key: 'customer_item.nickname' },
          { title: '姓名', key: 'real_name' },
          { title: '登录账号', key: 'customer_item.user_item.username' },
//          { title: '提交时间', key: 'date_created' },
//          { title: '最近登录', key: 'user_item.last_login' },
//          { title: '可用', key: 'is_active', type: 'switch' },
          { title: '身份证正面', key: 'image_cert_front_item.image', type: 'image', width: 125, height: 75 },
          { title: '身份证背面', key: 'image_cert_back_item.image', type: 'image', width: 125, height: 75 },
          {
            title: '状态',
            key: 'status',
            filter: status => this.choices.validation_status[status],
          },
        ],
        actions: [{
          title: '通过',
          isVisible: item => item.status === 'PENDING',
          buttonClass: 'primary',
          action(item) {
            vm.api().patch({ id: item.id }, { status: 'SUCCESS' }).then(() => {
              vm.notify('审批通过');
              vm.$refs.view.reload();
            });
          },
        }, {
          title: '驳回',
          isVisible: item => item.status === 'PENDING',
          action(item) {
            vm.api().patch({ id: item.id }, { status: 'REJECTED' }).then(() => {
              vm.notify('审批驳回');
              vm.$refs.view.reload();
            });
          },
        }],
      };
    },
    computed: {},
    methods: {},
  };
</script>

<template>

  <edit-view :model="model"
             title="客户管理"
             subtitle="实名认证"
             :fields="fields"
             :options="options"
             :actions="actions"
             ref="view">
  </edit-view>

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
//          can_edit: true,
          can_delete: true,
        },
        fields: [
          { title: 'ID', key: 'id', type: 'label' },
          { title: '创建日期', key: 'date_created', type: 'label' },
          {
            title: '状态',
            key: 'status',
            type: 'radio-button',
            readonly: true,
            choices: vm.$root.choices.validation_status,
          },
          { title: '登录名', key: 'customer_item.user_item.username', type: 'label' },
          { title: '用户昵称', key: 'customer_item.nickname', type: 'label' },
          {
            title: '用户头像',
            type: 'image',
            readonly: true,
            key: {
              read: 'customer_item.avatar_item',
              write: 'customer_item.avatar',
            },
          },
          { title: '真实姓名', key: 'real_name', type: 'label' },
          {
            title: '身份证正面',
            type: 'image',
            readonly: true,
            key: {
              read: 'image_cert_front_item',
              write: 'image_cert_front',
            },
          },
          {
            title: '身份证背面',
            type: 'image',
            readonly: true,
            key: {
              read: 'image_cert_back_item',
              write: 'image_cert_back',
            },
          },
        ],
        actions: [{
          title: '通过',
          buttonClass: 'primary',
          action(item) {
            vm.api().patch({ id: item.id }, { status: 'SUCCESS' }).then(() => {
              vm.notify('审批通过');
              vm.$refs.view.reload();
            });
          },
        }, {
          title: '驳回',
          action(item) {
            vm.api().patch({ id: item.id }, { status: 'REJECTED' }).then(() => {
              vm.notify('审批驳回');
              vm.$refs.view.reload();
            });
          },
        }],
      };
    },
    methods: {},
  };
</script>


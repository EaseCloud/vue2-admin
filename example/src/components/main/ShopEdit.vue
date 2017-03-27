<template>

  <edit-view model="Shop"
             title="编辑店铺"
             pk="user"
             :subtitle="(Number($route.params.id)?'编辑':'创建') + '店铺'"
             :fields="fields"
             :options="options">
  </edit-view>

</template>

<script lang="babel">
  //  import * as api from '../../resource/api';
  // TODO: tags 未处理
  // TODO: 地址未处理

  export default {
    data() {
      return {
        options: {
//          can_create: true,
          can_edit: true,
          can_delete: true,
        },
        fields: [
          { title: 'ID', key: 'user', type: 'label' },
          { title: '创建日期', key: 'date_created', type: 'label' },
          { title: '店铺名称', key: 'name', type: 'input' },
          {
            title: '店主',
            key: 'name',
            type: 'link',
            route: item => ({ name: 'main_customer_edit', params: { id: item.id } }),
            text: item => item.user_item.customer_nickname,
          },
          {
            title: '是否启用',
            key: 'is_active',
            default: true,
            type: 'switch',
          },
          {
            title: '店铺标志',
            type: 'image',
            key: {
              read: 'logo_item',
              write: 'logo',
            },
          },
          {
            title: '地理位置',
            type: 'geo',
          },
          {
            title: '背景图',
            type: 'image',
            key: {
              read: 'background_item',
              write: 'background',
            },
          },
          {
            title: '缩略图',
            type: 'image',
            key: {
              read: 'thumbnail_item',
              write: 'thumbnail',
            },
          },
          { title: '店铺介绍', key: 'description', type: 'input', htmlType: 'textarea' },
        ],
      };
    },
    methods: {},
  };
</script>


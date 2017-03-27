<template>

  <edit-view :model="model"
             title="商品编辑"
             :subtitle="(Number($route.params.id)?'编辑':'创建') + '商品'"
             :fields="fields"
             :options="options">
  </edit-view>

</template>

<script lang="babel">
  //  import * as api from '../../resource/api';

  export default {
    data() {
      return {
        model: 'Goods',
        options: {
          can_create: true,
          can_edit: true,
          can_delete: true,
        },
        fields: [
          { title: 'ID', key: 'id', type: 'label' },
          { title: '创建日期', key: 'date_created', type: 'label' },
          { title: '商品名称', key: 'name', type: 'input' },
          { title: '商品编号', key: 'code', type: 'input' },
          {
            title: '店铺',
            type: 'link',
            route: item => ({ name: 'main_shop_edit', params: { id: item.author } }),
            text: item => item.shop_name,
          },
          {
            title: '店主',
            type: 'link',
            route: item => ({ name: 'main_customer_edit', params: { id: item.author } }),
            text: item => item.customer_name,
          },
          {
            title: '图片',
            type: 'gallery',
            key: {
              read: 'images_item',
              write: 'images',
            },
          },
          {
            title: '价格',
            key: 'price_ref',
            default: 0,
            min: 0,
            max: 1000000,
            type: 'number',
            decimalPlaces: 2,
          },
          {
            title: '是否上架',
            key: 'is_active',
            default: true,
            type: 'switch',
          },
          {
            title: '是否有货',
            key: 'has_stock',
            default: true,
            type: 'switch',
          },
          { title: '商品详情', key: 'description', type: 'input', htmlType: 'textarea' },
          { title: '备注', key: 'remark', type: 'input', htmlType: 'textarea' },
        ],

      };
    },
    methods: {},
  };
</script>

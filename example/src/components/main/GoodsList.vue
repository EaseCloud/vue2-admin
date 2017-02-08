<template>
  <list-view :model="model"
             title="商品管理"
             subtitle="商品列表"
             :options="options"
             :cols="cols">
  </list-view>
</template>

<script lang="babel">
  export default {
    data() {
      return {
        model: 'Goods',
        options: {
          can_create: true,
          can_edit: true,
          can_delete: true,
        },
        cols: [
          { title: 'ID', key: 'id' },
          { title: '店铺LOGO', key: 'thumbnail_url', type: 'image', width: 75, height: 75 },
          { title: '商品名称', key: 'name' },
          {
            title: '店铺名称',
            key: 'name',
            type: 'link',
            route: item => ({ name: 'main_shop_edit', params: { id: item.shop } }),
            text: item => item.shop_name,
          },
          { title: '价格', key: 'price_ref' },
          { title: '创建日期', key: 'date_created' },
          { title: '是否上架', key: 'is_active', type: 'switch' },
        ],
      };
    },
    computed: {},
    methods: {},
  };
</script>

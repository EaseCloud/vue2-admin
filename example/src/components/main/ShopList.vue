<template>

  <list-view :model="model"
             pk="user"
             title="商户管理"
             subtitle="店铺列表"
             :options="options"
             :cols="cols"
             :actions="actions">
  </list-view>

</template>

<script lang="babel">
  export default {
    data() {
      const vm = this;
      return {
        model: 'Shop',
        options: {
//          can_create: true,
          can_edit: true,
          can_delete: true,
        },
        cols: [
          { title: 'ID', key: 'user' },
          { title: 'LOGO', key: 'logo_url', type: 'image', width: 75, height: 75 },
          { title: '店铺名称', key: 'name' },
          { title: '用户昵称', key: 'user_item.customer_nickname' },
          { title: '登录账号', key: 'user_item.username' },
          { title: '注册日期', key: 'date_created', filter: x => x.substr(0, 16) },
          { title: '店铺简介', key: 'description', style: { maxWidth: '300px', whiteSpace: 'pre-wrap' } },
          { title: '是否上架', key: 'is_active', type: 'switch' },
        ],
        actions: [{
          title: item => `商品(${item.goods_count})`,
          action(item) {
            vm.$router.push({ name: 'main_goods_list', query: { shop: item.id } });
          },
        }],
      };
    },
    computed: {},
    methods: {},
  };
</script>

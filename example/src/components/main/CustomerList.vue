<template>

  <list-view :model="model"
             pk="user"
             title="客户管理"
             subtitle="客户列表"
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
        model: 'Customer',
        options: {
          can_create: true,
          can_edit: true,
          can_delete: true,
        },
        cols: [
          { title: 'ID', key: 'user' },
          { title: '头像', key: 'avatar_url', type: 'image', width: 75, height: 75 },
          { title: '姓名', key: 'real_name' },
          { title: '昵称', key: 'nickname' },
          { title: '登录账号', key: 'user_item.username' },
          { title: '注册日期', key: 'date_created', filter: x => x.substr(0, 10) },
          { title: '最近登录', key: 'user_item.last_login', filter: x => x.substr(0, 16) },
          { title: '可用', key: 'is_active', type: 'switch' },
        ],
        actions: [{
          title: item => `订单(${item.order_count})`,
          action(item) {
            vm.$router.push({ name: 'main_order_list', query: { author: item.id } });
          },
        }],
      };
    },
    computed: {},
    methods: {},
  };
</script>


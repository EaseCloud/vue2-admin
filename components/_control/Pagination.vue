<template>
  <ul class="ant-pagination " unselectable="unselectable">
    <li title="Previous Page" class="ant-pagination-prev"
        @click="go(page-1 < 1 ? 1 : page-1)">
      <a class="ant-pagination-item-link"></a>
    </li><li v-for="item in items"
        :class="{
        'ant-pagination-item': !item.length,
        'ant-pagination-item-active': item === page,
        'ant-pagination-jump-prev' : item === '<',
        'ant-pagination-jump-next' : item === '>',
        }"
        @click="go(item)">
      <a>{{item.length ? '' : item}}</a>
    </li><li title="Next Page" class="ant-pagination-next"
        @click="go(page+1 > page_count ? page_count : page+1)">
      <a class="ant-pagination-item-link"></a>
    </li>
  </ul>
</template>

<script type="text/babel">
export default {
  props: {
    page: {
      type: Number,
      default: 1,
    },
    page_count: {
      type: Number,
      default: 1,
    },
    page_size: {
      type: Number,
      default: 10,
    },
    // Deprecated
//      manual: {
//        type: Boolean,
//        default: false,
//      }
  },
  computed: {
//      page() {
//        const vm = this;
//        return Number(vm.$route.query.page || 1);
//      },
    items () {
      const vm = this;
      const items = [];
      for (let i = 1; i <= vm.page_count; i += 1) {
        if (i === 1 || i === vm.page_count || i > vm.page - 3 && i < vm.page + 3) {
          items.push(i);
        } else if (i < vm.page && items[items.length - 1] !== '<') {
          items.push('<');
        } else if (i > vm.page && items[items.length - 1] !== '>') {
          items.push('>');
        }
      }
      return items;
    },
  },
  methods: {
    go (page) {
      if (page === '>' || page === '<') {
        // todo 点击省略号后显示隐藏的页码
        console.log(page);
      } else {
        const vm = this;
        const query = JSON.parse(JSON.stringify(vm.$route.query));
        query.page = page;
        vm.$emit('change', page);
      }
      // Deprecated: maual
      // manual 模式通过捕获 @change 事件自行处理换页
      // 如果没有输入 manual，直接通过 $router 参数跳转进行换页
//        if (!vm.manual) {
//          vm.$router.replace({
//            query,
//            name: vm.$route.name,
//            params: vm.$route.params,
//          });
//          if (vm.$parent.reload) vm.$parent.reload();
//        }
    },
  },
};
</script>

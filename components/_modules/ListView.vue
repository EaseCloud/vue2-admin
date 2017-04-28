<template>

  <div>

    <header class="page-header">
      <h3 class="page-header-title">{{title}}</h3>
      <h4 class="page-header-subtitle">{{subtitle}}</h4>
      <!--<h4 class="page-header-subtitle"-->
      <!--v-if="options.total">(总数：{{total}})</h4>-->
      <div class="tooltips">
        <slot name="actions">
          <!-- TODO: 这部分实现是从 ListViewTable 内部行 actions 复制粘贴出来的，后期考虑合并成一个独立组件 -->
          <template v-for="action in listActions">
            <template v-if="action.isVisible === undefined || !action.isVisible || action.isVisible(item)">
              <!-- htmlType: button (默认) -->
              <v-button
                v-if="(action.htmlType||'button')==='button'"
                :type="action.buttonClass || 'ghost'"
                @click="action.action(selectedItems)">
                {{evaluate(action.title)}}
              </v-button> <!--防止按钮之间粘住-->
              <!-- htmlType: text -->
              <template v-else-if="action.htmlType==='text'">{{evaluate(action.title)}}</template>
              <!-- htmlType: not defined -->
              <template v-else>不支持的 action.htmlType: {{action.htmlType}}</template>
            </template>
          </template>
          <v-button v-if="options.can_download" @click="download">
            导出
          </v-button>
          <v-button v-if="options.can_create"
                    @click="$router.push({name: 'main_'+modelUnderscore+'_edit', params: {id: 0}})">
            新增
          </v-button>
          <v-button type="ghost" @click="$router.back()">返回</v-button>
        </slot>
      </div>
    </header>

    <div class="page-body has-footer">

      <section class="page-content">

        <slot name="before"></slot>

        <list-view-table :model="model"
                         :pk="pk"
                         :cols="cols"
                         :options="options"
                         ref="table"
                         :pager="pager"
                         :actions="actions"
                         :list-actions="listActions"
                         :filters="getFilters"
                         :hooks="hooks"
                         @query="doQuery"></list-view-table>

        <slot name="after"></slot>

      </section>
    </div>

    <footer class="page-footer">
      <pagination @change="$refs.table.pageTo($event)"
                  :page="Number($route.query.page) || 1"
                  :page_count="pager.page_count"
                  :page_size="pager.page_size"/>
    </footer>

    <a class="invisible" ref="download"></a>

  </div>

</template>

<script type="text/babel">
  export default {
    props: {
      title: String,
      subtitle: String,
      model: String,
      pk: {
        type: String,
        default: 'id',
      },
      cols: Array,
      actions: Array,
      listActions: Array,
      options: {
        type: Object,
        default: () => ({}),
      },
      filters: {
        type: Object,
        default: () => ({}),
      },
      hooks: {
        type: Object,
      },
    },
    data() {
      const vm = this;
      return {
        items: [],
        pager: {
          page: Number(vm.$route.query.page) || 1,
          page_size: 10,
          page_count: 0,
        },
      };
    },
    computed: {
      getFilters() {
        const vm = this;
        return {
          ...vm.filters,
          ...vm.$route.query,
        };
      },
      selectedItems() {
        const vm = this;
        return vm.$refs.table.selectedItems;
      },
    },
    methods: {
      reload() {
        const vm = this;
        vm.$refs.table.reload();
      },
      doQuery(query) {
        const vm = this;
        const routeQuery = { ...vm.$route.query };
        Object.keys(query).forEach(key => {
          const value = query[key];
          if (value === null || value === undefined) {
            delete routeQuery[key];
          } else {
            routeQuery[key] = value;
          }
        });
        vm.$router.replace({
          query: routeQuery,
        });
      },
      download() {
        const vm = this;
        const filename = `${vm.subtitle}.csv`;

        function getValue(obj, path) {
          let o = obj;
          path.split('.').forEach(key => {
            if (!o) return;
            o = o[key];
          });
          return (o || '').toString();
        }

        // 密码验证
        vm.verifyPassword(vm.options.download_need_password).then(() => {
//        const promise = data ? Promise.resolve(data) :
//          vm.getDownloadData().then(resp => resp.data.results);
          const promise = vm.getDownloadData().then(resp => resp.data.results);
          promise.then(items => {
            let text = vm.cols.map(x => `"${x.title.replace('"', '""') || ''}"`).join(',');
            items.forEach(item => {
              text += '\n';
              text += vm.cols.map(({ key, title, filter }) => {
                const value = key ? getValue(item, key).replace('"', '""') : '';
                return value ? `"${filter ? filter(value) : value}"` : '';
              }).join(',');
            });
            const el = vm.$refs.download;
            el.download = filename;
            el.href = `data:text/plain,${encodeURIComponent(text)}`;
            el.click();
          });
        }, () => {
        });
      },
      getDownloadData() {
        const vm = this;
        return vm.api(vm.model).get({
          page_size: 1000000,
          ...vm.filters,
        });
      },
    },
  };
</script>


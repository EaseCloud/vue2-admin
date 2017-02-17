<template>

  <div>

    <header class="page-header">
      <h3 class="page-header-title">{{title}}</h3>
      <h4 class="page-header-subtitle">{{subtitle}}</h4>
      <div class="tooltips">
        <slot name="actions">
          <ant-button v-if="options.can_create"
                      :to="{name: 'main_'+modelUnderscore+'_edit', params: {id: 0}}">
            新增
          </ant-button>
          <ant-button type="ghost" @click="$router.back()">返回</ant-button>
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
                         :filters="getFilters"
                         @query="doQuery"></list-view-table>

        <!--<div class="ant-table ant-table-middle">-->
        <!--<table>-->
        <!--<thead class="ant-table-thead">-->
        <!--<tr>-->
        <!--<th v-for="(col, i) in cols" :style="col.thStyle || {}">-->
        <!--&lt;!&ndash; 普通标题以及排序器 &ndash;&gt;-->
        <!--<a v-if="col.ordering" @click="sort(col.ordering)">-->
        <!--{{col.title}}-->
        <!--<span class="anticon anticon-caret-up"-->
        <!--v-if="$route.query.ordering == col.ordering"></span>-->
        <!--<span class="anticon anticon-caret-down"-->
        <!--v-if="$route.query.ordering == '-'+col.ordering"></span>-->
        <!--</a>-->
        <!--<template v-else>{{col.title}}</template>-->
        <!--&lt;!&ndash; 筛选器 &ndash;&gt;-->
        <!--<template v-if="col.filtering">-->
        <!--<div v-if="$route.query[col.filtering.search_field]"-->
        <!--class="ant-tag"-->
        <!--style="font-weight: normal; color: #AAA; background: white;">-->
        <!--<span class="ant-tag-text" @click="callFilter(col)">-->
        <!--{{$route.query[col.filtering.search_field]}}-->
        <!--<i class="anticon anticon-cross"-->
        <!--@click.stop="removeQueryKey(col.filtering.search_field)"></i>-->
        <!--</span>-->
        <!--</div>-->
        <!--<span v-else class="anticon anticon-filter"-->
        <!--@click="callFilter(col)"></span>-->
        <!--</template>-->
        <!--</th>-->
        <!--<th v-if="options.show_actions !== false">操作</th>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--<tbody class="ant-table-tbody">-->
        <!--<tr class="ant-table" v-for="item in items">-->
        <!--<td v-for="(col, i) in cols" :style="col.style || {}">-->
        <!--<template v-if="!col.type || col.type=='readonly'">{{getColValue(col, item)}}</template>-->
        <!--<template v-else-if="col.type=='html'">-->
        <!--<div v-html="getColValue(col, item)"></div>-->
        <!--</template>-->
        <!--<template v-else-if="col.type=='link'">-->
        <!--<router-link :to="col.route(item)"-->
        <!--v-if="col.route && col.route(item)">-->
        <!--{{col.text(item)}}-->
        <!--</router-link>-->
        <!--</template>-->
        <!--<template v-else-if="col.type=='image'">-->
        <!--<img :src="getColValue(col, item)"-->
        <!--:style="col.style || {maxWidth: (col.width||75)+'px', maxHeight: (col.height||75)+'px'}"/>-->
        <!--</template>-->
        <!--<template v-else-if="col.type=='switch'">-->
        <!--<ant-switch v-model="item[col.key]"-->
        <!--@change="updateModel(-->
        <!--model, item[pk], col.key, $event, '', reload)">-->
        <!--<span slot="checked">{{col.checked}}</span>-->
        <!--<span slot="unchecked">{{col.unchecked}}</span>-->
        <!--</ant-switch>-->
        <!--</template>-->
        <!--</td>-->
        <!--&lt;!&ndash; Action Row &ndash;&gt;-->
        <!--<td v-if="options.show_actions !== false">-->
        <!--<slot name="row-action">-->
        <!--<template v-for="action in actions">-->
        <!--<ant-button-->
        <!--v-show="action.isVisible === undefined || !action.isVisible || action.isVisible(item)"-->
        <!--size="small"-->
        <!--:type="action.buttonClass || 'ghost'"-->
        <!--@click="action.action(item)">-->
        <!--{{evaluate(action, 'title', item)}}-->
        <!--</ant-button> &lt;!&ndash;防止按钮之间粘住&ndash;&gt;-->
        <!--</template>-->
        <!--<ant-button v-if="options.can_edit"-->
        <!--size="small" type="ghost"-->
        <!--:to="{name:'main_'+modelUnderscore+'_edit', params: {id: item[pk]}}">-->
        <!--编辑-->
        <!--</ant-button>-->
        <!--<ant-button v-if="options.can_delete"-->
        <!--size="small" type="dashed"-->
        <!--@click="deleteModel(-->
        <!--model, item[pk], '确认删除【'+item.name+'】?', '', reload)">-->
        <!--删除-->
        <!--</ant-button>-->
        <!--</slot>-->
        <!--</td>-->
        <!--</tr>-->
        <!--</tbody>-->
        <!--</table>-->
        <!--</div>-->

        <slot name="after"></slot>

      </section>
    </div>

    <footer class="page-footer">
      <pagination :page_count="pager.page_count"
                  :page_size="pager.page_size"/>
    </footer>

  </div>

</template>

<script lang="babel">
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
      options: {
        type: Object,
        default: () => ({}),
      },
      filters: {
        type: Object,
        default: () => ({}),
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
    },
    methods: {
      reload() {
//        const vm = this;
//        vm.$refs.table.reload();
//        console.log('Reload ListView');

//        // 读取当前分页的所有对象
//        api(vm.model).get({
//          page: vm.$route.query.page || 1,
//          page_size: vm.pager.page_size,
//          ...(vm.filters || {}),
//          ...vm.$route.query,
//        }).then(resp => {
//          vm.items = resp.data.results;
//          vm.pager.page_count = Math.ceil(resp.data.count / vm.pager.page_size - 1e-5);
//        });
      },
//      sort(ordering) {
//        const vm = this;
//        vm.setQueryKey(
//          'ordering',
//          vm.$route.query.ordering === ordering ? `-${ordering}` : ordering,
//        );
//      },
//      callFilter(col) {
//        const vm = this;
//        if ((col.filtering.type || 'keyword') === 'keyword') {
//          vm.modalForm({
//            title: '请输入关键词',
//            fields: [{
//              type: 'text',
//              name: 'keyword',
//              label: col.title,
//              value: vm.$route.query[col.filtering.search_field] || '',
//            }],
//          }).then(data => {
//            vm.setQueryKey(col.filtering.search_field, data.keyword);
//          });
//        }
//      },
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
    },
  };
</script>



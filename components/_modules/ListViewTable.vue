<template>

  <div>

    <div class="ant-table"
         :class="{['ant-table-'+size]: true}">
      <table>
        <thead class="ant-table-thead">
        <tr>
          <th v-for="(col, i) in cols" :style="col.thStyle || {}">
            <!-- 普通标题以及排序器 -->
            <a v-if="col.ordering" @click="sort(col.ordering)">
              {{col.title}}
              <span class="anticon anticon-caret-up"
                    v-if="query.ordering == col.ordering"></span>
              <span class="anticon anticon-caret-down"
                    v-if="query.ordering == '-'+col.ordering"></span>
            </a>
            <template v-else>{{col.title}}</template>
            <!-- 筛选器 -->
            <template v-if="col.filtering">
              <div v-if="query[col.filtering.search_field]"
                   class="ant-tag"
                   style="font-weight: normal; color: #AAA; background: white;">
                  <span class="ant-tag-text" @click="callFilter(col)">
                    {{query[col.filtering.search_field]}}
                    <i class="anticon anticon-cross"
                       @click.stop="doQuery({[col.filtering.search_field]: null})"></i>
                  </span>
              </div>
              <span v-else class="anticon anticon-filter"
                    @click="callFilter(col)"></span>
            </template>
          </th>
          <th v-if="options.show_actions !== false">操作</th>
        </tr>
        </thead>
        <tbody class="ant-table-tbody">
        <tr class="ant-table" v-for="item in items">
          <td v-for="(col, i) in cols" :style="col.style || {}">
            <template v-if="!col.type || col.type=='readonly'">{{getColValue(col, item)}}</template>
            <template v-else-if="col.type=='html'">
              <div v-html="getColValue(col, item)"></div>
            </template>
            <template v-else-if="col.type=='link'">
              <router-link :to="col.route(item)"
                           v-if="col.route && col.route(item)">
                {{col.text(item)}}
              </router-link>
            </template>
            <template v-else-if="col.type=='image'">
              <img :src="getColValue(col, item)"
                   :style="col.style || {maxWidth: (col.width||75)+'px', maxHeight: (col.height||75)+'px'}"/>
            </template>
            <template v-else-if="col.type=='switch'">
              <v-switch v-model="item[col.key]"
                          @change="updateModel(
                            model, item[pk], col.key, $event, '', reload)">
                <span slot="checked">{{col.checked}}</span>
                <span slot="unchecked">{{col.unchecked}}</span>
              </v-switch>
            </template>
          </td>
          <!-- Action Row -->
          <td v-if="options.show_actions !== false">
            <slot name="row-action">
              <template v-for="action in actions">
                <v-button
                  v-show="action.isVisible === undefined || !action.isVisible || action.isVisible(item)"
                  size="small"
                  :type="action.buttonClass || 'ghost'"
                  @click="action.action(item)">
                  {{evaluate(action, 'title', item)}}
                </v-button> <!--防止按钮之间粘住-->
              </template>
              <v-button v-if="options.can_edit"
                          size="small" type="ghost"
                          :to="{name:'main_'+modelUnderscore+'_edit', params: {id: item[pk]}}">
                编辑
              </v-button>
              <v-button v-if="options.can_delete"
                          size="small" type="dashed"
                          @click="deleteModel(
                            model, item[pk], '确认删除【'+item.name+'】?', '', reload)">
                删除
              </v-button>
            </slot>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <pagination v-if="options.show_pager"
                @change="pageTo"
                :page="query.page"
                :page_count="pager.page_count"
                :page_size="pager.page_size"/>

  </div>

</template>

<script lang="babel">
  export default {
    props: {
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
      pager: {
        type: Object,
        default: () => ({ page: 1, page_count: 1, page_size: 10 }),
      },
      filters: {
        type: Object,
        default: () => ({}),
      },
      size: {
        default: 'middle',
        validator(value) {
          return ['large', 'middle', 'small'].indexOf(value) > -1;
        },
      },
    },
    data() {
      const vm = this;
      return {
        items: [],
        query: { ...vm.filters },
      };
    },
    computed: {},
    methods: {
      reload() {
        const vm = this;
        // 读取当前分页的所有对象
        vm.api().get({
          page: vm.pager.page || 1,
          page_size: vm.pager.page_size,
          ...vm.query,
        }).then(resp => {
          vm.items = resp.data.results;
          vm.pager.page_count = Math.ceil(resp.data.count / vm.pager.page_size - 1e-5);
        });
      },
      doQuery(query) {
        const vm = this;
        // 更改本地的查询条件 filter
        Object.keys(query).forEach(key => {
          const value = query[key];
          if (value === null || value === undefined) {
            delete vm.query[key];
          } else {
            vm.query[key] = value;
          }
        });
        // 将查询条件变更通知父组件
        vm.$emit('query', query);
        // 重新查询结果集
        vm.$nextTick(() => {
          vm.reload();
        });
      },
      /**
       * 按照某个字段进行排序
       * @param ordering
       */
      sort(ordering) {
        const vm = this;
        vm.doQuery({
          ordering: vm.query.ordering === ordering ? `-${ordering}` : ordering,
        });
      },
      /**
       * 弹出某个列的过滤器
       * @param col
       */
      callFilter(col) {
        const vm = this;
        // 关键词类型
        if ((col.filtering.type || 'keyword') === 'keyword') {
          vm.modalForm({
            title: '请输入关键词',
            fields: [{
              type: 'text',
              name: 'keyword',
              label: col.title,
              value: vm.query[col.filtering.search_field] || '',
            }],
          }).then(data => {
            vm.doQuery({
              [col.filtering.search_field]: data.keyword,
              page: 1,  // 改变筛选条件，页码归零
            });
          });
        }
      },
      pageTo(page) {
        const vm = this;
        vm.doQuery({ page });
      },
    },
  };
</script>

<style scoped>
  .ant-table-thead:not(:hover) .anticon-filter {
    opacity: 0;
  }
</style>

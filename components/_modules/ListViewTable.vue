<template>

  <div>

    <div class="ant-table"
         :class="{['ant-table-'+size]: true}">
      <table>
        <thead class="ant-table-thead">
        <tr>
          <th v-if="options.can_select">
            <input type="checkbox"
                   :checked="items.filter(x=>x._is_selectable).length === selectedItems.length"
                   @click="checkAll()" />
          </th>
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
              <!-- type: keyword 按照关键词筛选 -->
              <template v-if="(col.filtering.type||'keyword')=='keyword'">
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
              <!-- type: select 按照选项筛选 -->
              <template v-else-if="col.filtering.type=='select'">
                <!-- TODO: v-dropdown 在 vue-beauty 中未实现 -->
                <!--<v-dropdown trigger="click" :options="getColFilteringChoices(col)">-->
                <!--<div v-if="query[col.filtering.search_field]"-->
                <!--class="ant-tag"-->
                <!--style="font-weight: normal; color: #AAA; background: white;">-->
                <!--<span class="ant-tag-text" @click="callFilter(col)">-->
                <!--{{query[col.filtering.search_field]}}-->
                <!--<i class="anticon anticon-cross"-->
                <!--@click.stop="doQuery({[col.filtering.search_field]: null})"></i>-->
                <!--</span>-->
                <!--</div>-->
                <!--<span v-else class="anticon anticon-filter"-->
                <!--@click="callFilter(col)"></span>-->
                <!--</v-dropdown>-->
                <div v-if="query[col.filtering.search_field]"
                     class="ant-tag"
                     style="font-weight: normal; color: #AAA; background: white;">
                                  <span class="ant-tag-text" @click="callFilter(col)">
                     {{col.displayValue}}
                     <i class="anticon anticon-cross"
                        @click.stop="doQuery({[col.filtering.search_field]: null})"></i>
                   </span>
                </div>
                <span v-else class="anticon anticon-bars"
                      @click="callFilter(col)"></span>
              </template>
              <!-- type: date_range 按照日期范围筛选 -->
              <template v-else-if="col.filtering.type=='date_range'">
                <div v-if="query[col.filtering.from_field] || query[col.filtering.to_field]"
                     class="ant-tag"
                     style="font-weight: normal; color: #AAA; background: white;">
                              <span class="ant-tag-text" @click="callFilter(col)">
                     {{query[col.filtering.from_field]}}~{{query[col.filtering.to_field]}}
                     <i class="anticon anticon-cross"
                        @click.stop="doQuery({[col.filtering.from_field]: null, [col.filtering.to_field]: null})"></i>
                   </span>
                </div>
                <span v-else class="anticon anticon-calendar"
                      @click="callFilter(col)"></span>
              </template>
            </template>
          </th>
          <th v-if="options.show_actions !== false">
            操作
            <template v-for="action in listActions" v-if="options.show_list_actions !== false">
              <template v-if="action.isVisible === undefined || !action.isVisible || action.isVisible()">
                <!-- htmlType: button (默认) -->
                <v-button
                  v-if="(action.htmlType||'button')==='button'"
                  size="small"
                  :type="action.buttonClass || 'ghost'"
                  @click="doAction(action.action, [])">
                  {{evaluate(action.title)}}
                </v-button>
                <!-- htmlType: text -->
                <template v-else-if="action.htmlType==='text'">{{evaluate(action.title)}}</template>
                <!-- htmlType: not defined -->
                <template v-else>不支持的 action.htmlType: {{action.htmlType}}</template>
                <span><!--防止按钮之间粘住--></span>
              </template>
            </template>
          </th>
        </tr>
        </thead>
        <tbody class="ant-table-tbody">
        <tr class="ant-table" v-for="item in items">
          <td v-if="options.can_select">
            <input type="checkbox" :value="item[pk]"
                   :disabled="item._is_selectable===false"
                   v-model="selectedItems" />
          </td>
          <td v-for="(col, i) in cols"
              style="white-space: normal; overflow: hidden; position: relative;"
              :style="col.tdStyle || {}">
            <!-- type: default/readonly/label -->
            <template v-if="!col.type || col.type=='readonly' || col.type=='label'">{{getColValue(col, item)}}
            </template>
            <!-- type: html -->
            <template v-else-if="col.type=='html'">
              <div v-html="getColValue(col, item)"></div>
            </template>
            <template v-else-if="col.type=='tag'">
              <v-tag :color="col.color">{{getColValue(col, item)}}</v-tag>
            </template>
            <!-- type: link -->
            <template v-else-if="col.type=='link'">
              <router-link :to="col.route(item)"
                           v-if="col.route && col.route(item)">
                {{col.text(item)}}
              </router-link>
              <template v-else>{{col.text(item)}}</template>
            </template>
            <!-- type: image -->
            <template v-else-if="col.type=='image'">
              <img v-if="getColValue(col, item)"
                   :src="getColValue(col, item)"
                   @mouseover="col.preview && showPreviewImage(getColValue(col, item), $event)"
                   @mouseout="col.preview && showPreviewImage(null, $event)"
                   style="cursor: pointer;"
                   @click="previewImages([getColValue(col, item)])"
                   :style="col.style || {maxWidth: (col.width||75)+'px', maxHeight: (col.height||75)+'px'}" />
              <img v-else src="../../assets/images/no-image.png"
                   style="background: #F4F4F4; cursor: not-allowed; object-fit: contain; -o-object-fit: contain"
                   :style="col.style || {maxWidth: (col.width||75)+'px', maxHeight: (col.height||75)+'px'}" />
            </template>
            <!-- type: image-text -->
            <template v-else-if="col.type=='image-text'">
              <div style="max-width: 100%; overflow: hidden;
                   text-overflow: ellipsis; white-space: pre-line;"
                   v-if="getImageTextColValue(col, item).text">
                {{getImageTextColValue(col, item).text}}
              </div>
              <div class="clearfix">
                <a v-for="(img, i) in getImageTextColValue(col, item).images"
                   style="margin: 8px 8px 0 0; float: left;"
                   @click="previewImages(getImageTextColValue(col, item).images, i)">
                  <img :src="img" :style="{objectFit: 'cover', width: '45px', height: '45px'}" />
                </a>
              </div>
            </template>
            <!-- type: switch -->
            <template v-else-if="col.type=='switch'">
              <v-switch v-model="item[col.key]"
                        :disabled="evaluate(col, item, 'disabled')"
                        @input="updateModel(
                            model, item[pk], col.key, $event, '操作成功', reload)">
                <span slot="checked">{{col.checked}}</span>
                <span slot="unchecked">{{col.unchecked}}</span>
              </v-switch>
            </template>
          </td>
          <!-- Action Row -->
          <td v-if="options.show_actions !== false">
            <slot name="row-action">
              <template v-for="action in actions">
                <template v-if="action.isVisible === undefined || !action.isVisible || action.isVisible(item)">
                  <!-- htmlType: button (默认) -->
                  <v-button
                    v-if="(action.htmlType||'button')==='button'"
                    size="small"
                    :type="action.buttonClass || 'ghost'"
                    @click="doAction(action.action, [item])">
                    {{evaluate(action.title, item)}}
                  </v-button>
                  <!-- htmlType: text -->
                  <template v-else-if="action.htmlType==='text'">{{evaluate(action.title, item)}}</template>
                  <!-- htmlType: not defined -->
                  <template v-else>不支持的 action.htmlType: {{action.htmlType}}</template>
                  <span><!--防止按钮之间粘住--></span>
                </template>
              </template>
              <v-button v-if="options.can_edit"
                        size="small" type="ghost"
                        @click="redirectEdit(item)">
                编辑
              </v-button>
              <v-button v-if="options.can_delete"
                        size="small" type="danger"
                        @click="deleteModel(
                            model, item[pk], '确认删除'+(item.name?'【'+item.name+'】':'这个对象')+'?', '操作成功', afterDelete)">
                删除
              </v-button>
            </slot>
          </td>
        </tr>
        </tbody>
        <tbody class="ant-table-tbody">
        <tr v-if="options.show_total">
          <td>总和</td>
          <td>{{total}}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <pagination v-if="options.show_pager"
                @change="pageTo"
                :page="query.page"
                :page_count="pager.page_count"
                :page_size="pageSize || pager.page_size" />

    <img ref="image_previewer"
         class="image-previewer"
         v-show="preview_image"
         :src="preview_image" />

  </div>

</template>

<script>
import * as apiUtils from '../../resource/utils';

export default {
  props: {
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
    pager: {
      type: Object,
      default: () => ({ page: 1, page_count: 1, page_size: 10 }),
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
    hooks: {
      type: Object,
    },
    size: {
      default: 'middle',
      validator (value) {
        return ['large', 'middle', 'small'].indexOf(value) > -1;
      },
    },
    pageSize: Number,
  },
  data () {
    const vm = this;
    return {
      items: [],
      // 选中的项目列表，主键 pk 的列表
      selectedItems: [],
      query: { ...vm.filters },
      total: 0,
      preview_image: null,
    };
  },
  computed: {},
  methods: {
    reload () {
      const vm = this;
      // 读取当前分页的所有对象
      // 之所以要这样实现而不用 vm.api().get() 方法，是为了避免 query 中含有 params 关键词
      // 影响诸如 {/action}{/id} 这样的 URL 路径
      vm.$http.get(apiUtils.getModelUrlRaw(vm.model), {
        params: {
          page: vm.pager.page || 1,
          page_size: vm.pageSize || vm.pager.page_size,
          ...vm.query,
        },
      }).then(resp => {
        vm.pager.page_count = Math.ceil(resp.data.count / (vm.pageSize || vm.pager.page_size) - 1e-5);
        vm.total = resp.data.count;
        // 处理延迟计算
        const items = resp.data.results;
        // 写入 is_items_selectable
        if (vm.options.is_item_selectable) {
          items.forEach(item => {
            item._is_selectable = vm.options.is_item_selectable(item);
          });
        }
        if (vm.hooks && vm.hooks.item_before_render) {
          const deferredPromises = [];
          for (let i = 0; i < items.length; i += 1) {
            deferredPromises.push(vm.hooks.item_before_render(items[i]).then(item => {
              items[i] = item;
            }));
          }
          Promise.all(deferredPromises).then(() => {
            vm.items = items;
            vm.$emit('loaded');
          });
        } else {
          vm.items = items;
          vm.$emit('loaded');
        }
      });
      vm.selectedItems = [];
    },
    afterDelete () {
      const vm = this;
      if (vm.items.length > 1) {
        vm.reload();
      } else {
        // 删没了的话向前跳一页
        vm.pageTo(Math.max(1, vm.pager.page - 1));
      }
    },
    doQuery (query) {
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
     * col.filtering.type == 'select' 专用
     * 将选项倒腾成 vue-beauty 的 Dropdown.option 接受的格式
     * TODO: vue-beauty 的 dropdown 插件尚未出炉
     */
    getColFilteringChoices (col) {
      const vm = this;
      return Promise.resolve().then(() => {
        if (!(col.filtering && col.filtering.choices)) {
          console.warn('select 筛选用的列没有指定选项：');
          console.log(JSON.parse(JSON.stringify(col)));
        }
        if (col.filtering.choices instanceof Array) {
          return col.filtering.choices;
        } else if (col.filtering.choices instanceof Function) {
          return col.filtering.choices(vm);
        } else {
          // Expected format: {val1: text1, val2, text2}
          return Object.keys(col.filtering.choices).map(key => ({
            value: key,
            text: col.filtering.choices[key],
          }));
        }
      });
    },
    /**
     * 归一化过滤 col.type = image-text 类型的输入
     */
    getImageTextColValue (col, item) {
      const result = {
        text: '',
        images: [],
      };
      const keyText = col.key.text || null;
      const keyImages = col.key.images || col.key || null;
      if (keyText) result.text = this.getProperty(item, keyText);
      if (keyImages) {
        const obj = this.getProperty(item, keyImages);
        const images = obj instanceof Array ? obj : [obj];
        result.images = images.map(img => {
          return typeof img === 'object' ? img.image : img;
        });
      }
      return result;
    },
    /**
     * 按照某个字段进行排序
     * @param ordering
     */
    sort (ordering) {
      const vm = this;
      vm.doQuery({
        ordering: vm.query.ordering === ordering ? `-${ordering}` : ordering,
      });
    },
    /**
     * 弹出某个列的过滤器
     * @param col
     */
    callFilter (col) {
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
      } else if (col.filtering.type === 'select') {
        vm.getColFilteringChoices(col).then(choices => {
          vm.modalForm({
            title: '按类别筛选',
            fields: [{
              type: 'select',
              name: 'value',
              label: '选项',
              value: vm.query[col.filtering.search_field] || '',
              choices,
            }],
          }).then(data => {
            let result = '';
            choices.forEach(choice => {
              if (choice.value === data.value) result = choice.text;
            });
            vm.$set(col, 'displayValue', result);
            vm.doQuery({
              [col.filtering.search_field]: data.value,
              page: 1,  // 改变筛选条件，页码归零
            });
          });
        });
      } else if (col.filtering.type === 'date') {
        vm.$message.warning('尚未实现');
      } else if (col.filtering.type === 'date_range') {
        vm.modalForm({
          title: '选择时间范围',
          fields: [{
            type: 'date_range',
            name: 'range',
            label: '日期范围',
            value: [
              vm.query[col.filtering.from_field],
              vm.query[col.filtering.to_field],
            ],
          }],
        }).then(data => {
          vm.doQuery({
            [col.filtering.from_field]: data.range[0],
            [col.filtering.to_field]: data.range[1],
            page: 1,  // 改变筛选条件，页码归零
          })
        });
      }
    },
    checkAll () {
      const vm = this;
      const items = vm.items.filter(x => x._is_selectable !== false);
      // 全选或者全反选
      if (items.length === vm.selectedItems.length) {
        vm.selectedItems = [];
      } else {
        vm.selectedItems = items.map(item => item[vm.pk]);
      }
    },
    pageTo (page) {
      const vm = this;
      vm.doQuery({ page });
    },
    showPreviewImage (url, e) {
      const vm = this;
      vm.preview_image = url;
      if (!url) return;
      const img = vm.$refs.image_previewer;
      img.onload = () => {
        const left = Math.min(window.innerWidth - img.width, Math.max(0, e.clientX));
        const top = Math.min(window.innerHeight - img.height, Math.max(0, e.clientY));
        img.style.left = `${left}px`;
        img.style.top = `${top}px`;
      };
    },
    redirectEdit (item) {
      const vm = this;
      const route = vm.options.getEditUrl ? vm.options.getEditUrl(item[vm.pk])
        : { name: 'main_' + vm.modelUnderscore + '_edit', params: { id: item[vm.pk] } };
      this.$router.push(route)
    }
  },
};
</script>

<style scoped rel="stylesheet/less" lang="less">
.ant-table-thead {
  .anticon-filter, .anticon-calendar, .anticon-bars {
    cursor: pointer;
    color: #AAA;
    -webkit-transition-duration: 0.3s;
    -moz-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
  }
  &:not(:hover) {
    .anticon-filter, .anticon-calendar, .anticon-bars {
      opacity: 0;
    }
  }
}

.image-previewer {
  position: fixed;
  left: -1000px;
  top: -1000px;
  max-width: 400px;
  max-height: 400px;
  z-index: 10;
}
</style>


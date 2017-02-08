<template>

  <div>

    <header class="page-header">
      <h3 class="page-header-title">{{title}}</h3>
      <h4 class="page-header-subtitle">{{subtitle}}</h4>
      <div class="tooltips">
        <!-- 保存动作 -->
        <template v-if="options.can_edit">
          <ant-button @click="submit(false)">保存并继续编辑</ant-button>
          <ant-button type="primary" @click="submit()">保存</ant-button>
        </template>
        <!-- 动态动作按钮 -->
        <template v-for="action in actions">
          <ant-button
            v-show="!action.isVisible || action.isVisible(item)"
            :type="action.buttonClass || 'ghost'"
            @click="action.action(item)">
            {{action.title}}
          </ant-button> <!--防止按钮之间粘住-->
        </template>
        <!-- 删除动作 -->
        <template v-if="options.can_delete">
          <ant-button type="dashed" v-if="item[pk]"
                      @click="deleteModel(model, item[pk], '确认删除【'+item.name+'】？',
                  '', redirectList)">
            删除
          </ant-button>
        </template>
        <ant-button type="ghost" @click="$router.back()">返回</ant-button>
      </div>
    </header>

    <section class="page-body">
      <slot name="before"></slot>
      <section class="item-form ant-form ant-form-horizontal"
               style="max-width: 800px">
        <embed-form :fields="fields"
                    @update="onUpdate"></embed-form>
      </section>
      <slot name="after"></slot>
    </section>

  </div>

</template>

<script lang="babel">
  import api from '../../resource/api';

  export default {
    props: {
      title: String,
      subtitle: String,
      model: String,  // 主模型
      models: Object,  // 辅助模型列表
      pk: {
        type: String,
        default: 'id',
      },
      fields: Array,
      actions: Array,
      options: {
        type: Object,
        default: {},
      },
    },
    data() {
      const vm = this;
      const defaultItem = {};
      vm.fields.forEach(field => {
        // skip readonly fields
        if (!field.type || field.type === 'label') return;
        // make links
        if (field.type === 'link') return;
        // skip nested fields
        if (/\./.test(field.key)) return;
        // write init field value
        defaultItem[field.key] = field.value || field.default;
      });
      return {
        item: defaultItem,
      };
    },
    methods: {
      reload() {
        const vm = this;
        // 获取主体信息
        if (Number(vm.$route.params.id)) {
          api(vm.model).get({
            id: vm.$route.params.id,
          }).then(resp => {
            vm.item = resp.data;
            vm.render();
          });
        } else {
          vm.render();
        }
      },
      getField(path) {
        let result = this.item;
        if (typeof path !== 'string') return null;
        path.split('.').forEach(key => {
          result = result && result[key] || null;
        });
        return result;
      },
      render() {
        const vm = this;
        // set default value
        vm.fields.forEach(field => {
          let result = null;
          if (field.type === 'geo') {
            result = {
              lat: vm.getField(field.key && field.key.lat || 'geo_lat'),
              lng: vm.getField(field.key && field.key.lng || 'geo_lng'),
              label: vm.getField(field.key && field.key.label || 'geo_label'),
            };
          } else if (field.type === 'image') {
            result = vm.getField(field.key.read);
          } else if (field.type === 'gallery') {
            result = vm.getField(field.key.read);
          } else if (field.type === 'link') {
            // deprecated: textField, routeName, idField
            result = {
              route: field.route instanceof Function && field.route(vm.item)
              || field.route instanceof String && { path: field.route }
              || field.route instanceof Object && field,
              text: field.text instanceof Function && field.text(vm.item)
              || !(field.text instanceof Function) && field.text || '',
            };
          } else {
            result = vm.getField(field.key);
          }
          // default
          if (result === undefined && field.default) {
            result = field.default;
          }
          // mapper
          if (field.mapper) {
            result = field.mapper[result];
          }
          // filter
          if (field.filter) {
            result = field.filter(result);
          }
          // Update
          vm.$set(field, 'value', result);
//          console.log(JSON.parse(JSON.stringify(vm.fields)));
        });
      },
      redirectList() {
        this.$router.push({ name: `main_${this.modelUnderscore}_list` });
      },
      submit(backToList = true) {
        const vm = this;
        const promise = Number(vm.$route.params.id)
          ? api(vm.model).patch({ id: vm.item[vm.pk] }, vm.item)
          : api(vm.model).save({ ...vm.item });
        promise.then(resp => {
          vm.notify('操作成功');
          if (backToList) {
            vm.redirectList();
          } else {
            if (!vm.item[vm.pk]) {
              vm.$router.replace({
                params: { id: resp.data.id },
              });
            }
            vm.reload();
          }
        });
      },
      onUpdate(field) {
        const vm = this;
//        console.log(JSON.parse(JSON.stringify(field)));
        if (field.type === 'geo') {
          vm.item[field.key && field.key.lat || 'geo_lat'] = field.value.lat;
          vm.item[field.key && field.key.lng || 'geo_lng'] = field.value.lng;
          vm.item[field.key && field.key.label || 'geo_label'] = field.value.label;
        } else if (field.type === 'image') {
          vm.item[field.key.write] = field.value && field.value.id;
        } else if (field.type === 'gallery') {
          vm.item[field.key.write] = field.value.map(image => image.id);
        } else {
          vm.item[field.key] = field.value;
        }
      },
    },
  };
</script>


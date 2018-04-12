<template>

  <div>

    <header class="page-header">
      <h3 class="page-header-title">{{title}}</h3>
      <h4 class="page-header-subtitle">{{subtitle}}</h4>
      <slot name="page-header-menu"></slot>
      <div class="tooltips">
        <slot name="menu"></slot>
        <!-- 保存动作 -->
        <template v-if="options.can_edit">
          <v-button @click="save()">保存并继续编辑</v-button>
          <v-button type="primary" @click="submit()">保存</v-button>
        </template>
        <!-- 动态动作按钮 -->
        <template v-for="action in actions">
          <v-button
            v-show="!action.isVisible || action.isVisible(item)"
            :type="action.buttonClass || 'ghost'"
            @click="action.action.apply($parent, [item])">
            {{action.title}}
          </v-button> <!--防止按钮之间粘住-->
        </template>
        <!-- 删除动作 -->
        <template v-if="options.can_delete">
          <v-button type="dashed" v-if="item[pk]"
                    @click="erase()">
            删除
          </v-button>
        </template>
        <v-button type="ghost" @click="back()">返回</v-button>
      </div>
    </header>

    <section class="page-body">
      <slot name="before"></slot>
      <section class="item-form ant-form ant-form-horizontal">
        <embed-form :fields="fields"
                    v-if="initialized"
                    @update="onUpdate"
                    ref="form"></embed-form>
      </section>
      <slot name="after"></slot>
    </section>

  </div>

</template>

<script lang="babel">
  import api from '../../resource/api';

  export default {
    props: {
      id: Number,
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
        default: {
          can_create: true,
          can_edit: true,
          can_delete: true,
          hooks: {
            pre_delete(vm) {
              // 如果返回 false，取消动作
              return true;
            },
            post_delete(vm) {
              // 删除之后执行
            },
            pre_save(vm) {
              // 如果返回 false，取消动作
              return true;
            },
            post_save(vm) {
              // 保存之后执行，如果需要控制保存之后的跳转动作，可以在这里实现
            },
          },
        },
      },
    },
    computed: {
      objectId () {
        const vm = this;
        return vm.id || Number(vm.$route.params.id);
      }
    },
    data() {
      const vm = this;
      const defaultItem = {};
      vm.fields.forEach(field => {
        // write init field value
        if (typeof(field.value) === 'undefined') {
          vm.$set(field, 'value', field.hasOwnProperty('default') ? field.default : null)
        }
//        console.warn(field.key)
        vm.writeField(field, defaultItem)
      });
//      console.warn(defaultItem)
      return {
        initialized: false,
        item: defaultItem,
      };
    },
    methods: {
      reload() {
        const vm = this;
        // 获取主体信息
        if (vm.objectId) {
          return vm.api().get({ id: vm.objectId }).then(resp => {
            if (!resp.data) {
              vm.$message.error('接口没有响应内容')
              return Promise.reject(new Error('响应没有内容'))
            }
            vm.item = (vm.options.hooks && vm.options.hooks.fetch)
              ? vm.options.hooks.fetch(resp.data) : resp.data;
            return vm.render().then(() => {
//              console.log(vm.item)
              vm.$emit('loaded');
            });
          });
        }
//        console.error(vm.item)
//        // 新增的情况自动产生一个默认的 item
//        const item = {};
//        vm.fields.forEach(field => {
//          // 注意主键缺省
//          if (field.hasOwnProperty('key')) {
//            if ((typeof field.key) === 'string' && field.key !== vm.pk) {
//              item[field.key] = field.hasOwnProperty('default') ? field.default : null
//            } else if (field.type === 'gallery') {
//              if (field.key.read) item[field.key.read] = []
//              if (field.key.write) item[field.key.write] = []
//            } else if (field.type === 'image') {
//              if (field.key.read) item[field.key.read] = null
//              if (field.key.write) item[field.key.write] = null
//            }
//          }
//        });
//          console.log(JSON.parse(JSON.stringify(item)));
//        vm.item = item;
        return vm.render();
      },
      setField(key, value) {
        const vm = this;
        vm.waitFor(vm.$refs, 'form').then(form => {
          form.setField(key, value);
        })
      },
      getField(path) {
        let result = this.item;
        if (typeof path !== 'string') return null;
        path.split('.').forEach(key => {
          result = result && result[key];
          if (result === undefined) result = null;
        });
        return result;
      },
      renderField(field) {
        const vm = this;
        // 获取初始值
        let promiseGetResult = null;
        if (field.type === 'geo') {
          promiseGetResult = Promise.resolve({
            lat: vm.getField(field.key && field.key.lat || 'geo_lat'),
            lng: vm.getField(field.key && field.key.lng || 'geo_lng'),
            label: vm.getField(field.key && field.key.label || 'geo_label'),
          });
        } else if (field.type === 'image') {
          promiseGetResult = Promise.resolve(vm.getField(field.key.read));
        } else if (field.type === 'gallery') {
          promiseGetResult = Promise.resolve(vm.getField(field.key.read));
        } else if (field.type === 'link') {
          // deprecated: textField, routeName, idField
          promiseGetResult = Promise.resolve({
            route: field.route instanceof Function && field.route(vm.item)
            || field.route instanceof String && { path: field.route }
            || field.route instanceof Object && field,
            text: field.text instanceof Function && field.text(vm.item)
            || !(field.text instanceof Function) && field.text || '',
          });
        } else if (field.type === 'object') {
          const objectId = vm.getField(field.key);
          promiseGetResult = objectId ?
            vm.api(field.options.model).get({ id: objectId }).then(resp => {
              vm.$set(field, 'object', resp.data)
              return Promise.resolve(objectId)
            }) : Promise.resolve(null);
//        } else if (field.type === 'datepicker') {
//          if (typeof field.value === 'number') {
//            promiseGetResult = Promise.resolve(
//              vm.dateformat(new Date(field.value), "yyyy-mm-dd HH:MM:ss"));
//          } else {
//            promiseGetResult = Promise.resolve(field.value);
//          }
        } else {
          promiseGetResult = Promise.resolve(vm.getField(field.key));
        }
        // 处理原始的字段值
        return promiseGetResult.then(rawResult => {
          let result = rawResult;
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
        });
      },
      render() {
        const vm = this;
        // set default value
        return Promise.all(vm.fields.map(field => {
          vm.$set(field, 'context', { item: vm.item });
          return vm.renderField(field);
        })).then(() => {
          vm.initialized = true;
        });
      },
      redirectList() {
        const vm = this;
        // 检查路由是否存在，如果不存在就 router.back
        try {
          const route = { name: `main_${this.modelUnderscore}_list` };
          // 检查路由是否存在，如果路由不合法，会抛错
          vm.$router.resolve(route);
          this.$router.push(route);
        } catch (e) {
          vm.$router.back();
        }
      },
      validate() {
        const vm = this;
        return new Promise((resolve, reject) => {
          const promises = [];
          vm.fields.some(field => {
            if (field.required && !field.value) {
              reject(`字段【${field.title}】不能为空`);
              return true;
            } else if (field.validator) {
              if (typeof(field.validator) !== 'function') return false;
              const result = field.validator(vm.item);
              if (!result) {
                reject(`字段【${field.title}】校验失败`);
                return true;
              } else if (typeof(result.then) === 'function') {
                promises.push(result.then(
                  () => resolve(),
                  () => reject(`字段【${field.title}】校验失败`),
                ));
                return false;
              }
            }
            return false;
          });
          Promise.all(promises).then(() => resolve(), () => reject());
        });
      },
      save() {
        const vm = this;
        return vm.validate().then(() => {
          // 保存前置钩子
          if (vm.options.hooks && vm.options.hooks.pre_save
            && !vm.options.hooks.pre_save.apply(vm, [vm])) {
            return Promise.reject();
          }
          const itemToSave = vm.options.hooks && vm.options.hooks.item_filter ?
            vm.options.hooks.item_filter(vm.item) : vm.item;
          const promise = vm.objectId
            ? api(vm.model).patch({ id: itemToSave[vm.pk] }, itemToSave)
            : api(vm.model).save({ ...itemToSave });
          return promise.then(resp => {
            vm.notify('操作成功');
            // 创建的情况
            if (!itemToSave[vm.pk]) {
              vm.$router.replace({
                params: {
                  id: resp.data[vm.pk],
                },
              });
            }
            return vm.reload();
          });
        }, msg => {
          console.log(msg);
          vm.$message.error(msg);
        });
      },
      submit() {
        const vm = this;
        vm.save().then(() => {
          // 保存后置钩子
          const hookPostSave = vm.options.hooks && vm.options.hooks.post_save || vm.back;
          hookPostSave.apply(vm);
        });
      },
      erase() {
        const vm = this;
        if (vm.options.hooks && vm.options.hooks.pre_delete
          && !vm.options.hooks.pre_delete(vm)) {
          return Promise.reject();
        }
        const deleteName = vm.item.name ? `【${vm.item.name}】` : '这个对象';
        vm.deleteModel(
          vm.model,
          vm.item[vm.pk],
          `确认删除${deleteName}？`,
        ).then(() => {
          // 删除后置钩子
          const hookPostDelete = vm.options.hooks
            && vm.options.hooks.post_delete || (() => vm.redirectList());
          hookPostDelete(vm);
        });
      },
      writeField(field, item) {
        const vm = this;
        // skip readonly fields
        if (field.type === 'label' || field.type === 'link') {
          return;
        } else if (field.type === 'geo') {
          vm.setProperty(item, field.key && field.key.lat || 'geo_lat', field.value.lat);
          vm.setProperty(item, field.key && field.key.lng || 'geo_lng', field.value.lng);
          vm.setProperty(item, field.key && field.key.label || 'geo_label', field.value.label);
        } else if (field.type === 'image') {
          vm.setProperty(item, field.key.read, field.value);
          vm.setProperty(item, field.key.write, field.value && field.value.id);
        } else if (field.type === 'gallery') {
          vm.setProperty(item, field.key.read, field.value || []);
          vm.setProperty(item, field.key.write, (field.value || []).map(image => image.id));
        } else {
          vm.setProperty(item, field.key, field.value);
        }
      },
      onUpdate(field) {
        const vm = this;
//        console.warn(vm.item, field);
//        console.log(JSON.parse(JSON.stringify(field)));
        vm.writeField(field, vm.item);
        vm.$emit('update', field);
        vm.renderField(field);
      },
      back() {
        const vm = this;
        if (vm.hooks && vm.hooks.action_back) {
          vm.hooks.action_back();
        } else {
          vm.$router.back();
        }
      }
    },
  };
</script>


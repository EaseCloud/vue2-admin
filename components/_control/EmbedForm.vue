<template>

  <section class="item-form ant-form ant-form-horizontal">

    <template v-for="field in fields">

      <h3 style="margin-top: 20px;" v-if="field.display == 'full'">{{field.title}}</h3>

      <template v-if="field.type=='title'"></template>

      <v-row :gutter="6"
             type="flex"
             v-else-if="isVisible(field)"
             :key="field.pk"
             style="margin: 4px 0">

        <v-col :span="field.titleSpan || 6" class="ant-form-item-label" style="padding: 0"
               v-if="(field.display || 'normal') == 'normal'">
          <label>{{field.title}}</label>
        </v-col>

        <!-- type: input -->
        <v-col :span="field.span || 8" class="ant-form-item-control"
               v-if="field.type == 'input' || field.type === undefined">
          <v-input v-model="field.value"
                   @input="updateField(field)"
                   :type="field.htmlType || 'text'"
                   :min="field.min"
                   :disabled="field.disabled"
                   :max="field.max"
                   :rows="field.rows"
                   size="large"
                   :style="field.style"
                   :placeholder="field.placeholder"
                   @keypress.enter="$emit('submit')">
            <template slot="before" v-if="field.before">{{field.before}}</template>
            <template slot="after" v-if="field.after">{{field.after}}</template>
          </v-input>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: number -->
        <v-col :span="field.span || 8" class="ant-form-item-control"
               v-else-if="field.type == 'number'">
          <v-input-number v-model="field.value"
                          @input="updateField(field)"
                          :min="field.min"
                          :max="field.max"
                          :step="field.step"
                          :disabled="field.disabled"
                          size="large"
                          :decimal-places="field.decimalPlaces"
                          :placeholder="field.placeholder"
                          @keypress.enter="$emit('submit')">
          </v-input-number>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: datepicker -->
        <v-col :span="field.span || 8" class="ant-form-item-control"
               v-else-if="field.type == 'datepicker'">
          <!-- TODO: from/to 未实现 -->
          <!-- TODO: 时间选择有问题，不能读取以及 emit 出去 -->
          <!-- TODO: format 未实现，因为 time 选择时输入 format 会报错 -->
          <v-date-picker :value="dateformat(field.value, 'yyyy-mm-dd HH:MM:ss')"
                         :time="field.value"
                         clearable
                         :show-time="field.show_time || field.pick_time"
                         @input="field.value=$event; updateField(field)"
          ></v-date-picker>
          <!--:format="field.format || (field.show_time || field.pick_time ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd')"-->
        </v-col>

        <!-- type: label -->
        <v-col :span="field.span || 8" class="ant-form-item-control"
               v-else-if="field.type == 'label'">
          <p class="ant-form-text">
            {{field.filter?field.filter(field.value):field.value}}
            <!--{{(field.filter?field.filter(field.value):field.value)||field.default||''}}-->
          </p>
        </v-col>

        <!--type: tab-->
        <v-col :span="field.span || 8" class="ant-form-item-control"
               v-else-if="field.type == 'tab'">
          <v-tag :color="field.color || 'green-inverse'">{{field.value}}</v-tag>
        </v-col>

        <!-- type: html -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'html'"
               v-html="field.value">
        </v-col>

        <!--&lt;!&ndash; type: router-link &ndash;&gt;-->
        <!--<v-col :span="8" class="ant-form-item-control"-->
        <!--v-else-if="field.type == 'router-link'">-->
        <!--<router-link :to="field.to(item)">-->
        <!--123-->
        <!--{{field.text instanceof Function ? field.text(item) : field.text}}-->
        <!--</router-link>-->
        <!--</v-col>-->

        <!-- type: link -->
        <v-col :span="field.span || 8" class="ant-form-item-control"
               v-else-if="field.type == 'link'">
          <router-link :to="field.value.route"
                       v-if="field.value && field.value.route">
            {{field.value.text}}
          </router-link>
        </v-col>

        <!-- type: switch -->
        <v-col :span="field.span || 8" class="ant-form-item-control"
               v-else-if="field.type == 'switch'">
          <v-switch v-model="field.value"
                    :disabled="field.disabled"
                    @input="updateField(field)">
            <template slot="checked">{{field.checked}}</template>
            <template slot="unchecked">{{field.unchecked}}</template>
          </v-switch>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: select -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'select'">
          <v-select placement="top" :data="wrapChoices(field.choices)"
                    v-if="field.choices"
                    style="width: 120px;"
                    dropdown-width="240px"
                    v-model="field.value"
                    @input="updateField(field)"></v-select>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: checkbox -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'checkbox'">
          <v-checkbox-group v-if="field.choices"
                            v-model="field.value"
                            :disabled="!!field.readonly"
                            :data="field.choices"
                            :max="field.max"></v-checkbox-group>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: radio -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'radio'">
          <v-radio-group v-model="field.value"
                         @input="updateField(field)"
                         :disabled="!!field.readonly"
                         :data="getRadioChoices(field)"></v-radio-group>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: radio-button -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'radio-button'">
          <v-radio-group type="button"
                         v-model="field.value"
                         @input="updateField(field)"
                         :disabled="!!field.readonly"
                         :data="getRadioChoices(field)"></v-radio-group>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: image -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'image'">
          <image-picker v-model="field.value"
                        :readonly="!!field.readonly"
                        @input="updateField(field)"></image-picker>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: qrcode -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'qrcode'">
          <img :src="field.src" alt="二维码"/>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: gallery -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'gallery'">
          <gallery-picker v-model="field.value"
                          :readonly="!!field.readonly"
                          @input="updateField(field)"></gallery-picker>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- type: geo -->
        <v-col :span="field.span || 18" v-else-if="field.type == 'geo'">
          <geo-picker v-model="field.value"
                      :max="field.max"
                      :readonly="field.readonly"
                      @input="updateField(field)"></geo-picker>
        </v-col>

        <!-- type: district -->
        <v-col :span="field.span || 12" v-else-if="field.type == 'district'">
          <district-picker v-model="field.value"
                           :readonly="field.readonly"
                           @input="updateField(field)"></district-picker>
        </v-col>

        <!-- type: list-view -->
        <v-col :span="field.span || 18" v-else-if="field.type == 'list-view'">
          <list-view-table :model="field.options.model"
                           :pk="field.options.pk"
                           :cols="field.options.cols"
                           :options="field.options.options"
                           :actions="field.options.actions"
                           :filters="field.options.filters"
                           :hooks="field.options.hooks"
                           :pageSize="field.options.pageSize || field.options.page_size"
                           @loaded="field.onLoad && field.onLoad(field)"
                           :ref="field.id"></list-view-table>
          <!--:pager="pager"-->
        </v-col>

        <!-- type: object -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'object'">
          <router-link v-if="field.object && field.object[field.options.pk || 'id']"
                       style="margin-right: 10px;"
                       :to="{name: 'main_'+toUnderscore(field.options.model)+'_edit',
                  params: {id: field.object[field.options.pk || 'id']}}">
            {{field.object[field.options.display_field || 'name']}}
          </router-link>
          <v-button v-if="!field.readonly && !field.disabled"
                    size="small"
                    @click="pickFieldObject(field)">选择
          </v-button>
          <v-button v-if="field.value && !field.readonly && !field.disabled"
                    size="small"
                    @click="field.value=null; field.object=null; updateField(field)">清除
          </v-button>
        </v-col>

        <!-- type: editor -->
        <v-col :span="field.span || 18" class="ant-form-item-control"
               v-else-if="field.type == 'editor'">
          <vue-html5-editor v-model="field.value"
                            @input="updateField(field)"></vue-html5-editor>
          <div v-if="field.description"
               class="ant-form-explain">{{field.description}}
          </div>
        </v-col>

        <!-- 尚未实现 -->
        <span v-else>字段类型{{field.type}}尚未实现</span>

      </v-row>

    </template>

    <!--<object-picker :options="objectPickerField.options"-->
    <!--v-if="objectPickerField"-->
    <!--@input="pickObjectAction($event)"-->
    <!--@cancel="objectPickerField=null"></object-picker>-->

  </section>

</template>

<script type="text/babel" lang="babel">
  export default {
    props: {
      fields: Array,
    },
    data() {
      return {
        objectPickerField: null,
      };
    },
    mounted() {
      const vm = this;
      vm.fields.forEach(field => {
        // 注意 ref_name 配置尽量避免重复，否则只返回第一个
        field.ref = field.id && vm.$refs[field.id] && vm.$refs[field.id][0];
//        vm.echo(field);
      });
    },
    methods: {
//      fieldPickObject(field) {
//        const vm = this;
//        vm.pickObject(field).then(field => {
//
//        });
//        vm.objectPickerField = field;
//      },
//      pickObjectAction(id) {;
//        const vm = this;
//        const field = vm.objectPickerField;
//        vm.objectPickerField = null;
//        field.value = id;
//        vm.$emit('update', field);
//      },
      setField(key, value) {
        const vm = this;
//        console.warn(key,value);
        vm.fields.forEach(field => {
          if (field.key === key) {
//            console.warn(field);
            field.value = value;
            vm.updateField(field);
          }
        })
      },
      updateField(field) {
        const vm = this;
//        console.log('updateField', JSON.parse(JSON.stringify(field)))
        if (field.onUpdate) {
          field.onUpdate.apply(vm, [field]);
        }
        vm.$emit('update', field);
      },
      getRadioChoices(field) {
        // 格式参照 vue-beauty 的 :radios 属性
        // https://fe-driver.github.io/vue-beauty/#!/components/radio
        if (typeof field.choices === 'object') {
          return Object.keys(field.choices).map(key => ({
//              name: field.choices[key],
            text: field.choices[key],
            value: key,
          }));
        } else {
          // 支持其他输入方式（例如直接输入数组）
          return field.choices;
        }
      },
      isVisible(field) {
        if (typeof(field.visible) === 'function') {
          return field.visible(field.context && field.context.item);
        }
        return typeof(field.visible) === 'undefined' || !!field;
      },
      pickFieldObject(field) {
        const vm = this;
        vm.pickObject(field).then(() => {
          vm.updateField(field);
        });
      },
    },
  };
</script>

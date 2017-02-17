<template>

  <section class="item-form ant-form ant-form-horizontal"
           style="max-width: 800px">

    <ant-row :gutter="6"
             type="flex"
             v-for="field in fields">

      <ant-col :span="6" class="ant-form-item-label">
        <label>{{field.title}}</label>
      </ant-col>

      <!-- type: input -->
      <ant-col :span="8" class="ant-form-item-control"
               v-if="field.type == 'input' || field.type === undefined">
        <ant-input v-model="field.value"
                   @input="$emit('update', field)"
                   :type="field.htmlType || 'text'"
                   :min="field.min"
                   :max="field.max"
                   size="large"
                   :placeholder="field.placeholder"
                   @keypress.enter="$emit('submit')">
          <template slot="before" v-if="field.before">{{field.before}}</template>
          <template slot="after" v-if="field.after">{{field.after}}</template>
        </ant-input>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </ant-col>

      <!-- type: input number -->
      <ant-col :span="8" class="ant-form-item-control"
               v-else-if="field.type == 'number'">
        <ant-input-number v-if="typeof field.value == 'number'"
                          v-model="field.value"
                          @input="$emit('update', field)"
                          :min="field.min"
                          :max="field.max"
                          :step="field.step"
                          size="large"
                          :decimal-places="field.decimalPlaces"
                          :placeholder="field.placeholder"
                          @keypress.enter="$emit('submit')">
        </ant-input-number>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </ant-col>

      <!-- type: label -->
      <ant-col :span="8" class="ant-form-item-control"
               v-else-if="field.type == 'label'">
        <p class="ant-form-text">{{field.value}}</p>
      </ant-col>

      <!--&lt;!&ndash; type: router-link &ndash;&gt;-->
      <!--<ant-col :span="8" class="ant-form-item-control"-->
      <!--v-else-if="field.type == 'router-link'">-->
      <!--<router-link :to="field.to(item)">-->
      <!--123-->
      <!--{{field.text instanceof Function ? field.text(item) : field.text}}-->
      <!--</router-link>-->
      <!--</ant-col>-->

      <!-- type: link -->
      <ant-col :span="8" class="ant-form-item-control"
               v-else-if="field.type == 'link'">
        <router-link :to="field.value.route"
                     v-if="field.value && field.value.route">
          {{field.value.text}}
        </router-link>
      </ant-col>

      <!-- type: switch -->
      <ant-col :span="8" class="ant-form-item-control"
               v-else-if="field.type == 'switch'">
        <ant-switch v-model="field.value"
                    @input="$emit('update', field)">
          <template slot="checked">{{field.checked}}</template>
          <template slot="unchecked">{{field.unchecked}}</template>
        </ant-switch>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </ant-col>

      <!-- type: select -->
      <span v-else-if="field.type == 'select'">尚未实现</span>

      <!-- type: radio -->
      <ant-col :span="18" class="ant-form-item-control"
               v-else-if="field.type == 'radio'">
        <ant-radio-group v-model="field.value"
                         @input="$emit('update', field)"
                         :options="field.choices"></ant-radio-group>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </ant-col>

      <!-- type: radio-button -->
      <ant-col :span="18" class="ant-form-item-control"
               v-else-if="field.type == 'radio-button'">
        <ant-radio-group type="button"
                         v-model="field.value"
                         @input="$emit('update', field)"
                         :readonly="!!field.readonly"
                         :options="field.choices"></ant-radio-group>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </ant-col>

      <!-- type: image -->
      <ant-col :span="18" class="ant-form-item-control"
               v-else-if="field.type == 'image'">
        <image-picker v-model="field.value"
                      :readonly="!!field.readonly"
                      @input="$emit('update', field)"></image-picker>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </ant-col>

      <!-- type: gallery -->
      <ant-col :span="18" class="ant-form-item-control"
               v-else-if="field.type == 'gallery'">
        <gallery-picker v-model="field.value"
                        :readonly="!!field.readonly"
                        @input="$emit('update', field)"></gallery-picker>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </ant-col>

      <!-- type: geo -->
      <ant-col :span="18" v-else-if="field.type == 'geo'">
        <geo-picker v-model="field.value"
                    :max="field.max"
                    :readonly="field.readonly"
                    @input="$emit('update', field)"></geo-picker>
      </ant-col>

      <!-- type: district -->
      <ant-col :span="18" v-else-if="field.type == 'district'">
        尚未实现
      </ant-col>

      <!-- type: list-view -->
      <ant-col :span="18" v-else-if="field.type == 'list-view'">
        <list-view-table :model="field.options.model"
                         :pk="field.options.pk"
                         :cols="field.options.cols"
                         :options="field.options.options"
                         :actions="field.options.actions"
                         :filters="field.options.filters"></list-view-table>
        <!--:pager="pager"-->
      </ant-col>

      <!-- type: object -->
      <ant-col :span="18" class="ant-form-item-control"
               v-else-if="field.type == 'object'">
        <template v-if="field.value">
          <router-link :to="{name: 'main_'+toUnderscore(field.options.model)+'_edit',
                  params: {id: field.value[field.options.pk || 'id']}}">
            {{field.value[field.options.display_field || 'name']}}
          </router-link>
          <ant-button size="small" style="margin-left: 10px;"
                      @click="pickObject(field)">选择
          </ant-button>
        </template>
      </ant-col>

      <!-- 尚未实现 -->
      <span v-else>字段类型{{field.type}}尚未实现</span>

    </ant-row>

    <object-picker :options="objectPickerField.options"
                   v-if="objectPickerField"
                   @input="pickObjectAction($event)"
                   @cancel="objectPickerField=null"></object-picker>

  </section>

</template>

<script lang="babel">
  export default {
    props: {
      fields: Array,
    },
    data() {
      return {
        objectPickerField: null,
      };
    },
    methods: {
      pickObject(field) {
        const vm = this;
        vm.objectPickerField = field;
      },
      pickObjectAction(id) {
        const vm = this;
        const field = JSON.parse(JSON.stringify(vm.objectPickerField));
        vm.objectPickerField = null;
        field.value = id;
        vm.$emit('update', field);
      },
    },
  };
</script>

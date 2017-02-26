<template>

  <section class="item-form ant-form ant-form-horizontal"
           style="max-width: 800px">

    <v-row :gutter="6"
           type="flex"
           v-for="field in fields">

      <v-col :span="6" class="ant-form-item-label">
        <label>{{field.title}}</label>
      </v-col>

      <!-- type: input -->
      <v-col :span="8" class="ant-form-item-control"
             v-if="field.type == 'input' || field.type === undefined">
        <v-input v-model="field.value"
                 @input="$emit('update', field)"
                 :type="field.htmlType || 'text'"
                 :min="field.min"
                 :max="field.max"
                 size="large"
                 :placeholder="field.placeholder"
                 @keypress.enter="$emit('submit')">
          <template slot="before" v-if="field.before">{{field.before}}</template>
          <template slot="after" v-if="field.after">{{field.after}}</template>
        </v-input>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </v-col>

      <!-- type: input number -->
      <v-col :span="8" class="ant-form-item-control"
             v-else-if="field.type == 'number'">
        <v-input-number v-if="typeof field.value == 'number'"
                        v-model="field.value"
                        @input="$emit('update', field)"
                        :min="field.min"
                        :max="field.max"
                        :step="field.step"
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
      <v-col :span="8" class="ant-form-item-control"
             v-else-if="field.type == 'datepicker'">
        <datepicker :placeholder="field.placeholder"
                    v-model="field.value"
                    :type="field.pick_time?'min':'day'"
                    @input="$emit('update', field)"
                    :format="field.format || (field.pick_time ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD')"
                    :limit="[{type: 'fromto', to: field.to || '2999-01-01'},
                    {type: 'fromto', from: field.from || '1900-01-01'}]"
                    :input-class="{'ant-input': true}"></datepicker>
      </v-col>

      <!-- type: label -->
      <v-col :span="8" class="ant-form-item-control"
             v-else-if="field.type == 'label'">
        <p class="ant-form-text">{{field.value}}</p>
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
      <v-col :span="8" class="ant-form-item-control"
             v-else-if="field.type == 'link'">
        <router-link :to="field.value.route"
                     v-if="field.value && field.value.route">
          {{field.value.text}}
        </router-link>
      </v-col>

      <!-- type: switch -->
      <v-col :span="8" class="ant-form-item-control"
             v-else-if="field.type == 'switch'">
        <v-switch v-model="field.value"
                  @input="$emit('update', field)">
          <template slot="checked">{{field.checked}}</template>
          <template slot="unchecked">{{field.unchecked}}</template>
        </v-switch>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </v-col>

      <!-- type: select -->
      <span v-else-if="field.type == 'select'">尚未实现</span>

      <!-- type: radio -->
      <v-col :span="18" class="ant-form-item-control"
             v-else-if="field.type == 'radio'">
        <v-radio-group v-model="field.value"
                       @input="$emit('update', field)"
                       :options="field.choices"></v-radio-group>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </v-col>

      <!-- type: radio-button -->
      <v-col :span="18" class="ant-form-item-control"
             v-else-if="field.type == 'radio-button'">
        <v-radio-group type="button"
                       v-model="field.value"
                       @input="$emit('update', field)"
                       :readonly="!!field.readonly"
                       :options="field.choices"></v-radio-group>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </v-col>

      <!-- type: image -->
      <v-col :span="18" class="ant-form-item-control"
             v-else-if="field.type == 'image'">
        <image-picker v-model="field.value"
                      :readonly="!!field.readonly"
                      @input="$emit('update', field)"></image-picker>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </v-col>

      <!-- type: gallery -->
      <v-col :span="18" class="ant-form-item-control"
             v-else-if="field.type == 'gallery'">
        <gallery-picker v-model="field.value"
                        :readonly="!!field.readonly"
                        @input="$emit('update', field)"></gallery-picker>
        <div v-if="field.description"
             class="ant-form-explain">{{field.description}}
        </div>
      </v-col>

      <!-- type: geo -->
      <v-col :span="18" v-else-if="field.type == 'geo'">
        <geo-picker v-model="field.value"
                    :max="field.max"
                    :readonly="field.readonly"
                    @input="$emit('update', field)"></geo-picker>
      </v-col>

      <!-- type: district -->
      <v-col :span="18" v-else-if="field.type == 'district'">
        尚未实现
      </v-col>

      <!-- type: list-view -->
      <v-col :span="18" v-else-if="field.type == 'list-view'">
        <list-view-table :model="field.options.model"
                         :pk="field.options.pk"
                         :cols="field.options.cols"
                         :options="field.options.options"
                         :actions="field.options.actions"
                         :filters="field.options.filters"></list-view-table>
        <!--:pager="pager"-->
      </v-col>

      <!-- type: object -->
      <v-col :span="18" class="ant-form-item-control"
             v-else-if="field.type == 'object'">
        <template v-if="field.value">
          <router-link v-if="field.value[field.options.pk || 'id']"
                       style="margin-right: 10px;"
                       :to="{name: 'main_'+toUnderscore(field.options.model)+'_edit',
                  params: {id: field.value[field.options.pk || 'id']}}">
            {{field.value[field.options.display_field || 'name']}}
          </router-link>
          <v-button size="small"
                    @click="pickObject(field)">选择
          </v-button>
          <v-button size="small" v-if="field.value[field.options.pk || 'id']"
                    @click="field.value = null; $emit('update', field)">清除
          </v-button>
        </template>
      </v-col>


      <!-- 尚未实现 -->
      <span v-else>字段类型{{field.type}}尚未实现</span>

    </v-row>

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

<template>

  <div class="notifiers">

    <template v-for="form in modalForms">

      <div v-if="form.modalType === 'modalForm'"
           class="ant-modal-wrap block-modal-form"
           style="z-index: 1">
        <div role="document" class="ant-modal" style="width: 520px;">
          <div class="ant-modal-content">
            <button class="ant-modal-close" @click="modalFormAction(form, false)">
              <span class="ant-modal-close-x"></span>
            </button>
            <div class="ant-modal-header">
              <div class="ant-modal-title">{{form.title}}</div>
            </div>
            <div class="ant-modal-body">
              <div class="ant-form ant-form-horizontal">
                <div class="ant-row" v-for="(field, i) in form.fields">
                  <div class="ant-col-6 ant-form-item-label" v-if="!field.hide_label" style="padding: 0">
                    <label>
                      <span v-if="field.required" style="color: red">*</span>
                      {{field.label}}
                    </label>
                  </div>
                  <v-col :span="field.span || 18" class="ant-form-item-control">
                    <!-- type: text -->
                    <template v-if="(field.type || 'text') === 'text'">
                      <input type="text"
                             class="ant-input"
                             :placeholder="field.placeholder"
                             :disabled="field.disabled"
                             :readonly="field.readonly"
                             v-model="field.value"
                             @keypress.enter="modalFormAction(form, true)" />
                    </template>
                    <!-- type: password -->
                    <template v-else-if="(field.type === 'password')">
                      <input type="password"
                             class="ant-input"
                             :placeholder="field.placeholder"
                             :disabled="field.disabled"
                             :readonly="field.readonly"
                             v-model="field.value"
                             @keypress.enter="modalFormAction(form, true)" />
                    </template>
                    <!-- type: number -->
                    <template v-else-if="(field.type === 'number')">
                      <input type="number"
                             class="ant-input"
                             :placeholder="field.placeholder"
                             :disabled="field.disabled"
                             :readonly="field.readonly"
                             v-model="field.value"
                             @keypress.enter="modalFormAction(form, true)" />
                    </template>
                    <!-- type: date -->
                    <template v-else-if="(field.type === 'date')">
                      <v-date-picker v-model="field.value"
                                     format="yyyy-MM-dd"></v-date-picker>
                    </template>
                    <!-- type: datetime -->
                    <template v-else-if="(field.type === 'datetime')">
                      <datepicker :time.sync="field.value"
                                  type="min"
                                  format="YYYY-MM-DD HH:mm"
                                  :input-class="{'ant-input': true}"></datepicker>
                    </template>
                    <!-- type: date_range -->
                    <template v-else-if="(field.type === 'date_range')">
                      <v-date-picker :range="true"
                                     :clearable="true"
                                     format="yyyy-MM-dd"
                                     v-model="field.value"></v-date-picker>
                      <!--:startTime="field.value && field.value.[0] || '1900-01-01'"-->
                      <!--:endTime="field.value && field.value.split('~')[1] || '2999-12-31'"-->
                    </template>
                    <!-- type: textarea -->
                    <template v-else-if="(field.type === 'textarea')">
                        <textarea class="ant-input"
                                  :placeholder="field.placeholder"
                                  @keypress.enter="modalFormAction(form, true)"
                                  :disabled="field.disabled"
                                  :readonly="field.readonly"
                                  v-model="field.value"></textarea>
                    </template>
                    <!-- type: district -->
                    <template v-else-if="(field.type === 'district')">
                      <district-picker v-model="field.value"></district-picker>
                    </template>
                    <!-- type: object -->
                    <template v-else-if="(field.type === 'object')">
                      <!--<router-link v-if="field.value && field.value[field.options.pk || 'id']"-->
                      <!--style="margin-right: 10px;"-->
                      <!--:to="{name: 'main_'+toUnderscore(field.options.model)+'_edit',-->
                      <!--params: {id: field.value[field.options.pk || 'id']}}">-->
                      <template v-if="field.value && typeof(field.value) === 'object'">
                        {{field.value[field.options.display_field || 'name']}}
                      </template>
                      <template v-else-if="field.value">#{{field.value}}</template>
                      <!--</router-link>-->
                      <v-button size="small"
                                @click="pickObjectField(field)">选择
                      </v-button>
                      <v-button size="small" v-if="field.value"
                                @click="field.value = null">清除
                      </v-button>
                    </template>
                    <!-- type: select -->
                    <template v-else-if="(field.type === 'select')">
                      <select v-model="field.value" class="ant-input" title
                              :disabled="field.disabled">
                        <option value="" v-if="field.placeholder">{{field.placeholder}}</option>
                        <option v-for="choice in field.choices" :value="choice.value">
                          {{choice.text}}
                        </option>
                      </select>
                    </template>
                    <!-- type: multi-select -->
                    <template v-else-if="(field.type === 'multi-select')">
                      <v-checkbox :ref="'check-all-'+i"
                                  @click="field.value=field.value.length===field.choices.length?[]:field.choices.map(x=>x.value)"
                                  :value="field.value.length===field.choices.length">
                        全选
                      </v-checkbox>
                      <v-checkbox-group style="display: inline-block"
                                        :data="field.choices"
                                        label="text"
                                        v-model="field.value">
                      </v-checkbox-group>
                    </template>
                    <!-- type: render -->
                    <template v-else-if="(field.type === 'render')">
                      <render-component :render="field.render"></render-component>
                    </template>
                    <!-- type: label -->
                    <template v-else-if="(field.type === 'label')">
                      {{field.value}}
                    </template>
                  </v-col>
                </div>
              </div>
            </div>
            <div class="ant-modal-footer">
              <button type="button"
                      @click="modalFormAction(form, false)"
                      class="ant-btn ant-btn-ghost">
                <span>{{form.textCancel || '取消'}}</span>
              </button>
              <button type="button"
                      @click="modalFormAction(form, true)"
                      class="ant-btn ant-btn-primary">
                <span>{{form.textOk || '确认'}}</span>
              </button>
            </div>
          </div>
          <div tabindex="0" style="width: 0px; height: 0px; overflow: hidden;">sentinel</div>
        </div>
      </div>

      <object-picker v-else-if="form.modalType === 'objectPicker'"
                     :multi="form.multi"
                     :options="form.options"
                     @input="pickObjectAction(form, $event)"
                     @cancel="modalForms.splice(modalForms.indexOf(form), 1)"></object-picker>

      <div v-else-if="form.modalType === 'render'"
           class="ant-modal-wrap block-modal-form"
           style="z-index: 1">
        <div role="document" class="ant-modal" style="width: 520px;">
          <div class="ant-modal-content">
            <button class="ant-modal-close" @click="modalFormAction(form, false)">
              <span class="ant-modal-close-x"></span>
            </button>
            <div class="ant-modal-header">
              <div class="ant-modal-title">{{form.title}}</div>
            </div>
            <div class="ant-modal-body">
              <render-component :render="form.render"></render-component>
            </div>
            <div class="ant-modal-footer">
              <button type="button"
                      @click="modalFormAction(form, false)"
                      class="ant-btn ant-btn-ghost">
                <span>{{form.textCancel || '取消'}}</span>
              </button>
              <button type="button"
                      @click="modalFormAction(form, true)"
                      class="ant-btn ant-btn-primary">
                <span>{{form.textOk || '确认'}}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </template>

    <div class="block-imagepicker invisible">
      <input type="file" accept="image/*"
             @change="pickImageAction()"
             ref="uploader" />
      <input type="file"
             @change="pickFileAction()"
             ref="uploader_file" />
    </div>

  </div>

</template>

<script>
export default {
  data () {
    return {
      modalForms: [],
      imagepicker: {
        deferred: null,
      },
      filepicker: {
        deferred: null,
      },
    };
  },
  methods: {
    pickObjectField (field) {
      const vm = this;
      vm.pickObject(field).then(field => {
        vm.api(field.options.model).get({ id: field.value }).then(resp => field.value = resp.data);
      });
    },
  },
};
</script>


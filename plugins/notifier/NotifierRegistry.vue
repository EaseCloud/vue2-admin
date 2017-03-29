<template>

  <div class="notifiers">

    <!--<div class="block-notify">-->
      <!--<div class="ant-notification" v-for="(item, i) in itemsNotify">-->
        <!--<div class="ant-notification-notice ant-notification-notice-closable">-->
          <!--<div class="ant-notification-notice-content">-->
            <!--<div class="ant-notification-notice-content ">-->
              <!--<div class="ant-notification-notice-message">-->
                <!--{{ item.title }}-->
              <!--</div>-->
              <!--<div class="ant-notification-notice-description">-->
                <!--{{ item.content }}-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--<a tabindex="0" @click="dismissNotify(i);"-->
             <!--class="ant-notification-notice-close">-->
            <!--<span class="ant-notification-notice-close-x"></span>-->
          <!--</a>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

    <!--<div class="ant-modal-wrap block-modal-form"-->
         <!--v-for="(item, i) in itemsConfirm">-->
      <!--<div role="document" class="ant-modal" style="width: 520px;">-->
        <!--<div class="ant-modal-content">-->
          <!--<button class="ant-modal-close" @click="confirmAction(false, i)">-->
            <!--<span class="ant-modal-close-x"></span>-->
          <!--</button>-->
          <!--<div class="ant-modal-header">-->
            <!--<div class="ant-modal-title">{{item.title}}</div>-->
          <!--</div>-->
          <!--<div class="ant-modal-body" v-html="item.content"></div>-->
          <!--<div class="ant-modal-footer">-->
            <!--<button type="button"-->
                    <!--@click="confirmAction(false, i)"-->
                    <!--class="ant-btn ant-btn-ghost ant-btn-lg">-->
              <!--<span>取消</span>-->
            <!--</button>-->
            <!--<button type="button"-->
                    <!--@click="confirmAction(true, i)"-->
                    <!--class="ant-btn ant-btn-primary ant-btn-lg">-->
              <!--<span>确认</span>-->
            <!--</button>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div tabindex="0" style="width: 0; height: 0; overflow: hidden;">sentinel</div>-->
      <!--</div>-->
    <!--</div>-->

    <div v-if="modalFormData"
         class="ant-modal-wrap block-modal-form">
      <div role="document" class="ant-modal" style="width: 520px;">
        <div class="ant-modal-content">
          <button class="ant-modal-close" @click="modalFormAction(false)">
            <span class="ant-modal-close-x"></span>
          </button>
          <div class="ant-modal-header">
            <div class="ant-modal-title">{{modalFormData.title}}</div>
          </div>
          <div class="ant-modal-body">
            <div class="ant-form ant-form-horizontal">
              <div class="ant-row" v-for="field in modalFormData.fields">
                <div class="ant-col-6 ant-form-item-label">
                  <label>{{field.label}}</label>
                </div>
                <!-- type: text -->
                <div class="ant-col-18 ant-form-item-control" v-if="field.type == 'text'">
                  <input type="text"
                         class="ant-input"
                         :placeholder="field.placeholder"
                         v-model="field.value"
                         @keypress.enter="modalFormAction(true)"/>
                </div>
                <!-- type: password -->
                <div class="ant-col-18 ant-form-item-control" v-if="field.type == 'password'">
                  <input type="password"
                         class="ant-input"
                         :placeholder="field.placeholder"
                         v-model="field.value"
                         @keypress.enter="modalFormAction(true)"/>
                </div>
                <!-- type: number -->
                <div class="ant-col-18 ant-form-item-control" v-if="field.type == 'number'">
                  <input type="number"
                         class="ant-input"
                         :placeholder="field.placeholder"
                         v-model="field.value"
                         @keypress.enter="modalFormAction(true)"/>
                </div>
                <!-- type: date -->
                <div class="ant-col-18 ant-form-item-control" v-if="field.type == 'date'">
                  <datepicker :time.sync="field.value"
                              :placeholder="field.placeholder"
                              :input-class="{'ant-input': true}"></datepicker>
                </div>
                <!-- type: datetime -->
                <div class="ant-col-18 ant-form-item-control" v-if="field.type == 'datetime'">
                  <datepicker :time.sync="field.value"
                              type="min"
                              format="YYYY-MM-DD HH:mm"
                              :input-class="{'ant-input': true}"></datepicker>
                </div>
                <!-- type: textarea -->
                <div class="ant-col-18 ant-form-item-control" v-if="field.type == 'textarea'">
                <textarea class="ant-input"
                          :placeholder="field.placeholder"
                          @keypress.enter="modalFormAction(true)"
                          v-model="field.value"></textarea>
                </div>
                <!-- type: district -->
                <div class="ant-col-18 ant-form-item-control" v-if="field.type == 'district'">
                  <district-picker v-model="field.value"></district-picker>
                </div>
                <!-- type: select -->
                <div class="ant-col-18 ant-form-item-control" v-if="field.type == 'select'">
                  <select v-model="field.value"
                          class="ant-input"
                          title>
                    <option value="" v-if="field.placeholder">{{field.placeholder}}</option>
                    <option v-for="choice in field.choices" :value="choice.value">
                      {{choice.text}}
                    </option>
                  </select>
                </div>
                <!--<div class="ant-col-16 ant-form-item-control" v-if="field.type == text">-->
                <!--</div>-->
                <!--<div class="ant-col-16 ant-form-item-control" v-if="field.type == text">-->
                <!--</div>-->
              </div>
            </div>
          </div>
          <div class="ant-modal-footer">
            <button type="button"
                    @click="modalFormAction(false)"
                    class="ant-btn ant-btn-ghost">
              <span>{{modalFormData.textCancel || '取消'}}</span>
            </button>
            <button type="button"
                    @click="modalFormAction(true)"
                    class="ant-btn ant-btn-primary">
              <span>{{modalFormData.textOk || '确认'}}</span>
            </button>
          </div>
        </div>
        <div tabindex="0" style="width: 0px; height: 0px; overflow: hidden;">sentinel</div>
      </div>
    </div>

    <div class="block-imagepicker invisible">
      <input type="file" accept="image/*"
             @change="pickImageAction()"
             ref="uploader"/>
    </div>

  </div>

</template>

<script lang="babel">
  export default {
    data() {
      return {
//        itemsNotify: [],
//        itemsConfirm: [],
        itemsPrompt: [],
        modalFormData: null,
        imagepicker: {
          deferred: null,
        },
      };
    },
  };
</script>


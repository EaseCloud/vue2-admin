<template>
  <div class="image-picker clearfix">
    <div class="ant-upload-list ant-upload-list-picture-card">
      <div class="ant-upload-list-item ant-upload-list-item-done" v-if="value">
        <div class="ant-upload-list-item-info">
          <a class="ant-upload-list-item-thumbnail"
             :href="value.image"
             target="_blank" rel="noopener noreferrer">
            <img :src="value.image"/>
          </a>
          <div class="image-picker-actions">
            <a class="anticon anticon-eye-o"
               href="javascript:"
               @click="previewImages([value.image])"></a>
            <a v-if="!readonly"
               class="anticon anticon-delete"
               href="javascript:"
               @click="$emit('input', null)"></a>
          </div>
        </div>
      </div>
    </div>
    <div class="ant-upload ant-upload-select ant-upload-select-picture-card"
         v-if="!readonly && !value" @click="uploadImage">
      <div class="rc-upload" role="button">
        <!--<input type="file" accept="" style="display: none;">-->
        <i class="anticon anticon-plus"></i>
        <div class="ant-upload-text">上传</div>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
  export default {
    props: {
      value: {
        type: Object,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      uploadImage() {
        const vm = this;
        vm.$root.pickImage().then(image => {
          vm.$emit('input', image);
        });
      },
    },
  };
</script>

<style lang="less" type="text/less">
  .image-picker-actions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    line-height: 78px;
    text-align: center;
    z-index: 1;
    a.anticon {
    }
  }
</style>

<template>
  <div class="gallery-picker clearfix">
    <template v-if="value">
      <div class="ant-upload-list ant-upload-list-picture-card"
           v-for="(image, i) in value">
        <div class="ant-upload-list-item ant-upload-list-item-done">
          <div class="ant-upload-list-item-info">
            <a class="ant-upload-list-item-thumbnail"
               :href="image.image"
               target="_blank" rel="noopener noreferrer">
              <img :src="image.image" alt=""/>
            </a>
            <div>
              <a href="javascript:"
                 @click="previewImages(value, i)"
                 rel="noopener noreferrer">
                <i class="anticon anticon-eye-o"
                   style="margin: -8px 0 0 -22px"></i>
              </a>
              <i class="anticon anticon-delete"
                 v-if="!readonly"
                 @click="removeImage(i)"
                 style="margin: -8px 0 0 6px"></i>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="ant-upload ant-upload-select ant-upload-select-picture-card"
         v-if="!value || (!readonly && (!max || value.length < max))"
         @click="uploadImage">
      <div class="rc-upload" role="button">
        <!--<input type="file" accept="" style="display: none;">-->
        <i class="anticon anticon-plus "></i>
        <div class="ant-upload-text">上传</div>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
  export default {
    props: {
      value: {
        type: Array,
      },
      max: {
        type: Number,
        default: 100,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      uploadImage() {
        const vm = this;
        const value = vm.value || [];
        if (vm.readonly) return false;
        if (value && vm.max && value.length >= vm.max) {
          vm.notify(`最多上传${vm.max}张产品图`);
          return;
        }
        vm.$root.pickImage().then(image => {
          value.push(image);
          vm.$emit('input', value);
        });
      },
      removeImage(index) {
        const vm = this;
        if (vm.readonly) return false;
        vm.value.splice(index, 1);
        vm.$emit('input', vm.value);
      },
    },
  };
</script>


<template>
  <div class="image-viewer" v-show="images.length > 0" @click="close()">
    <div class="image-wrapper">
      <img :src="image_url"
           :style="{transform: 'rotate('+rotate+'deg)'}"
           @click.stop/>
    </div>
    <ul class="actions" @click.stop>
      <li>
        <a href="javascript:"
           :class="{disabled:index==0}"
           @click="index=index-1>=0?(rotate=0,index-1):index">
          <v-icon type="left"></v-icon>
        </a>
      </li>
      <li>
        <a href="javascript:"
           @click="rotate+=90">
          <v-icon type="reload"></v-icon>
        </a>
      </li>
      <li>
        <a href="javascript:"
           :class="{disabled:index+1==images.length}"
           @click="index=index+1<images.length?(rotate=0,index+1):index">
          <v-icon type="right"></v-icon>
        </a>
      </li>
      <li>
        <a target="_blank" :href="image_url">
          <v-icon type="export"></v-icon>
        </a>
      </li>
      <li>
        <a href="javascript:" @click="close()">
          <v-icon type="close"></v-icon>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="babel">
  export default {
    data() {
      return {
        images: [],
        rotate: 0,
        index: 0,
      };
    },
    computed: {
      image_url() {
        const vm = this;
        const img = vm.images.length > vm.index && vm.images[vm.index] || false;
        // 兼容 DRF 定义的 ImageModel 对象
        return typeof img === 'object' ? img.image : img;
      },
    },
    methods: {
      close() {
        const vm = this;
        vm.images = [];
        vm.index = 0;
        vm.rotate = 0;
      },
    },
  };
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .image-viewer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.7);
  }
  .image-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 90px;
    right: 0;
    margin: auto;
    max-width: 80%;
    max-height: 80%;
    background: 50% 50% no-repeat;
    background-size: contain;
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      max-width: 100%;
      max-height: 100%;
      /*width: auto;*/
      /*height: auto;*/
      object-fit: contain;
      -o-object-fit: contain;
    }
  }
  ul.actions {
    position: absolute;
    text-align: center;
    left: 0;
    right: 0;
    height: 60px;
    bottom: 30px;
    line-height: 60px;
    font-size: 45px;
    li {
      display: inline-block;
      margin: 0 20px;
      a {
        color: rgba(255, 255, 255, 0.6);
        &:hover {
          color: white;
        }
        &.disabled {
          cursor: not-allowed;
          color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
</style>

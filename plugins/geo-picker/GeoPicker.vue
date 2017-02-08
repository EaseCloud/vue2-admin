<template>
  <div class="geo-picker clearfix" v-if="value">
    <div class="ant-form-item-control">
      <template v-if="value.lng && value.lat">
        {{value.label}}({{value.lng}},{{value.lat}})
      </template>
      <template v-else>尚未定位</template>
      <ant-button @click="pick" size="small">获取定位</ant-button>
    </div>
    <div v-if="value && value.lat && value.lng">
      <img :src="'http://api.map.baidu.com/staticimage?width=560&height=280'
                     +'&center='+value.lng+','+value.lat+'&zoom=13&dpiType=pl'
                     +'&markers=|'+value.lng+','+value.lat"/>
    </div>
  </div>
</template>

<script lang="babel">
  export default {
    props: {
      value: Object,
    },
    methods: {
      pick() {
        const vm = this;
        vm.$root.pickGeo({ ...vm.value }).then(geoInfo => {
          vm.$emit('input', geoInfo);
        });
      },
    },
  };
</script>

<template>
  <div class="district-picker ant-row">
    <div class="ant-col-8 ant-form-item-control">
      <select v-model="zip_province"
              class="ant-input" title>
        <option value="">请选择...</option>
        <option v-for="(name, zipCode) in districts.province"
                :value="zipCode">{{name}}
        </option>
      </select>
    </div>
    <div class="ant-col-7 ant-col-offset-1 ant-form-item-control">
      <select v-model="zip_city"
              class="ant-input" title>
        <option value="">请选择...</option>
        <option v-for="(name, zipCode) in districts.city"
                :value="zipCode">{{name}}
        </option>
      </select>
    </div>
    <div class="ant-col-7 ant-col-offset-1 ant-form-item-control">
      <select v-model="zip_district"
              class="ant-input" title>
        <option value="">请选择...</option>
        <option v-for="(name, zipCode) in districts.district"
                :value="zipCode">{{name}}
        </option>
      </select>
    </div>
  </div>
</template>

<script type="text/babel">
  export default {
    props: ['value'],
    computed: {
      districts() {
        const vm = this;
        const district = vm.value;
        return {
          province: vm.$root.getDistrict(86),
          city: vm.$root.getDistrict(district - district % 10000) || [],
          district: district % 10000 === 0 ? [] : (
            vm.$root.getDistrict(district - district % 100) || []
          ),
        };
      },
      zip_province: {
        get() {
          const vm = this;
          const district = vm.value;
          return district - district % 10000 || '';
        },
        set(value) { console.log('prov'); this.$emit('input', value); },
      },
      zip_city: {
        get() {
          const vm = this;
          const district = vm.value;
          if (district % 10000 === 0) return '';
          return district - district % 100 || '';
        },
        set(value) {
//          TODO： 在某种不明情况下会触发两次，第二次value为空导致选择不了地区。先补丁
          console.log('city');
          if (!value) {
            return;
          }
          this.$emit('input', value);
        },
      },
      zip_district: {
        get() {
          const vm = this;
          const district = vm.value;
          if (district % 100 === 0) return '';
          return district || '';
        },
        set(value) {
          console.log('dist');
          //          TODO： 在某种不明情况下会触发两次，第二次value为空导致选择不了地区。先补丁
          if (!value) {
            return;
          }
          this.$emit('input', value);
        },
      },
    },
    methods: {
      updateGeoLocation() {
        const vm = this;
        vm.$root.pickGeo(vm.item.geo_lat ? {
          lat: vm.item.geo_lat,
          lng: vm.item.geo_lng,
          label: vm.item.geo_label,
        } : null).then(geoInfo => {
          vm.item.geo_lat = geoInfo.lat;
          vm.item.geo_lng = geoInfo.lng;
          vm.item.geo_label = geoInfo.label;
        });
      },
    },
  };
</script>

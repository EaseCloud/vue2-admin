<template>
  <div class="district-picker ant-row">
    <div class="ant-col-8 ant-form-item-control">
      <select v-model="zip_province"
              class="ant-input" title>
        <option value="">请选择...</option>
        <option v-for="(zipCode, name) in districts.province"
                :value="zipCode">{{name}}
        </option>
      </select>
    </div>
    <div class="ant-col-7 ant-col-offset-1 ant-form-item-control">
      <select v-model="zip_city"
              class="ant-input" title>
        <option value="">请选择...</option>
        <option v-for="(zipCode, name) in districts.city"
                :value="zipCode">{{name}}
        </option>
      </select>
    </div>
    <div class="ant-col-7 ant-col-offset-1 ant-form-item-control">
      <select v-model="zip_district"
              class="ant-input" title>
        <option value="">请选择...</option>
        <option v-for="(zipCode, name) in districts.district"
                :value="zipCode">{{name}}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="babel">
  export default {
    props: ['district'],
    computed: {
      districts() {
        const vm = this;
        const district = vm.district;
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
          const district = vm.district;
          return district - district % 10000 || '';
        },
        set(value) { this.district = value; },
      },
      zip_city: {
        get() {
          const vm = this;
          const district = vm.district;
          if (district % 10000 === 0) return '';
          return district - district % 100 || '';
        },
        set(value) { this.district = value; },
      },
      zip_district: {
        get() {
          const vm = this;
          const district = vm.district;
          if (district % 100 === 0) return '';
          return district || '';
        },
        set(value) { this.district = value; },
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
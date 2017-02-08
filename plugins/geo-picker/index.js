import Deferred from 'es6-deferred';

import GeoPicker from './GeoPicker.vue';
import GeoPickerRegistry from './GeoPickerRegistry.vue';

export default {
  install(Vue, options) {
    Vue.mixin({
      components: { GeoPicker, GeoPickerRegistry },
      mounted() {
        if (this.$root === this && !this.vmGeoPicker) {
          const msg = '请在路由根插件内置入 <geo-picker-registry ref="geopicker"/>';
          console.error(msg);
        }
      },
      computed: {
        vmGeoPicker() {
          return this.$root.$refs.geopicker
            || this.$root.$children[0].$refs.geopicker;
        },
      },
      methods: {
        pickGeo(geoInfo) {
          // if (!BMap.version) {
          //   return Promise.reject('BMap not initialized');
          // }
          const vm = this.vmGeoPicker;
          const deferred = new Deferred();
          const defaultGeoInfo = {
            lat: 39.915119,
            lng: 116.403963,
            label: '天安门',
          };
          if (geoInfo) {
            geoInfo.lat = geoInfo.lat || defaultGeoInfo.lat;
            geoInfo.lng = geoInfo.lng || defaultGeoInfo.lng;
            geoInfo.label = geoInfo.label || defaultGeoInfo.label;
          }
          vm.geopicker = { deferred, ...(geoInfo || defaultGeoInfo) };
          vm.initMap(vm.geopicker.lng, vm.geopicker.lat);
          return deferred.promise;
        },
        pickGeoAction(success = true) {
          const vm = this.vmGeoPicker;
          if (!vm.geopicker) return Promise.reject();
          const deferred = vm.geopicker.deferred;
          const geoInfo = {
            lat: vm.geopicker.lat,
            lng: vm.geopicker.lng,
            label: vm.geopicker.label,
          };
          vm.geopicker = null;
          return success ? deferred.resolve(geoInfo) : deferred.reject();
        },
      },
    });
  },
};

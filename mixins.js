// Mixins

import areaData from 'china-area-data';
import Loading from 'vue-spinner/src/ScaleLoader.vue';

import * as common from './components/_common';
import * as controls from './components/_control';
import * as modules from './components/_modules';
import api from './resource/api';

import choices from '../config/choices';
import config from '../config/config';

export default {
  mounted() {
    // Auto reload
    if (this.reload) this.reload();
  },
  components: { Loading, ...common, ...controls, ...modules },
  computed: {
    choices() {
      return choices;
    },
    areaData() {
      return areaData;
    },
    me() {
      return this.$root.current_user;
    },
    modelUnderscore() {
      return this.model.replace(/([A-Z])/g, $1 => `_${$1.toLowerCase()}`).substr(1);
    },
    config() {
      return config;
    },
  },
  filters: {
    currency(value, note = '￥') {
      return `${note}${Number(value).toFixed(2)}`;
    },
  },
  methods: {
    api(model = null) {
      return api(model || this.model);
    },
    authenticate(reload = false) {
      const vm = this.$root;
      if (vm.me && !reload) return Promise.resolve(vm.me);
      // debugger; // eslint-disable-line
      return api('User').get({ action: 'current' }).then(resp => {
        vm.current_user = resp.data;
        return vm.me;
      });
    },
    login(username, password) {
      const vm = this.$root;
      return api('User').save(
        { action: 'login' },
        { username, password }
      ).then(resp => {
        vm.current_user = resp.data;
        return vm.me;
      });
    },
    logout() {
      const vm = this.$root;
      return api('User').get({ action: 'logout' }).then(() => {
        vm.current_user = null;
        vm.$router.push({ name: 'passport_login' });
      });
    },
    switchQueryBar() {
      if (this.filter && ('show_query_bar' in this.filter)) {
        this.filter.show_query_bar = !this.filter.show_query_bar ? 1 : '';

        this.query();
      }
    },
    updateModel(model, id, field, value,
                notify = '操作成功', callback = null) {
      const vm = this;
      return api(model).patch({ id }, { [field]: value }).then(resp => {
        const item = resp.data;
        if (notify) vm.notify(notify);
        if (callback) callback(item);
      });
    },
    deleteModel(model, id, confirm = '确认删除此对象？',
                notify = '操作成功', callback = null) {
      const vm = this;
      const promise = confirm ? this.confirm(confirm) : Promise.resolve();
      return promise.then(() => {
        api(model).delete({ id }).then(() => {
          if (notify) vm.notify(notify);
          if (callback) callback();
        });
      });
    },
    /**
     * 这个方法会默认将当前 vm 的 this.filter 数据（对象）作为路由的 query
     * 进行重定向。
     */
    query() {
      // 为了让输出的 url 更简洁，默认选项不显示出来
      const vm = this;
      const filter = {};
      if (!vm.filter) return;
      Object.keys(vm.filter).forEach(key => {
        if (vm.filter[key]) filter[key] = vm.filter[key];
      });
      vm.$router.replace({ query: filter });
    },
    getDistrict(zipCode = 86) {
      return this.$root.areaData[zipCode] || [];
    },
    getDistrictNameByCode(zipCode) {
      const data = this.$root.areaData;
      const parentCode = this.getDistrictParentCode(zipCode);
      return parentCode && data[parentCode][zipCode];
    },
    getDistrictParentCode(zipCode) {
      if (zipCode % 10000 === 0) return 86;
      if (zipCode % 100 === 0) return zipCode - zipCode % 10000;
      return zipCode - zipCode % 100;
    },
    getUrlFromRoute(route, absolute = true) {
      const vm = this;
      // let path = vm.$router.stringifyPath(route);
      let path = vm.$router.resolve(route).href;
      if (vm.$router.mode === 'hash') {
        if (vm.$router.history.hashbang) {
          path = `!${path}`;
        }
        path = `#${path}`;
      }
      if (absolute) {
        // finally we add the absolute prefix before that
        if (path[0] === '#') {
          // hash mode join
          path = `${location.origin}${location.pathname}${location.query || ''}${path}`;
        } else if (path[0] === '/') {
          // absolute path
          path = `${location.origin}${path}`;
        } else {
          // relative path
          path = `${location.origin}${location.pathname.replace(/\/[^/]+$/, '/')}${path}`;
        }
      }
      return path;
    },
    trim(str) {
      return str.replace(/^\s+|\s+$/g, '');
    },
    toCamel(str) {
      return str.replace(
        /([-_][a-z])/g,
        $1 => $1.toUpperCase().substr(1)
      ).replace(/^[a-z]/);
    },
    toDash(str) {
      return str.replace(
        /([A-Z])/g,
        $1 => `-${$1.toLowerCase()}`
      ).replace(/^-/, '');
    },
    toUnderscore(str) {
      return str.replace(
        /([A-Z])/g,
        $1 => `_${$1.toLowerCase()}`
      ).replace(/^_/, '');
    },
  },
};


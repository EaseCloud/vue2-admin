// Mixins

import areaData from 'china-area-data';
import Loading from 'vue-spinner/src/ScaleLoader.vue';
import dateformat from 'dateformat';

import * as common from './components/_common';
import * as controls from './components/_control';
import * as modules from './components/_modules';
import api from './resource/api';
import utils from './utils';

import choices from '../config/choices';
import config from '../config/config';

export default {
  mounted() {
    // Auto reload
    if (this.reload) {
      // console.log('mounted Reload', this.$route.name);
      this.reload();
    }
  },
  components: { Loading, ...common, ...controls, ...modules },
  computed: {
    utils() {
      return utils;
    },
    choices() {
      return choices;
    },
    areaData() {
      return config.area_data || areaData;
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
    date(value, fmt = 'yyyy-mm-dd HH:MM:ss') {
      try {
        let val = value;
        if (/^\d\d\d\d-\d\d-\d\d \d\d:\d\d(:\d\d)?$/.test(val)) {
          // http://stackoverflow.com/q/13363673/2544762
          const date = new Date(value.replace(' ', 'T'));
          // timezone convert
          val = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
          );
        }
        return dateformat(val, fmt);
      } catch (e) {
        return value;
      }
    },
  },
  methods: {
    api(model = this.model, api_root = this.api_root || config.api_root) {
      return api(model, api_root);
    },
    authenticate(reload = false) {
      const vm = this.$root;
      // 可以从 config 函数钩出这个处理方法
      if (typeof(vm.config.action_authenticate) === 'function') {
        return vm.config.action_authenticate.apply(vm, [reload]);
      }
      if (vm.me && !reload) return Promise.resolve(vm.me);
      // debugger; // eslint-disable-line
      return api('User').get({ action: 'current' }).then(resp => {
        vm.current_user = resp.data;
        return vm.me;
      });
    },
    doAction(func, params) {
      const vm = this;
      func.apply(vm, params);
    },
    login(username, password) {
      const vm = this.$root;
      if (vm.config.action_login) {
        return vm.config.action_login.apply(vm, [username, password]);
      }
      return api('User').save(
        { action: 'login' },
        { username, password }
      ).then(resp => {
        vm.current_user = resp.data;
        if (!vm.me.is_staff) {
          vm.notify('用户不具备管理员权限');
        } else {
          vm.$router.push({ name: 'main' });
        }
        return vm.me;
      });
    },
    change_password(password_old, password_new) {
      const vm = this.$root;
      if (vm.config.action_change_password) {
        return vm.config.action_change_password.apply(vm, [password_old, password_new]);
      }
      return api('User').save(
        { action: 'change_password' },
        { password_old, password_new }
      ).then(resp => {
        return vm.me;
      });
    },
    logout() {
      const vm = this.$root;
      // 可以从 config 函数钩出这个处理方法
      if (typeof(vm.config.action_logout) === 'function') {
        return vm.config.action_logout.apply(vm, []);
      }
      return api('User').get({ action: 'logout' }).then(() => {
        vm.current_user = null;
        vm.$router.push({ name: 'passport_login' });
      });
    },
    updateModel(model, id, field, value, notify = '操作成功', callback = null) {
      const vm = this;
      return api(model).patch({ id }, { [field]: value }).then(resp => {
        const item = resp.data;
        if (notify) vm.$message.success(notify);
        if (callback) callback(item);
      });
    },
    deleteModel(model, id, confirm = '确认删除此对象？', notify = '操作成功', callback = null) {
      const vm = this;
      const promise = confirm ? this.confirm(confirm) : Promise.resolve();
      return promise.then(() => {
        api(model).delete({ id }).then(() => {
          if (notify) vm.$message.success(notify);
          if (callback) callback();
        });
      });
    },
    // /**
    //  * 这个方法会默认将当前 vm 的 this.filter 数据（对象）作为路由的 query
    //  * 进行重定向。
    //  */
    // query() {
    //   // 为了让输出的 url 更简洁，默认选项不显示出来
    //   const vm = this;
    //   const filter = {};
    //   if (!vm.filter) return;
    //   Object.keys(vm.filter).forEach(key => {
    //     if (vm.filter[key]) filter[key] = vm.filter[key];
    //   });
    //   vm.$router.replace({ query: filter });
    // },
    /**
     * 返回区划号码的一个前缀
     * @param district
     * @param length
     */
    areaPrefix(district, length = 6) {
      return Number((`${district.toString().substr(0, length)}000000`).substr(0, 6));
    },
    getDistrict(adcode = 86) {
      return this.$root.areaData[adcode] || [];
    },
    getDistrictFullNameByCode(zipCode) {
      const vm = this;
      return zipCode ?
        `${vm.getDistrictNameByCode(vm.areaPrefix(zipCode, 2))} ` +
        `${vm.getDistrictNameByCode(vm.areaPrefix(zipCode, 4))} ` +
        `${vm.getDistrictNameByCode(zipCode)}` : '';
    },
    getDistrictNameByCode(adcode) {
      const data = this.$root.areaData;
      const parentCode = this.getDistrictParentCode(adcode);
      return parentCode && data[parentCode][adcode];
    },
    getDistrictParentCode(adcode) {
      if (adcode % 10000 === 0) return 86;
      if (adcode % 100 === 0) return adcode - adcode % 10000;
      return adcode - adcode % 100;
    },
    getUrlFromRoute(route, absolute = true) {
      const vm = this;
      // let path = vm.$router.stringifyPath(route);
      let path = vm.$router.resolve(route).href;
      if (vm.$router.mode === 'hash') {
        if (vm.$router.history.hashbang) {
          path = `!${path}`;
        }
        if (path[0] !== '#') path = `#${path}`;
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
    // Naming utils
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
    getChoiceText(choice, value, fieldText = 'text', fieldValue = 'value') {
      const vm = this;
      let result = null;
      const obj = choice.filter(
        opt => (vm.getProperty(opt, fieldValue) || '').toString() === (value || '').toString()
      )[0];
      return obj ? vm.getProperty(obj, fieldText) : null;
    },
    // View utils
    getColValue(col, item) {
      // console.log(
      //   'getColValue',
      //   JSON.parse(JSON.stringify(col)),
      //   JSON.parse(JSON.stringify(item)),
      // );
      const vm = this;
      let value = item;
      try {
        if (col.key) {
          const colKey = vm.evaluate(col.key, item);
          value = vm.getProperty(item, colKey);
        }
        if (col.filter) {
          value = col.filter.apply(vm, [value, item]);
        }
        if (col.mapper) {
          const colMapper = vm.evaluate(col.mapper, item);
          value = ((value in colMapper) ? colMapper[value] :
              colMapper.__else__) || null;
        }
      } catch (e) {
        console.warn(e);
      }
      return value;
    },
    getProperty(item, keyStr) {
      // 缺省 keyStr 的时候直接返回 item
      if (!keyStr) return item;
      // 执行 keyStr 级联求值
      let value = item;
      if (typeof (keyStr || '') !== 'string') {
        console.warn('getProperty 属性的 key 取值不规范');
        console.log('keyStr:', keyStr);
        console.log('item:', item);
      }
      keyStr.split('.').forEach(key => {
        try {
          value = value && value[key] || null;
        } catch (e) {
          console.error('getProperty 求值错误', e);
        }
      });
      return value;
    },
    /**
     * 执行一个函数，简单可以理解为返回 self[keyStr](value)
     * 如果 keyStr 为空，上面的调用中用 self 直接替代 self[keyStr]
     * 如果 self[keyStr] 或者 self 不是一个函数，直接返回之
     * 在 self[keyStr] 这个函数里面，this 指向当前 vm 实例
     * @param self
     * @param item
     * @param keyStr
     * @returns {*}
     */
    evaluate(self, item, keyStr) {
      const vm = this;
      if (keyStr && typeof keyStr !== 'string') {
        console.warn('evaluate 指定的 field 无效，应为一个字符串');
        return vm.evaluate(self, '', item);
      }
      const obj = keyStr ? vm.getProperty(self, keyStr) : self;
      // TODO: 存在缺陷待调试
      // return obj instanceof Function ? obj.apply(vm, [item]) : obj;
      return obj instanceof Function ? obj(item) : obj;
    },
    setQueryKey(key, value) {
      const vm = this;
      vm.$router.replace({
        query: Object.assign(vm.$route.query, { [key]: value }),
      });
      vm.reload();
    },
    removeQueryKey(key) {
      const vm = this;
      const query = { ...vm.$route.query };
      delete query[key];
      vm.$router.replace({ query });
      vm.reload();
    },
    dateformat(date, format='yyyy-mm-dd') {
      return dateformat(date, format);
    },
    echo(obj) {
      console.log(obj);
    },
  },
};

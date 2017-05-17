<template>

  <div id="app">
    <router-view></router-view>
    <notifier-registry ref="notifier"/>
    <geo-picker-registry ref="geopicker"/>
    <div class="block-loading" v-if="loading.counter > 0">
      <loading :loading="loading.counter > 0"
               :color="loading.color"></loading>
    </div>
  </div>

</template>

<script type="text/babel">
  // Mixins

  //  import Deferred from 'es6-deferred';
  //  import * as controls from '../components/_control';
  //  import * as modules from '../components/_modules';
  //  import * as api from '../resource/api';
  import config from '../../config/config';

  // Root component
  export default {
//    route: { canReuse: false },
    data() {
      return {
        current_user: config.current_user || null,
        hide_sidebar: !!localStorage.getItem('hide_sidebar'),
        loading: {
          counter: 0,
          color: '#545F71',
          size: 64,
        },
        pager: {
          page_count: 0,
          page: 1,
          page_size: 10,
        },
      };
    },
    methods: {
      toggleSidebar() {
        const vm = this;
        vm.hide_sidebar = !vm.hide_sidebar;
        localStorage.setItem('hide_sidebar', vm.hide_sidebar ? '1': '');
      },
    },
  };
</script>

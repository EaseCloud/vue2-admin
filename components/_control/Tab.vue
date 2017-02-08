<template>
  <div class="ant-tabs ant-tabs-top ant-tabs-line"
       :class="{'ant-tabs-mini': size==='small'}">
    <div role="tablist" class="ant-tabs-bar" tabindex="0">
      <div class="ant-tabs-nav-container">
        <div class="ant-tabs-nav-wrap">
          <div class="ant-tabs-nav-scroll">
            <!-- 数组形式 -->
            <div class="ant-tabs-nav" v-if="tabs.length">
              <template v-for="tab in tabs">
                <div :class="{'ant-tabs-tab-active': tab.name===current}"
                     @click="switchTo(tab)"
                     v-if="!tab.hidden"
                     class=" ant-tabs-tab">
                  <span>{{tab.title}}</span>
                </div>
              </template>
            </div>

            <!-- 对象形式 -->
            <div class="ant-tabs-nav" v-else>
              <template v-for="(key, tab) in tabs">
                <div :class="{'ant-tabs-tab-active': key===current}"
                     @click="switchTo(tab)"
                     v-if="!tab.hidden"
                     class=" ant-tabs-tab">
                  <span>{{tab.title}}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
  import Vue from 'vue';
  import VueRouter from 'vue-router';

  Vue.use(VueRouter);

  export default {
    props: ['tabs', 'current', 'size'],
    methods: {
      switchTo(tab) {
        const vm = this;
        const link = JSON.parse(JSON.stringify(tab.link));
        // 将 tab.link 的 query 参数与当前的 query 参数合并
        link.query = Object.assign({ ...(vm.$route.query || {}) }, link.query || {});
        vm.$router.replace(link);
      },
    },
  };
</script>

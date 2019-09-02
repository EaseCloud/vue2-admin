<template>

  <div>

    <header class="page-header">
      <h3 class="page-header-title">{{title}}</h3>
      <h4 class="page-header-subtitle">{{subtitle}}</h4>
      <slot name="page-header-menu"></slot>
      <div class="tooltips">
        <slot name="menu"></slot>
        <!-- 动态动作按钮 -->
        <template v-for="action in actions">
          <v-button
            v-show="!action.isVisible || action.isVisible(item)"
            :type="action.buttonClass || 'ghost'"
            @click="action.action.apply($parent, [item])">
            {{action.title}}
          </v-button>
          <span><!-- 防止按钮之间粘住 --></span>
        </template>
        <v-button type="ghost" @click="back()">返回</v-button>
      </div>
    </header>

    <section class="page-body">
      <slot></slot>
    </section>

  </div>

</template>

<script>
import api from '../../resource/api';

export default {
  props: {
    id: Number,
    title: String,
    subtitle: String,
    actions: Array,
    options: {
      type: Object,
      default: {
      },
    },
  },
  data () {
    const vm = this;
    return {
    };
  },
  methods: {
    reload () {
    },
  },
};
</script>


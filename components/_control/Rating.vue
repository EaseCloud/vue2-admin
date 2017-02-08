<template>
  <section class="code-box-demo">
    <ul class="ant-rate ">
      <li class="ant-rate-star"
          @mouseleave="preview=null"
          @mouseover="setPreview(star, $event)"
          @click="setScore(star, $event)"
          :class="{
          'ant-rate-star-full': sc >= star,
          'ant-rate-star-half': sc >= star -0.5 && sc < star,
          'ant-rate-star-zero': sc < star -0.5
          }"
          v-for="star in [1,2,3,4,5]">
        <div class="ant-rate-star-content"
             @click="setScore(star-0.5, $event)"
             @mouseover="setPreview(star-0.5, $event)"></div>
      </li>
    </ul>
  </section>
</template>

<script lang="babel">
  export default {
    data() {
      return {
        preview: null,
      };
    },
    computed: {
      sc() {
        return this.preview === null ? this.score : this.preview;
      },
    },
    props: ['score', 'readonly'],
    methods: {
      setPreview(value, $event) {
        const vm = this;
        if (vm.readonly) return;
        vm.preview = value;
        $event.stopPropagation();
      },
      setScore(value, $event) {
        const vm = this;
        if (vm.readonly) return;
        vm.score = value;
        $event.stopPropagation();
        vm.$emit('change', value);
      },
    },
  };
</script>

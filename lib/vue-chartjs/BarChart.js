import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: ['options'],
  mounted() {
    // this.chartData is created in the mixin
    // this.renderChart(this.chartData, this.options);
  },
  methods: {
    doRender() {
      console.log(this.chartData);
      this.renderChart(this.chartData, this.options);
    },
  },
};

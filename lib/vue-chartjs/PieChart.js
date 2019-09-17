import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  props: ['options'],
  mounted() {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options);
  },
};

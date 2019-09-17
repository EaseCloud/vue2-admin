import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options);
  },
};

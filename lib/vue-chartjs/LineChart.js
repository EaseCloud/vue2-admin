import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default Line.extend({
  data() {
    return {
      chartData: null,
    };
  },
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options);
  },
});

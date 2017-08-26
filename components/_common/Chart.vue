<template>
  <div id="line-container">
    <header class="page-header">
      <h3 class="page-header-title">{{title}}</h3>
      <h4 class="page-header-subtitle">{{subtitle}}</h4>
      <div class="tooltips">
        <v-button v-if="show_refresh" @click="filter" type="primary">刷新</v-button>
        <template v-for="action in listActions">
          <v-button v-if="(action.htmlType||'button')==='button'"
                    @click="doAction(action.action)"
                    :type="action.buttonClass || 'ghost'">{{action.title}}</v-button>
        </template>
        <v-button type="ghost" @click="$router.back()">返回</v-button>
      </div>
    </header>

    <section class="page-body">
      <v-row :gutter="6"
             type="flex"
             v-if="show_date"
             style="margin: 4px 0">
        <v-col :span="6" class="ant-form-item-label" style="padding: 0">
          <label>請選擇時間區間</label>
        </v-col>
        <v-col :span="8" class="ant-form-item-control">
          <v-date-picker v-model="duration"
                         :range="true"
                         :clearable="true"
                         format="yyyy-MM-dd"
          ></v-date-picker>
          <v-button type="primary" @click="filter">搜索</v-button>
        </v-col>
      </v-row>
      <div class="small">
        <bar-chart
          v-if="chart_type==='bar'"
          :chart-data="datacollection"
          :options="options"></bar-chart>
        <line-chart
          v-if="chart_type==='line'"
          :chart-data="datacollection"
          :options="options"></line-chart>
      </div>
    </section>

  </div>
</template>

<script lang="babel">
  import BarChart from '../../lib/vue-chartjs/BarChart';
  import LineChart from '../../lib/vue-chartjs/LineChart';

  export default {
    components: {
      BarChart,
      LineChart,
    },
    props: {
      title: String,
      subtitle: String,
      chart_type: String,
      show_date: {
        type: Boolean,
        default: true,
      },
      show_refresh: {
        type: Boolean,
        default: false,
      },
      actions: Array,
      listActions: Array,
    },
    data() {
      return {
        duration: '',
        labels: [],
        amounts: [],
        datasets: [],
        datacollection: null,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true,
              },
            }],
            xAxes: [{
              gridLines: {
                display: false,
              },
            }],
          },
          legend: {
            display: true,
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      };
    },
    mounted() {
      this.fillData();
    },
    methods: {
      fillData() {
        const vm = this;
        this.datacollection = {
          labels: vm.labels,
          datasets: vm.datasets,
        };
      },
      filter() {
        const vm = this;
        let promise = [];
        vm.datasets = [];
        console.log(vm.actions);
        vm.actions.forEach(item => {
          promise.push(vm.api(item.model).get({
            action: item.action,
            time_begin: vm.duration[0],
            time_end: vm.duration[1],
            ...item.params,
          }).then(resp => {
            vm.labels = resp.data.labels;
            vm.datasets.push({
              label: item.datasets.label,
              data: resp.data.amounts,
              borderColor: item.datasets.borderColor,
              pointBackgroundColor: item.datasets.pointBackgroundColor,
              borderWidth: 1,
              pointBorderColor: '#ffffff',
            });
          }));
        });
        Promise.all(promise).then(() => {
          vm.fillData();
        });
      },
    },
  };
</script>

<style scoped lang="less" rel="stylesheet/less">
  .small {
    max-width: 1200px;
    margin: 100px auto;
  }
</style>

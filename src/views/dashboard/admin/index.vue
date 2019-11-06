<template>
  <div class="dashboard-editor-container">
    <panel-group></panel-group>
    <!--<el-row :gutter="32">-->
    <!--<el-col :xs="24" :sm="24" :lg="12">-->
    <!--<div class="chart-wrapper">-->
    <!--<bar-chart></bar-chart>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-col :xs="24" :sm="24" :lg="12">-->
    <!--<div class="chart-wrapper">-->
    <!--<bar-chart2></bar-chart2>-->
    <!--</div>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:100px;margin-top: 80px">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>

  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import BarChart2 from './components/BarChart2'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import {
  getCountLog
} from '@/api/journalManage/journalSearch/index';

export default {
  mounted(){
    this.getCountLog();
  },
  name: 'dashboard-admin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    BarChart2,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: {}
    }
  },
  methods: {
    getCountLog(){
      getCountLog().then((response)=>{
       this.lineChartData = response
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>

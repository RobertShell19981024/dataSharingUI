<template>
  <div>
    <p style="text-align:center;font-size:20px;font-weight:bold">近一周内的访问次数统计</p>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="日期">
      </el-table-column>
      <el-table-column prop="name" label="API名称">
      </el-table-column>
      <el-table-column prop="accessCount" label="访问次数">
      </el-table-column>
      <el-table-column prop="accessSuccess" label="访问成功次数">
      </el-table-column>
      <el-table-column prop="accessFail" label="访问失败次数">
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="1000">
    </el-pagination>
  </div>
</template>
<script>
  import LineChart from './LineChart'
  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145]
    }
  }
  export default {
    components: {
      LineChart
    },
    data() {
      return {
        tableData: [{
          date: '2018-10-18',
          name: '宿迁智慧不动产',
          accessCount: 20,
          accessSuccess: 10,
          accessFail: 10
        }, {
          date: '2018-10-16',
          name: '徐州数据整合及不动产项目',
          accessCount: 20,
          accessSuccess: 10,
          accessFail: 10
        }, {
          date: '2018-10-18',
          name: '宿迁智慧不动产',
          accessCount: 20,
          accessSuccess: 10,
          accessFail: 10
        }, {
          date: '2018-10-14',
          name: '徐州数据整合及不动产项目',
          accessCount: 20,
          accessSuccess: 10,
          accessFail: 10
        }, {
          date: '2018-10-15',
          name: '徐州数据整合及不动产项目',
          accessCount: 20,
          accessSuccess: 10,
          accessFail: 10
        }, {
          date: '2018-10-10',
          name: '宿迁智慧不动产',
          accessCount: 20,
          accessSuccess: 10,
          accessFail: 10
        }, {
          date: '2018-10-11',
          name: '铜山不动产',
          accessCount: 20,
          accessSuccess: 10,
          accessFail: 10
        }],
        lineChartData: lineChartData.newVisitis
      };
    },
    methods: {

    }
  };
</script>
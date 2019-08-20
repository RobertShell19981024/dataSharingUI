<template>
    <div>
      <p style="text-align:center;font-size:20px;font-weight:bold">近一周内的通知次数统计</p>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData"></line-chart>
      </el-row>
  
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="日期">
        </el-table-column>
        <el-table-column prop="name" label="发送机构">
        </el-table-column>
        <el-table-column prop="accessCount" label="接收机构">
        </el-table-column>
        <el-table-column prop="accessSuccess" label="接口机构URL">
        </el-table-column>
        <el-table-column prop="accessFail" label="最后一次发送时间">
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
            name: '登记部门',
            accessCount: '交易部门',
            accessSuccess: 'http://www.sqlmr.com.cn/noticeReceive',
            accessFail: '2018-09-28 14:11:14'
          }, {
            date: '2018-10-16',
            name: '交易部门',
            accessCount: '登记部门',
            accessSuccess: 'http://www.sqlmr.com.cn/noticeReceive',
            accessFail: '2018-09-28 14:11:14'
          }, {
            date: '2018-10-17',
            name: '登记部门',
            accessCount: '民政部门',
            accessSuccess: 'http://www.sqlmr.com.cn/noticeReceive',
            accessFail: '2018-09-28 14:11:14'
          }, {
            date: '2018-10-15',
            name: '交易部门',
            accessCount: '登记部门',
            accessSuccess: 'http://www.sqlmr.com.cn/noticeReceive',
            accessFail: '2018-09-28 14:11:14'
          }, {
            date: '2018-10-14',
            name: '民政部门',
            accessCount: '登记部门',
            accessSuccess: 'http://www.sqlmr.com.cn/noticeReceive',
            accessFail: '2018-09-28 14:11:14'
          }, {
            date: '2018-05-12',
            name: '交易部门',
            accessCount: '民政部门',
            accessSuccess: 'http://www.sqlmr.com.cn/noticeReceive',
            accessFail: '2018-09-28 14:11:14'
          }, {
            date: '2018-05-11',
            name: '交易部门',
            accessCount: '登记部门',
            accessSuccess: 'http://www.sqlmr.com.cn/noticeReceive',
            accessFail: '2018-09-28 14:11:14'
          }],
          lineChartData: lineChartData.newVisitis
        };
      },
      methods: {
  
      }
    };
  </script>
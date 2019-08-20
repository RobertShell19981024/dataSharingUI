<template>
    <div>
      <div style="margin-top:10px;margin-left:10px">
        <span>可查询接口列表:</span>
        <el-select v-model="selectedApi" placeholder="请选择">
          <el-option v-for="item in apiList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
  
      <el-table :data="apiBaseData" :show-header="false" border style="width: 90%;margin-left:10px;margin-top:10px">
        <el-table-column prop="name">
        </el-table-column>
        <el-table-column prop="value">
        </el-table-column>
      </el-table>
  
      <el-table :data="apiHeaderData" border style="width: 90%;margin-left:10px;margin-top:10px">
        <el-table-column prop="headerName" label="headerKey">
        </el-table-column>
        <el-table-column prop="validateReg" label="校验规则">
        </el-table-column>
        <el-table-column prop="note" label="header说明">
        </el-table-column>
      </el-table>
  
      <el-table :data="apiBodyData" border style="width: 90%;margin-left:10px;margin-top:10px">
        <el-table-column prop="key" label="jsonKey">
        </el-table-column>
        <el-table-column prop="validateReg" label="校验规则">
        </el-table-column>
        <el-table-column prop="note" label="key值说明">
        </el-table-column>
      </el-table>
  
  
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          apiList: [{
            value: '1',
            label: '铜山不动产点对点'
          }, {
            value: '2',
            label: '宿迁接口API'
          }],
          selectedApi: '',
          apiBaseData: [{
            name: 'API名称',
            value: '铜山不动产点对点'
          }, {
            name: 'API基础path',
            value: 'http://www.xztsbdc.com'
          }, {
            name: '接口地址',
            value: '/getInfo'
          }, {
            name: '接口方法',
            value: 'post'
          }, {
            name: '接口状态',
            value: '启用中'
          }],
          apiHeaderData: [{
            headerName: 'Authorization',
            validateReg: '\d{1}',
            note: '此项必须是纯数字'
          }, {
            headerName: 'Cookie',
            validateReg: '\d{1}',
            note: '此项必须是纯数字'
          }],
          apiBodyData: [{
            key: 'name',
            validateReg: '.{1,}',
            note: '非空'
          }, {
            key: 'age',
            validateReg: '\d{1}',
            note: '此项必须是纯数字'
          }, {
            key: 'height',
            validateReg: '\d{1}',
            note: '此项必须是纯数字'
          }, {
            key: 'key4',
            validateReg: '\d{1}',
            note: '此项必须是纯数字'
          }, {
            key: 'key5',
            validateReg: '\d{1}',
            note: '此项必须是纯数字'
          }, {
            key: 'key6',
            validateReg: '\d{1}',
            note: '此项必须是纯数字'
          }]
        };
      },
      methods: {
  
      }
    };
  </script>
<template>
  <div class="corp-info">
    <div class="app-container calendar-list-container" style="margin-top: 50px;margin-left: 50px;margin-right: 50px">
      <div class="filter-container">
        <el-row>
          <el-col :span="4" :offset="20">
            <div class="grid-content bg-purple-light">
              <el-button class="filter-item" type="primary" style="width: 200px;font-size: 18px;" icon="el-icon-edit"
                @click="dialogFormVisible=true">编辑基础信息</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" border :stripe="false" fit style="width: 100%;" :show-header="false" :cell-style="cellStyle"
        :row-style="rowStyle" :span-method="arraySpanMethod">
        <el-table-column align="center" prop="keytype" label="列名" style="width: 50%;">
        </el-table-column>
        <el-table-column align="center" prop="explain" label="数值" style="width: 50%;">
        </el-table-column>
      </el-table>
      <el-dialog title="修改机构信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="机构名" :label-width="formLabelWidth">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="机构地址" :label-width="formLabelWidth">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="机构电话" :label-width="formLabelWidth">
            <el-input v-model="form.telPhone"></el-input>
          </el-form-item>
          <el-form-item label="机构简介" :label-width="formLabelWidth">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="generateCorpBaseInfo">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    getCorpBaseInfo,
    updateCorpBaseInfo
  } from "@/api/baseInfo/corpInfo/index";

  export default {

    data() {
      return {
        form: {
          name: undefined,
          address: undefined,
          telPhone: undefined,
          description: undefined
        },
        formLabelWidth: '120px',
        dialogFormVisible: false,
        tableData: [],
        userLoginname: ''
      };
    },
    created() {
      this.getList();
    },
    methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (rowIndex != 0) {
          if (columnIndex === 0) { // 第1列样式
            return "font-size: 35px;height:100px";
          } else if (columnIndex === 1) {// 第2列样式
            return "font-size: 18px;height:100px";
          }
        }
      },
      rowStyle({ row, rowIndex }) {
        if (rowIndex === 0) {
          return "font-size: 50px;height:100px;font-weight: bold";
        } else {
          return "height:100px"
        }

      },
      getList() {
        //获取后台生成的信息显示在界面
        getCorpBaseInfo().then(rsp => {
          let rsp_data = rsp.data;
          this.form = rsp.data;
          this.userLoginname = rsp_data.username;
          this.tableData.push
            ({
              keytype: "机构基础信息",
            });
          this.tableData.push
            ({
              keytype: "登录名",
              explain: rsp_data.username,

            });
          this.tableData.push({
            keytype: "机构名称（全称）",
            explain: rsp_data.name,

          });
          this.tableData.push({
            keytype: "机构详细地址",
            explain: rsp_data.address,

          });

          this.tableData.push({
            keytype: "机构电话",
            explain: rsp_data.telPhone,

          });
          this.tableData.push({
            keytype: "机构简介",
            explain: rsp_data.description,

          });
        });
      },

      generateCorpBaseInfo() {
        updateCorpBaseInfo(this.form)
          .then(rsp => {
            this.dialogFormVisible = false;
            //填写通知地址显示在前端时先清除之前的显示
            this.tableData = [];
            let rsp_data = rsp.data;
            this.tableData.push
              ({
                keytype: "机构基础信息",


              });
            this.tableData.push
              ({
                keytype: "登录名",
                explain: this.userLoginname,

              });
            this.tableData.push({
              keytype: "机构名称（全称）",
              explain: rsp_data.name,

            });
            this.tableData.push({
              keytype: "机构详细地址",
              explain: rsp_data.address,

            });

            this.tableData.push({
              keytype: "机构电话",
              explain: rsp_data.telPhone,

            });
            this.tableData.push({
              keytype: "机构简介",
              explain: rsp_data.description,

            });

          })
          .catch(rsp => { });

      }
    }
  };
</script>
<style>
  .corp-info .el-table .cell {
    line-height: 50px;
  }

  .corp-info .el-row {
    margin-bottom: 20px;
  }

  .corp-info .el-col {
    border-radius: 4px;
  }

  .corp-info .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .corp-info .row-bg {
    padding: 10px 0;
  }
</style>
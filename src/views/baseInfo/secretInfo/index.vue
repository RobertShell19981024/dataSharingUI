<template>
  <div class="app-container calendar-list-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" style="width: 200px;" icon="edit" @click="generateKeys">显示选择语言密钥</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" prop="keytype" label="密钥类型">
      </el-table-column>
      <el-table-column align="center" prop="explain" label="说明">
      </el-table-column>
      <el-table-column align="center" prop="value" label="密钥值">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {
    getUserSecretKey,
    updateUserSecretKey
  } from "@/api/baseInfo/secretInfo/index";

  export default {

    data() {
      return {
        options: [
          {
            value: 0,
            label: "java语言"
          },
          {
            value: 1,
            label: "其他语言"
          }
        ],
        value: "",
        tableData: []
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //获取后台生成的密钥显示在界面
        getUserSecretKey().then(rsp => {
          let rsp_data = rsp.data;
          this.tableData.push({
            keytype: "机构签名私钥",
            explain: "机构签名私钥(corpSignPrikey)用于对发送的数据进行签名，从而可以鉴别真正的用户是否为本机构。",
            value: rsp_data.signSecretKey
          });
          this.tableData.push({
            keytype: "数据加密密钥",
            explain: "数据加密密钥(dataSecretKey)是用于对数据进行对称加密的密钥，保障数据安全性。",
            value: rsp_data.symmetricPubkey
          });
          this.tableData.push({
            keytype: "身份标识",
            explain: "身份标识(userID)是一串无规则的字符串，唯一的标识一个用户。",
            value: rsp_data.userIdentityId
          });
          this.tableData.push({
            keytype: "平台签名公钥",
            explain: "平台签名公钥(platformSignPubKey)用于接收信息时验证平台的身份，如果数据是通过平台生成的签名，那么只有公钥才能验签成功。",
            value: rsp_data.workBenchPubkey
          });
          this.tableData.push({
            keytype: "平台路由地址",
            explain: "平台路由地址(platformBaseUrl)是真正用于接口转发的程序，负责所有安全接口的验签、加密等操作。",
            value: rsp_data.routerSafeURL
          });
        });
      },
      //重新生成密钥
      generateKeys() {

          let select_type = this.value == 0 ? true : false; // 0 --代表的java语言 , 1--其他语言
          if (this.value === 0 || this.value === 1) {
            updateUserSecretKey({ langType: select_type })
              .then(rsp => {
                //重新生成密钥后显示在前台时先清除之前的显示
                this.tableData = [];
                let rsp_data = rsp.data;
                this.tableData.push({
                  keytype: "机构签名私钥",
                  explain: "机构签名私钥(corpSignPrikey)用于对发送的数据进行签名，从而可以鉴别真正的用户是否为本机构。",
                  value: rsp_data.signSecretKey
                });
                this.tableData.push({
                  keytype: "数据加密密钥",
                  explain: "数据加密密钥(dataSecretKey)是用于对数据进行对称加密的密钥，保障数据安全性。",
                  value: rsp_data.symmetricPubkey
                });
                this.tableData.push({
                  keytype: "身份标识",
                  explain: "身份标识(userID)是一串无规则的字符串，唯一的标识一个用户。",
                  value: rsp_data.userIdentityId
                });
                this.tableData.push({
                  keytype: "平台签名公钥",
                  explain: "平台签名公钥(platformSignPubKey)用于接收信息时验证平台的身份，如果数据是通过平台生成的签名，那么只有公钥才能验签成功。",
                  value: rsp_data.workBenchPubkey
                });
                this.tableData.push({
                  keytype: "平台路由地址",
                  explain: "平台路由地址(platformBaseUrl)是真正用于接口转发的程序，负责所有安全接口的验签、加密等操作。",
                  value: rsp_data.routerSafeURL
                });
                this.$message({
                  type: 'success',
                  message: '更新成功!'
                });
              }).catch(rsp => { });
          } else {
            this.$alert("请选择一种语言", "提示", {
              confirmButtonText: "确定"
            });
          }
      }
    }
  };
</script>
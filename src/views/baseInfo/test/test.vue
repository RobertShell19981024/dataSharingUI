<template>
  <div class="notice-info">
    <div class="app-container calendar-list-container" style="margin-top: 30px;margin-left: 50px;margin-right: 50px">
      <!-- <div align="center" style="border:1px solid black"><img src="../../../assets/noticeinfo.png" height="50%" width="50%"></div> -->
      <div class="demo-form-inline">
        <el-row>
          <div style="font-size: 50px;height:100px;font-weight: bold;margin-left: 50%;">通知基础信息</div>
          <el-col :span="4" :offset="20">
            <div class="grid-content bg-purple-light">
              <el-button class="filter-item" type="primary" style="width: 200px;font-size: 18px;margin-top: 10%;"
                icon="el-icon-edit" @click="dialogFormVisible=true">填写通知地址</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" border :stripe="false" fit style="width: 100%;margin-top: 35px;" :show-header="false"
        :cell-style="cellStyle" :row-style="rowStyle" :span-method="arraySpanMethod">
        <el-table-column align="center" prop="keytype" label="通知配置说明" style="width: 50%">
        </el-table-column>
        <el-table-column align="center" prop="explain" label="配置地址是为了显示此用户的配置信息" style="width: 50%">
        </el-table-column>
      </el-table>
      <el-dialog title="通知地址" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="通知地址" prop="noticePath" :label-width="formLabelWidth">
            <el-input v-model="form.noticePath" placeholder="请输入基础URL(例如:http://192.168.1.1:8080/test)"
              autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否加密" prop="method" :label-width="formLabelWidth">
            <el-select v-model="form.method" placeholder="请选择">
              <el-option label="非加密" value="get"></el-option>
              <el-option label="加密" value="post"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型ID" prop="typeID" :label-width="formLabelWidth">
            <el-select v-model="form.typeID" placeholder="请选择">
              <el-option label="步骤一" value="ZTGEO_NOTICE_1"></el-option>
              <el-option label="步骤二" value="ZTGEO_NOTICE_2"></el-option>
              <el-option label="步骤三" value="ZTGEO_NOTICE_3"></el-option>
              <el-option label="步骤四" value="ZTGEO_NOTICE_4"></el-option>
              <el-option label="步骤五" value="ZTGEO_NOTICE_5"></el-option>
              <el-option label="步骤六" value="ZTGEO_NOTICE_6"></el-option>
              <el-option label="步骤七" value="ZTGEO_NOTICE_7"></el-option>
              <el-option label="步骤八" value="ZTGEO_NOTICE_8"></el-option>
              <el-option label="步骤九" value="ZTGEO_NOTICE_9"></el-option>
              <el-option label="步骤十" value="ZTGEO_NOTICE_10"></el-option>
              <el-option label="步骤十一" value="ZTGEO_NOTICE_11"></el-option>
              <el-option label="步骤十二" value="ZTGEO_NOTICE_12"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="createOrUpdate==true" type="primary" @click="generateBaseInfo('form')">确 定</el-button>
          <el-button v-else type="primary" @click="addBaseInfo('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    page,
    updateBaseInfo,
    selectNoticeBaseInfoByUserid,
    insertNoticeBaseInfo
  } from "@/api/baseInfo/noticeBaseInfo/index";

  export default {

    data() {// URL 校验
      let urlValidate = (rule, value, callback) => {
        // url 正则，匹配http或https开头,host为IP:端口或域名:端口,不允许携带任何后缀
        let base_url_reg = new RegExp('^((https|http)?://)(([0-9]{1,3}.){3}[0-9]{1,3})(:[0-9]{1,5})(?!.)|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6}(:[0-9]{1,5})?(?!.)$');
        if (value === '' || value === undefined) {
          callback(new Error('请输入URL'));
        } else if (!base_url_reg.test(value)) {
          callback(new Error('URL格式错误，请检查格式(例:http://10.10.10.10:8080)'));
        } else {
          callback();
        }
      };
      return {
        form: {
          noticePath: undefined,
          method: ''
        },
        rules: {
          noticePath: [
            {
              required: true,
              trigger: 'blur',
              validator: urlValidate
            }
          ],
          method: [
            {
              required: true,
              message: '请选择加密方式'
            }
          ]
        },
        formLabelWidth: '120px',
        dialogFormVisible: false,
        tableData: [],
        createOrUpdate: ''
      };
    },
    created() {
      this.getList();
      selectNoticeBaseInfoByUserid().then(rsp => {
        let rsp_data = rsp.data;
        this.createOrUpdate = rsp_data;
      });
    },
    methods: {
      // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      //   if (rowIndex === 0) {
      //     if (columnIndex === 0) {
      //       return [1, 2];
      //     } else if (columnIndex === 1) {
      //       return [0, 0];
      //     }
      //   }
      // },
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
        getBaseInfo().then(rsp => {
          let rsp_data = rsp.data;
          if (rsp_data == undefined) {
            this.tableData.push
              ({
                keytype: "通知基础信息",

              });
            this.tableData.push({
              keytype: "说明",
              explain: "通知是为了某流程完成后与各机构进行信息交换的机制，接收通知的机构需要配置一个唯一的接收通知的接口URL。使用加密服务的机构，接口method必须是post，不使用加密服务的机构，接口method必须是get。",
            });
            this.tableData.push
              ({
                keytype: "是否加密",
                explain: '',
              });
            this.tableData.push({
              keytype: "通知地址",
              explain: '',
            });
          }
          else {
            this.tableData.push
              ({
                keytype: "通知基础信息"
              });
            this.tableData.push({
              keytype: "说明",
              explain: "通知是为了某流程完成后与各机构进行信息交换的机制，接收通知的机构需要配置一个唯一的接收通知的接口URL。使用加密服务的机构，接口method必须是post，不使用加密服务的机构，接口method必须是get。"
            });
            this.tableData.push
              ({
                keytype: "是否加密",
                explain: rsp_data.method == 'get' ? '非加密' : '加密'
              });
            this.tableData.push({
              keytype: "通知地址",
              explain: rsp_data.noticePath
            });
          }
        });
      },
      addBaseInfo(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            insertNoticeBaseInfo(this.form)
              .then(rsp => {
                this.dialogFormVisible = false;
                this.tableData = [];
                this.getList();
              }
              )
          }
        })
      },
      generateBaseInfo(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            updateBaseInfo(this.form).then(rsp => {
              this.dialogFormVisible = false;
              //填写通知地址显示在前端时先清除之前的显示
              this.tableData = [];
              let rsp_data = rsp.data;
              this.tableData.push
                ({
                  keytype: "通知基础信息"
                });
              this.tableData.push({
                keytype: "说明",
                explain: "通知是为了某流程完成后与各机构进行信息交换的机制，接收通知的机构需要配置一个唯一的接收通知的接口URL。使用加密服务的机构，接口method必须是post，不使用加密服务的机构，接口method必须是get。"
              });
              this.tableData.push({
                keytype: "是否加密",
                explain: rsp_data.method == 'get' ? '非加密' : '加密'
              });
              this.tableData.push({
                keytype: "通知地址",
                explain: rsp_data.noticePath
              });
            }).catch(rsp => { });
          }
        })
      }
    }
  };
</script>
<style>
  .notice-info .el-table .cell {
    line-height: 50px;
  }

  .notice-info .el-row {
    margin-bottom: 20px;
  }

  .notice-info .el-col {
    border-radius: 4px;
  }

  .notice-info .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .notice-info .row-bg {
    padding: 10px 0;

  }
</style>
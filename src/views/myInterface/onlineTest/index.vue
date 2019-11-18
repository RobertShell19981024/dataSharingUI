<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <h3 style="text-align: center">接口说明</h3>
          <el-container style="height: 100%; border: 1px solid #eee;width: 90%;margin-left: 30px">
            <el-header style="font-size: 15px;height: auto">
              <h4>请求头字段说明</h4>
              <P>
                <el-button type="primary" @click.prevent="addHeaderRow()">添加</el-button>
                <el-button type="danger" @click.prevent="delHeaderData()">删除</el-button>
                <el-button type="success" @click.prevent="HeaderInstance()">请求头样例</el-button>
              </P>
              <div class="table">
                <el-table
                  :data="tableHeaderData"
                  ref="tableHeaderData"
                  tooltip-effect="dark"
                  border
                  stripe
                  style="width: 95%"
                  @selection-change='selectHeaderRow'>
                  <el-table-column type="selection" width="45" align="center"></el-table-column>
                  <el-table-column label="字段" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.field"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="说明">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.explain"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-header>
            <el-main style="font-size: 15px;height: auto">
              <h4>请求体字段说明</h4>
              <P>
                <el-button type="primary" @click.prevent="addBodyRow()">添加</el-button>
                <el-button type="danger" @click.prevent="delBodyData()">删除</el-button>
                <el-button type="success" @click.prevent="BodyInstance()">请求体样例</el-button>
              </P>
              <div class="table">
                <el-table
                  :data="tableBodyData"
                  ref="tableBodyData"
                  tooltip-effect="dark"
                  border
                  stripe
                  style="width: 95%"
                  @selection-change='selectBodyRow'>
                  <el-table-column type="selection" width="45" align="center"></el-table-column>
                  <el-table-column label="字段" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.field"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="说明">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.explain"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
            <el-footer style="font-size: 15px;height: auto;margin-bottom: 20px">
              <h4>响应字段说明</h4>
              <P>
                <el-button type="primary" @click.prevent="addResponseRow()">添加</el-button>
                <el-button type="danger" @click.prevent="delResponseData()">删除</el-button>
                <el-button type="success" @click.prevent="ResponseInstance()">响应样例</el-button>
              </P>
              <div class="table">
                <el-table
                  :data="tableResponseData"
                  ref="tableResponseData"
                  tooltip-effect="dark"
                  border
                  stripe
                  style="width: 95%"
                  @selection-change='selectResponseRow'>
                  <el-table-column type="selection" width="45" align="center"></el-table-column>
                  <el-table-column label="字段" align="center">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.field"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="说明">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.explain"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-footer>
            <div style="text-align: center;margin-bottom: 15px">
              <el-button type="primary" @click.prevent="interfaceEdit()">编辑</el-button>
            </div>
          </el-container>
        </div>
      </el-col>


      <el-dialog title="" :visible.sync="headerVisible">
        <h3>请求头样例
          <el-button type="primary" @click="headerVisible=false">确定</el-button>
        </h3>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="文本内容" name="first">
            <el-input type="textarea" style="width: 80%" v-model="headerTextArea"></el-input>
          </el-tab-pane>
          <el-tab-pane label="展开显示" name="second">
            <json-viewer :value="headerTextArea"></json-viewer>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <el-dialog title="" :visible.sync="bodyVisible">
        <h3>请求体样例
          <el-button type="primary" @click="bodyVisible=false">确定</el-button>
        </h3>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="文本内容" name="first">
            <el-input type="textarea" style="width: 80%" v-model="bodyTextArea"></el-input>
          </el-tab-pane>
          <el-tab-pane label="展开显示" name="second">
            <json-viewer :value="bodyTextArea"></json-viewer>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <el-dialog title="" :visible.sync="responseVisible">
        <h3>响应样例
          <el-button type="primary" @click="responseVisible=false">确定</el-button>
        </h3>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="文本内容" name="first">
            <el-input type="textarea" style="width: 80%" v-model="responseTextArea"></el-input>
          </el-tab-pane>
          <el-tab-pane label="展开显示" name="second">
            <json-viewer :value="responseTextArea"></json-viewer>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <h3 style="text-align: center">接口在线测试</h3>
          <el-container style="height: 100%; border: 1px solid #eee;width: 90%;margin-left: 30px">
            <el-header style="font-size: 15px;height: auto">
              <h4>请求</h4>
              <el-form :model="apiOnlineTest" label-width="100px" ref="apiOnlineTest">
                <el-row>
                  <el-form-item label="接口后缀地址" prop="url">
                    <el-input v-model="apiOnlineTest.path" style="width: 30%" :disabled="true"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="请求方式" prop="method">
                    <el-select v-model="apiOnlineTest.method" placeholder="请选择" style="margin-bottom: 10px">
                      <el-option v-for="item in methodOptions" :key="item.value" :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="请求头" prop="sendheader">
                    <el-input type="textarea" v-model="apiOnlineTest.sendheard" placeholder="请输入请求头"
                              style="width: 60%;"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="请求体" prop="sendbody">
                    <el-input type="textarea" v-model="apiOnlineTest.sendbody" placeholder="请输入请求体"
                              style="width: 60%;"></el-input>
                  </el-form-item>
                </el-row>
              </el-form>
            </el-header>

            <el-main style="font-size: 15px;height: auto">
              <h4>响应</h4>
              <el-input type="textarea" style="width: 60%;"></el-input>
            </el-main>
            <div style="text-align: center;margin-bottom: 15px">
              <el-button type="primary" @click.prevent="startTest()">开始测试</el-button>
            </div>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getOneApiBaseDescriptions,
    updateOneApiBaseDescriptions,
  } from '@/api/myPublish/apiBaseDescriptions/index';
  import {
    requestHost
  } from '@/api/myPublish/apiBaseInfo/index';

  export default {
    data() {
      return {
        tableHeaderData: [],
        tableBodyData: [],
        tableResponseData: [],
        selectHeaderListRow: [],
        selectBodyListRow: [],
        selectResponseListRow: [],
        headerVisible: false,
        bodyVisible: false,
        responseVisible: false,
        headerTextArea: {},
        bodyTextArea: {},
        responseTextArea: {},
        apiOnlineTest: {
          api_id: undefined,
          path: undefined,
          method: undefined,
          sendbody: undefined,
          sendheard: undefined
        },
        methodOptions: [
          {
            value: 'GET',
            label: 'GET'
          }, {
            value: 'POST',
            label: 'POST'
          },
        ],
        apiId: undefined,
        isHeaderAdd: true,
        isBodyAdd: true,
        isResponseAdd: true,
        activeName: 'first'
      }
    },
    mounted() {
      this.apiId = this.$route.query.apiId;
      this.apiOnlineTest.path = this.$route.query.path
      if (typeof this.apiId !== "undefined") {
        getOneApiBaseDescriptions(this.apiId).then(response => {
          response = response.apiBaseDescriptions[0];
          this.tableHeaderData = JSON.parse(response.requsetHeardField);
          this.headerTextArea = response.requsetHeardExp;
          this.tableBodyData = JSON.parse(response.requestBodyField);
          this.bodyTextArea = response.requsetBodyExp;
          this.tableResponseData = JSON.parse(response.respBodyField);
          this.responseTextArea = response.respBodyExp;
        });
      }
    },
    methods: {
      // 获取表格选中时的数据
      selectHeaderRow(val) {
        this.selectHeaderListRow = val;
      },
      selectBodyRow(val) {
        this.selectBodyListRow = val;
      },
      selectResponseRow(val) {
        this.selectResponseListRow = val;
      },

      // 增加行
      addHeaderRow() {
        this.addRow(this.tableHeaderData, this.isHeaderAdd);
      }, addBodyRow() {
        this.addRow(this.tableBodyData, this.isBodyAdd);
      },
      addResponseRow() {
        this.addRow(this.tableResponseData, this.isResponseAdd);
      },
      // 删除方法
      // 删除选中行
      delHeaderData() {
        this.delData(this.selectHeaderListRow, this.tableHeaderData);
      },
      delBodyData() {
        this.delData(this.selectBodyListRow, this.tableBodyData);
      },
      delResponseData() {
        this.delData(this.selectResponseListRow, this.tableResponseData);
      },
      delData(selectlistRow, tableData) {
        for (let i = 0; i < selectlistRow.length; i++) {
          let val = selectlistRow;
          // 获取选中行的索引的方法
          // 遍历表格中tableData数据和选中的val数据，比较它们的rowNum,相等则输出选中行的索引
          // rowNum的作用主要是为了让每一行有一个唯一的数据，方便比较，可以根据个人的开发需求从后台传入特定的数据
          val.forEach((val, index) => {
            tableData.forEach((v, i) => {
              if (val.rowNum === v.rowNum) {
                // i 为选中的索引
                tableData.splice(i, 1)
              }
            })
          })
        }
        // 删除完数据之后清除勾选框
        if (this.$refs[tableData] !== undefined) {
          this.$refs[tableData].clearSelection()
        }
      },
      addRow(tableData, isAdd) {
        const list = {
          field: '',
          name: '',
          explain: ''
        };
        tableData.forEach(data => {
          if (JSON.stringify(data) === JSON.stringify(list)) {
            isAdd = false;
            this.$message({
              message: '有空内容存在',
              type: 'warning'
            });
            throw new Error("EndIterative");
          } else {
            isAdd = true;
          }
        });
        if (isAdd === true) {
          tableData.unshift(list);
        }
      },
      HeaderInstance() {
        this.headerVisible = true
      },
      BodyInstance() {
        this.bodyVisible = true
      },
      ResponseInstance() {
        this.responseVisible = true
      },
      interfaceEdit() {
        if (typeof this.apiId !== 'undefined') {
          const obj = {};
          obj.apiId = this.apiId;
          obj.requsetHeardField = JSON.stringify(this.tableHeaderData);
          obj.requsetHeardExp = this.headerTextArea;
          obj.requestBodyField = JSON.stringify(this.tableBodyData);
          obj.requsetBodyExp = this.bodyTextArea;
          obj.respBodyField = JSON.stringify(this.tableResponseData);
          obj.respBodyExp = this.responseTextArea;
          updateOneApiBaseDescriptions(this.apiId, obj).then(response => {
            response = response.status;
            if (response === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            } else {
              this.$message.error('修改失败');
            }
          });
        } else {
          this.$message.error('未获取接口Id');
        }
      }, startTest() {
        if (typeof this.apiOnlineTest.path !== "undefined") {
          this.apiOnlineTest.api_id = this.apiId;
          console.log(this.apiOnlineTest);
          requestHost(this.apiOnlineTest).then(() => {

          })
        } else {
          this.$message.error('接口后缀地址不能为空');
        }
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }

  }
</script>

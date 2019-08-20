<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select v-model="value" placeholder="请选择需要配置的路径">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div id="timeControl" v-show="timeDiv">
    <h3>访问时间控制<i class="el-icon-circle-plus-outline" style="margin-left: 100px;font-size: 30px" @click="handleTimeCreate"></i></h3>
    <el-table :key='tableKey' :data="timeList" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column type="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column align="center" label="允许上网时段">
        <template slot-scope="scope">
          <span>{{scope.row.stime}}至{{scope.row.etime}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="325">
        <template slot-scope="scope">
          <i class="el-icon-edit-outline" style="margin-left: 25px;font-size: 30px" size="small" type="danger" @click="handleTimeUpdate(scope.row)"></i>
          <i class="el-icon-delete" style="margin-left: 30px;font-size: 30px" size="small" type="danger" @click="handleTimeDelete(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div id="whiteList" v-show="whiteListDiv">
    <h3>白名单<i class="el-icon-circle-plus-outline" style="margin-left: 100px;font-size: 30px" @click="handleIPCreate"></i></h3>
    <el-table :key='tableKey' :data="whiteListList" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column type="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column align="center" label="允许访问的网站地址">
        <template slot-scope="scope">
          <span>{{scope.row.ipContent}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址描述">
        <template slot-scope="scope">
          <span>{{scope.row.ipNote}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="325">
        <template slot-scope="scope">
          <i class="el-icon-edit-outline" style="margin-left: 25px;font-size: 30px" size="small" type="danger" @click="handleIPUpdate(scope.row)"></i>
          <i class="el-icon-delete" style="margin-left: 30px;font-size: 30px" size="small" type="danger" @click="handleIPDelete(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
   </div>

    <!-- 编辑详细信息 -->

    <el-dialog :title="dialogTimeTitle" :visible.sync="timeVisible">
        <div class="block">
          <span class="demonstration">时间</span>
          <el-time-picker
            is-range
            v-model="value3"
            range-separator="至"
            :start-placeholder="startplaceholder"
            :end-placeholder="endplaceholder"
            :value="value2"
            @change="chooseTimeRange">
          </el-time-picker>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="TimeCancel()">取 消</el-button>
        <el-button v-if="dialogTimeStatus=='create'" type="primary" @click="TimeCreate()">创建</el-button>
        <el-button v-else type="primary" @click="TimeUpdate()">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogIPTitle" :visible.sync="IPVisible">
      <el-form :model="IPForm" :rules="rules" label-width="100px">
        <el-collapse v-model="activeNames">
          <!-- 基础信息部分 -->
          <el-collapse-item name="1">
            <el-row>
              <el-form-item label="允许访问的网站地址" prop="ipContent">
                <el-input v-model="IPForm.ipContent" placeholder="请输入网站地址" style="width: 50%"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
            <el-form-item label="地址描述" prop="ipNote">
              <el-input v-model="IPForm.ipNote" placeholder="请输入网站地址描述" style="width: 50%"></el-input>
            </el-form-item>
          </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="IPCancel()">取 消</el-button>
        <el-button v-if="dialogIPStatus=='create'" type="primary" @click="IPCreate()">创建</el-button>
        <el-button v-else type="primary" @click="IPUpdate()">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped="scoped">
  h3{
    text-align: center;
  }
</style>
<script>
  import {
    page,
    addObj,
    getOneApiBaseInfo,
    delObj,
    putObj
  } from '@/api/myPublish/apiBaseInfo/index';
  import {
    addObj1,
    getObj1,
    delObj1,
    putObj1,
    getApiTimeFilterInfoList,
    getOneApiTimeFilter
  } from '@/api/myPublish/apiTimeFilter/index';
  import {
    addObj2,
    getObj2,
    delObj2,
    putObj2,
    getApiIPFilterInfoList,
    getOneApiIPFilter
  } from '@/api/myPublish/whiteListFilter/index';
  export default {
    data() {
      return {
        value2:'00:00:00',
        timeVisible:false,
        IPVisible:false,
        timeList:null,
        whiteListList:null,
        listQuery: {
          page: 1,
          limit: 20,
          apiName: undefined
        },
        dialogTimeStatus: '',
        dialogIPStatus: '',
        tableKey: 0,
        IPForm: {
          ipContent: undefined,
          ipNote: undefined
        },
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        dialogTimeTitle: '',
        dialogIPTitle:'',
        activeNames: ['1'],
        rules: {
          ipContent: [
            {
              required: true,
              message: '请输入地址',
              trigger: 'blur'
            }
          ],ipNote: [
            {
              required: true,
              message: '请输入地址描述',
              trigger: 'blur'
            }
          ]
        },
        options:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value3: '',
        stime: '',
        etime: '',
        value:'',
        whiteListDiv:false,
        timeDiv:false,
        curr:'',
        startplaceholder:'开始日期',
        endplaceholder: '结束日期',
        updateTimeId:'',
        updateWhiteId:'',
        readonly:false
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList(){
        page().then(response => {
          response.data.rows.forEach(item => {
            let obj = {};
            obj.label = item.path;
            obj.value = item.apiId;
            this.options.push(obj)
          })
        })
      },
      chooseTimeRange: function (t) {
        const t1 = t.toString()
        this.stime = this.getTime(t1.substring(0, t1.lastIndexOf(',')))
        this.etime = this.getTime(t1.substring(t1.indexOf(',') + 1))
      },
      getTime(val) {
        const d = new Date(val);
        return d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
      },
      handleTimeCreate() {
        this.dialogTimeTitle = '上网时间控制';
        this.dialogTimeStatus = 'create';
        this.timeVisible = true;
      },
      handleIPCreate() {
        this.dialogIPTitle = '网站过滤';
        this.dialogIPStatus = 'create';
        this.IPVisible = true;
      },
      handleTimeUpdate(row) {
        getOneApiTimeFilter(row.id)
          .then(response => {
            const result = response.data;
            this.dialogTimeTitle = '修改时间';
            this.readonly= true;
            this.startplaceholder = result.stime;
            this.endplaceholder = result.etime;
            this.updateTimeId = result.id;
            this.dialogTimeStatus = 'update';
            this.timeVisible = true;
          });
      },
      handleTimeDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj1(row.id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                const index = this.timeList.indexOf(row);
                this.timeList.splice(index, 1);
              });
          });
      },
      handleIPUpdate(row) {
        getOneApiIPFilter(row.id)
          .then(response => {
            this.dialogIPTitle = '修改路由';
            this.IPForm = response.data;
            this.updateWhiteId = response.data.id;
            this.dialogIPStatus = 'update';
            this.IPVisible = true;
          });
      },
      handleIPDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj2(row.id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                const index = this.whiteListList.indexOf(row);
                this.whiteListList.splice(index, 1);
              });
          });
      },
      TimeCreate() {
        this.timeVisible = false;
        const obj = {};
        obj.stime = this.stime;
        obj.etime = this.etime;
        obj.apiId = this.curr;
            addObj1(obj)
              .then(() => {
                this.resetTimeTemp();
                this.timeVisible = false;
                this.getTimeList(this.curr);
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
      },
      IPCreate() {
        this.IPVisible = false;
        const obj = {}
        obj.ipContent = this.IPForm.ipContent
        obj.ipNote = this.IPForm.ipNote
        obj.apiId = this.curr
            addObj2(obj)
              .then(() => {
                this.resetIPTemp();
                this.IPVisible = false;
                this.getWhiteList(this.curr);
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
      },
      TimeCancel() {
        this.resetTimeTemp();
        this.timeVisible = false;
      },
      IPCancel() {
        this.resetIPTemp()
        this.IPVisible = false;
      },
      TimeUpdate() {
        this.timeVisible = false;
        const obj = {};
        obj.stime = this.stime;
        obj.etime = this.etime;
        obj.apiId = this.curr;
        obj.id = this.updateTimeId;
        putObj1(this.updateTimeId,obj).then(() => {
          this.resetTimeTemp();
          this.timeVisible = false;
          this.getTimeList(this.curr);
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      IPUpdate() {
            this.IPVisible = false;
        const obj = {};
        obj.ipContent = this.IPForm.ipContent;
        obj.ipNote = this.IPForm.ipNote;
        obj.apiId = this.curr;
        obj.id = this.updateWhiteId;
            putObj2(this.updateWhiteId, obj).then(() => {
              this.resetIPTemp();
              this.IPVisible = false;
              this.getWhiteList(this.curr);
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
            });
      },
      resetIPTemp() {
        this.IPForm = {
          ipContent:undefined,
          ipNote: undefined
        }
      },
      resetTimeTemp() {
       this.startplaceholder = '开始时间';
       this.endplaceholder = '结束时间'
      },
      getTimeList(curr){
        getApiTimeFilterInfoList(curr).then(response => {
          const result = response;
          this.timeDiv = result.IsFilter;
          if(result.IsFilter){
            this.timeList = result.apiTimeFilterInfoList;
          }
        });
      },getWhiteList(curr){
        getApiIPFilterInfoList(curr).then(response => {
          const result = response;
          this.whiteListDiv = result.IsIPFilter;
          if(result.IsIPFilter){
            this.whiteListList = result.apiIPFilterInfoList;
          }
        });
      }
    },
    watch:{
      value(val, oldval) {
        this.curr = val
        this.getTimeList(val);
        this.getWhiteList(val);
      }
    }
  }
</script>


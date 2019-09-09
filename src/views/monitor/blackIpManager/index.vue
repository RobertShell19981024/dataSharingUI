<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="IP地址"
                v-model="listQuery.ipContent"></el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="blackListIpManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
                 type="primary" icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="序号" type="index" style="width:10%">
      </el-table-column>
      <el-table-column style="width:30%" align="center" label="IP数值">
        <template slot-scope="scope">
          <span>{{scope.row.ipContentStr}}</span>
        </template>
      </el-table-column>
      <el-table-column style="width:15%" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.ipNote}}</span>
        </template>
      </el-table-column>
      <el-table-column style="width:15%" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
        </template>
      </el-table-column>
      <el-table-column style="width:15%" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" style="width:15%">
        <template slot-scope="scope">
          <el-button v-if="blackListIpManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">
            编辑
          </el-button>

          <el-button v-if="blackListIpManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="IP地址" prop="ipContentStr">
          <el-input v-model="form.ipContentStr" placeholder="请输入IP地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="ipNote">
          <el-input v-model="form.ipNote" placeholder="请输入备注（例如机构名）"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from "@/api/monitor/blackIpManager/index";
  import {mapGetters} from "vuex";

  export default {
    name: "blackListIp",
    data() {
      // ip地址校验
      let ipValidate = (rule, value, callback) => {
        // ip地址的格式限制
        let reg = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
        let ip_reg = new RegExp(reg);
        if (value === '' || value === undefined) {
          callback(new Error('请输入IP数值'));
        } else if (!ip_reg.test(value)) {
          callback(new Error('IP地址格式错误，请检查格式(例:10.10.10.10)'));
        } else {
          callback();
        }
      };
      return {
        form: {
          ipContentStr: undefined,
          ipNote: undefined,
          crtTime: undefined,
          updTime: undefined
        },
        rules: {
          ipContentStr: [
            {
              required: true,
              trigger: "blur",
              validator: ipValidate
            }
          ],
          ipNote: [
            {
              required: true,
              message: "请输入备注",
              trigger: "blur"
            },
            {
              min: 3,
              max: 20,
              message: "长度在 3 到 20 个字符",
              trigger: "blur"
            }
          ],
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          ipContent: undefined
        },
        dialogFormVisible: false,
        dialogStatus: "",
        blackListIpManager_btn_edit: true,
        blackListIpManager_btn_del: true,
        blackListIpManager_btn_add: true,
        textMap: {
          update: "编辑",
          create: "创建"
        },
        tableKey: 0,
        update_ip_id: undefined // 记录修改的IP记录主键
      };
    },
    created() {
      this.getList();
      this.blackListIpManager_btn_edit = true;
      this.blackListIpManager_btn_del = true;
      this.blackListIpManager_btn_add = true;
    },
    computed: {
      ...mapGetters(["elements"])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.update_ip_id = row.ipId;
        getObj(row.ipId).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = "update";
        });
      },
      handleDelete(row) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delObj(row.ipId).then(() => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            putObj(this.update_ip_id, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
          ipContentStr: undefined,
          ipNote: undefined,
          crtTime: undefined,
          updTime: undefined
        };
      }
    }
  };
</script>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="类型ID"
        v-model="listQuery.typeId">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="dialogFormVisible=true">添加通知类型
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="类型ID" style="width:30%">
        <template slot-scope="scope">
          <span>{{scope.row.typeId}}</span>
        </template>
      </el-table-column>
      <el-table-column style="width:45%" align="center" label="类型描述">
        <template slot-scope="scope">
          <span>{{scope.row.typeDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" style="width:35%">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="noticeCorpListManage(scope.row)">通知机构配置
          </el-button>
          <!-- <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!-- 统计机构列表配置框 -->
    <el-dialog :title="noticeDialogTitle" :visible.sync="dialogAuthFormVisible" width="550px">
      <el-transfer v-model="noticeCorpList" :data="allNoticeId" :titles="['所有机构', '需通知机构']"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNoticeDialog">取 消</el-button>
        <el-button @click="submitNoticeData" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="通知类型" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="类型ID" prop="typeId" :label-width="formLabelWidth">
          <el-select v-model="form.typeId" placeholder="请选择">
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
            <el-option label="步骤十三" value="ZTGEO_NOTICE_13"></el-option>
            <el-option label="步骤十四" value="ZTGEO_NOTICE_14"></el-option>
            <el-option label="步骤十五" value="ZTGEO_NOTICE_15"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型描述" prop="typeDesc" :label-width="formLabelWidth">
          <el-input v-model="form.typeDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button v-if="createOrUpdate==true" type="primary" @click="generateBaseInfo('form')">确 定</el-button> -->
        <el-button @click="addNoticeTypefo('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { page, getAllActiviveUser, updateNoticeUserRelList, insertNoticeTypeInfo, delObj } from '@/api/notice/noticeCorpManage/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'noticeReceiveManage',
    data() {
      return {
        form: {
          typeDesc: undefined
        },
        rules: {
          typeDesc: [
            {
              required: true,
              message: '请输入类型描述',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 40,
              message: '长度在 3 到 40 个字符',
              trigger: 'blur'
            }
          ],
          typeId: [
            {
              required: true,
              message: '请选择类型'
            }
          ]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          typeId: undefined
        },
        tableKey: 0,
        noticeDialogTitle: '统计机构列表配置',
        dialogAuthFormVisible: false,
        dialogFormVisible: false,
        allNoticeId: [], // 所有可通知机构
        noticeCorpList: [], // 需通知机构
        noticeCorpList_origin: [], // 需通知机构的备份数据
        dialogTypeId: '' // 用于记录对话框的通知类型ID
      }
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      // 查询所有类型信息
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      //添加通知类型
      addNoticeTypefo(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            insertNoticeTypeInfo(this.form)
              .then(rsp => {
                this.dialogFormVisible = false;
                this.tableData = [];
                this.getList();
              }
              )
          }
        })
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
      // 通知机构列表管理
      noticeCorpListManage(row) {
        // 初始化穿梭框信息
        this.allNoticeId = [];
        this.noticeCorpList = [];
        this.noticeCorpList_origin = [];
        this.dialogTypeId = row.typeId;
        // 显示权限配置穿梭框
        this.dialogAuthFormVisible = true;
        // 查询获取所有可接收通知的用户名和主键ID
        getAllActiviveUser(row.typeId).then(rsp => {
          let all_notice_corp = rsp.allNoticeCorp;
          let notice_corp_list = rsp.noticeCorpList;
          // 所有机构
          for (let index = 0; index < all_notice_corp.length; index++) {
            const element = all_notice_corp[index];
            this.allNoticeId.push({ key: element.noticeId, label: element.name });
          }
          // 需通知机构
          for (let index = 0; index < notice_corp_list.length; index++) {
            const element = notice_corp_list[index];
            let notice_id = element.noticeId;
            this.noticeCorpList.push(notice_id);
            // 备份一份，用作计算
            this.noticeCorpList_origin.push(notice_id);
          }
        });
      },
      // 通知机构列表--取消操作
      cancelNoticeDialog() {
        this.allNoticeId = [];
        this.noticeCorpList = [];
        this.noticeCorpList_origin = [];
        this.dialogAuthFormVisible = false;
      },
      // 通知机构列表--提交操作
      submitNoticeData() {
        let noticeCorpList_origin_set = new Set(this.noticeCorpList_origin);
        let noticeCorpList_set = new Set(this.noticeCorpList);
        // 取原始权限和待提交的权限列表的交集
        let interactNoticeIdhSet = new Set([...noticeCorpList_origin_set].filter(x => noticeCorpList_set.has(x)));
        // 将原始权限与交集取差集，获得删除的权限
        let diffOriginAndInterAct = new Set([...noticeCorpList_origin_set].filter(x => !interactNoticeIdhSet.has(x)));
        // 将待提交的权限与交集取差集，获得新增的权限
        let diffNoticeIdValueAndInterAct = new Set([...noticeCorpList_set].filter(x => !interactNoticeIdhSet.has(x)));
        // 提交请求
        let req_json = { addIdList: diffNoticeIdValueAndInterAct, deleteIdList: diffOriginAndInterAct };
        updateNoticeUserRelList(req_json, this.dialogTypeId).then(rsp => {
          this.dialogAuthFormVisible = false;
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(row.id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              });
          });
      }
    }
  }
</script>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" v-if="true" style="margin-left: 10px;"
                 @click="handleCreate" type="primary"
                 icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="false" border fit highlight-current-row
              style="width: 100%">
      <el-table-column type="index" align="center" width="93" label="序号">
      </el-table-column>
      <el-table-column width="350px" align="center" label="接口名称">
        <template slot-scope="scope">
          <span>{{scope.row.apiName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="路径">
        <template slot-scope="scope">
          <span>{{scope.row.baseUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="访问地址">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="方法">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="定制状态">
        <template slot-scope="scope">
          <span>{{scope.row.isDz == true ? '定制':'未定制'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人">
        <template slot-scope="scope">
          <span>{{scope.row.responsiblePersonName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人电话">
        <template slot-scope="scope">
          <span>{{scope.row.responsiblePersonTel}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="325">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="small" type="success" @click="handleKey(scope.row)">密钥</el-button>
          <el-button size="small" type="success" @click="handleRoute(scope.row)">路由</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 编辑详细信息 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false">
      <el-form :model="form" label-width="100px">
        <el-collapse v-model="activeNames">
          <!-- 基础信息部分 -->
          <el-collapse-item title="请求接口基础信息" name="1">
            <el-form-item label="接口Id" prop="apiId" v-show="isShow">
              <el-input v-model="api_id" placeholder="apiId" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="接口名称" prop="apiName">
              <el-input v-model="form.apiName" placeholder="接口名称"></el-input>
            </el-form-item>
            <el-form-item label="IP访问地址" prop="baseUrl">
              <el-input v-model="form.baseUrl" placeholder="IP访问地址"></el-input>
            </el-form-item>
            <el-form-item label="后缀地址" prop="path">
              <el-input v-model="form.path" placeholder="后缀地址"></el-input>
            </el-form-item>
            <el-form-item label="方法" prop="method">
              <el-select v-model="form.method" placeholder="请选择" style="margin-bottom: 10px">
                <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人名称" prop="responsiblePersonName">
              <el-input v-model="form.responsiblePersonName" placeholder="接口负责人名称"></el-input>
            </el-form-item>
            <el-form-item label="负责人电话" prop="responsiblePersonTel">
              <el-input v-model="form.responsiblePersonTel" placeholder="接口负责人电话"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="请求接口过滤器配置" name="1">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-table
                  ref="filterTable"
                  v-loading="listLoading"
                  :key="tableKey"
                  :data="filterList"
                  border
                  fit
                  highlight-current-row
                  @selection-change="handleFilterChange"
                >
                  <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                  <el-table-column label="主键" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.key }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="过滤器名称" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.label }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>

              <el-col :span="2" style="text-align:center;">
                <el-button
                  @click="addFilter"
                  type="primary"
                  :disabled="!filterData.length"
                  icon="el-icon-arrow-right"
                  circle
                ></el-button>
                <el-button
                  @click="removeFilter"
                  type="primary"
                  :disabled="!selectedFilterData.length"
                  icon="el-icon-arrow-left"
                  circle
                  style="margin-left: 0;margin-top: 10px;"
                ></el-button>
              </el-col>

              <el-col :span="11">
                <el-table
                  ref="selectedFilterTable"
                  v-loading="listLoading"
                  :key="tableKey"
                  :data="selectedFilterList"
                  border
                  fit
                  highlight-current-row
                  @selection-change="handleSelectedFilterChange"
                >
                  <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                  <el-table-column label="主键" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.key }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="过滤器名称" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.label }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="过滤器配置" align="center">
                    <template slot-scope="scope">
                      <el-button type="primary" size="small"
                                 v-show="showIdArrs.indexOf(scope.row.key) > -1" @click="isShowButton(scope.row.key)">
                        配置
                      </el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="密钥信息展示" :visible.sync="keyVisible">
      <el-collapse v-model="activeNames">
        <!-- 基础信息部分 -->
        <el-collapse-item title="密钥基础信息" name="1">
          <el-table :data="keyList" v-loading.body="false" border fit highlight-current-row
                    style="width: 100%">
            <el-table-column width="300px" align="center" label="接口Id">
              <template slot-scope="scope">
                <span>{{scope.row.apiId}}</span>
              </template>
            </el-table-column>
            <el-table-column width="300px" align="center" label="接口名称">
              <template slot-scope="scope">
                <span>{{scope.row.apiName}}</span>
              </template>
            </el-table-column>
            <el-table-column width="300px" align="center" label="平台签名公钥">
              <template slot-scope="scope">
                <el-popover
                  placement="left"
                  title="平台签名公钥"
                  width="200"
                  trigger="hover"
                >
                  <span slot="reference">{{scope.row.signPtPubkey.length<=100?scope.row.signPtPubkey:scope.row.signPtPubkey.substring(0,100)+"..."}}</span>
                  <div>
                    {{scope.row.signPtPubkey}}<br/>
                    <el-button type="primary" v-clipboard:copy="scope.row.signPtPubkey"
                               v-clipboard:success="onCopy"
                               v-clipboard:error="onError">复制
                    </el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column width="300px" align="center" label="签名私钥">
              <template slot-scope="scope">
                <el-popover
                  placement="left"
                  title="签名私钥"
                  width="200"
                  trigger="hover"
                >
                  <span slot="reference">{{scope.row.signSecretKey.length<=100?scope.row.signSecretKey:scope.row.signSecretKey.substring(0,100)+"..."}}</span>
                  {{scope.row.signSecretKey}}<br/>
                  <el-button type="primary" v-clipboard:copy="scope.row.signSecretKey"
                             v-clipboard:success="onCopy"
                             v-clipboard:error="onError">复制
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column width="300px" align="center" label="数据密钥">
              <template slot-scope="scope">
                <span>{{scope.row.symmetricPubkey}}</span>
              </template>
            </el-table-column>

          </el-table>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" class="dialog-footer">
        <el-button @click="keyCancel('form')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="timeVisible">
      <h3>访问时间控制<i class="el-icon-circle-plus-outline" style="margin-left: 100px;font-size: 30px"
                   @click="handleTimeCreate"></i></h3>
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
            <i class="el-icon-edit-outline" style="margin-left: 25px;font-size: 30px" size="small" type="danger"
               @click="handleTimeUpdate(scope.row)"></i>
            <i class="el-icon-delete" style="margin-left: 30px;font-size: 30px" size="small" type="danger"
               @click="handleTimeDelete(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="" :visible.sync="whiteListVisible">
      <h3>白名单<i class="el-icon-circle-plus-outline" style="margin-left: 100px;font-size: 30px"
                @click="handleIPCreate"></i></h3>
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
            <i class="el-icon-edit-outline" style="margin-left: 25px;font-size: 30px" size="small" type="danger"
               @click="handleIPUpdate(scope.row)"></i>
            <i class="el-icon-delete" style="margin-left: 30px;font-size: 30px" size="small" type="danger"
               @click="handleIPDelete(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="" :visible.sync="JsonFilterVisible">
      <h3>接口json过滤<i class="el-icon-circle-plus-outline" style="margin-left: 100px;font-size: 30px"
                     @click="handleJsonFilterCreate"></i></h3>
      <el-table :key='tableKey' :data="jsonFilterList" v-loading.body="false" border fit highlight-current-row
                style="width: 100%">
        <el-table-column type="index" align="center" width="93" label="序号">
        </el-table-column>
        <el-table-column align="center" label="用户">
          <template slot-scope="scope">
            <span>{{scope.row.fromUser}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="过滤key字段">
          <template slot-scope="scope">
            <span>{{scope.row.fieldList}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="325">
          <template slot-scope="scope">
            <i class="el-icon-edit-outline" style="margin-left: 25px;font-size: 30px" size="small" type="danger"
               @click="handleJsonFilterUpdate(scope.row)"></i>
            <i class="el-icon-delete" style="margin-left: 30px;font-size: 30px" size="small" type="danger"
               @click="handleJsonFilterDelete(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 编辑详细信息 -->
    <el-dialog :title="dialogTimeTitle" :visible.sync="timeIndexVisible">
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

    <el-dialog :title="dialogJsonFilterTitle" :visible.sync="JsonFilterIndexVisible">
      <el-form :model="JsonFilterForm" :rules="rules" label-width="100px">
        <el-collapse v-model="activeNames">
          <!-- 基础信息部分 -->
          <el-collapse-item name="1">
            <el-row>
              <el-form-item label="指定用户" prop="fromUser">
                <el-select v-model="JsonFilterForm.fromUser" placeholder="请指定用户">
                  <el-option
                    v-for="item in userOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="过滤key字段" prop="fieldList">
                <el-input v-model="JsonFilterForm.fieldList" placeholder="请输入过滤key集合" style="width: 50%"></el-input>
              </el-form-item>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="JsonFilterCancel()">取 消</el-button>
        <el-button v-if="dialogJsonFilterStatus=='create'" type="primary" @click="JsonFilterCreate()">创建</el-button>
        <el-button v-else type="primary" @click="JsonFilterUpdate()">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="路由管理" :visible.sync="routeVisible">
      <el-form :model="routeForm" ref="form" label-width="100px">
        <el-collapse v-model="activeNames">
          <!-- 基础信息部分 -->
          <el-collapse-item title="路由基础信息" name="1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="访问IP地址" prop="url">
                  <el-input v-model="routeForm.url" placeholder="请输入IP访问地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="路由后缀地址" prop="path">
                  <el-input v-model="routeForm.path" placeholder="后缀地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="routeCancel()">取 消</el-button>
        <el-button type="primary" @click="routeUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    page,
    addObj,
    getOneApiBaseInfo,
    getAllApiBaseInfo,
    delObj,
    putObj
  } from '@/api/myPublish/apiBaseInfo/index';
  import {
    getFilterByApiId, updateFilter
  } from '@/api/myPublish/apiUserFilter/index';
  import {
    getAllPublisherFilter
  } from '@/api/myPublish/addApi/index';
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
  import {
    getAllapiJsonKeyInfo,
    addApiJsonKeyFilter,
    getOneApiJsonKeyInfo,
    delOneApiJsonKeyInfo,
    updateOneApiJsonKeyInfo,
    getAllapiJsonKeyInfoList
  } from '@/api/myPublish/apiJsonKeyFilter/index';

  import {
    all
  } from '@/api/admin/user/index';

  import {
    getOneApiRouterDefineInfo,
    updateApiRouterInfo
  } from '@/api/myPublish/apiRouterDefine/index';

  export default {
    mounted() {
      this.getList();
    },
    data() {
      return {
        form: {
          apiName: undefined,
          baseUrl: undefined,
          path: undefined,
          method: '',
          responsiblePersonName: undefined,
          responsiblePersonTel: undefined
        },
        routeForm: {
          path: undefined,
          url: undefined
        },
        list: null,
        keyList: null,
        total: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogStatus: '',
        keyVisible: false,
        filterData: [],
        filterList: [],
        selectedFilterList: [],
        selectedFilterData: [],
        originList: [],
        rowKey: "rowKey",
        methodOptions: [
          {
            value: 'get',
            label: 'get'
          }, {
            value: 'post',
            label: 'post'
          }, {
            value: 'put',
            label: 'put'
          }, {
            value: 'delete',
            label: 'delete'
          }
        ],
        dialogTitle: '',
        isShow: false,
        api_id: undefined,
        showIdArrs: ['1h5OiYUc', '1h5OiYUo', '1h5OiYUs'],
        value2: '00:00:00',
        timeVisible: false,
        timeIndexVisible: false,
        JsonFilterVisible: false,
        JsonFilterIndexVisible: false,
        whiteListVisible: false,
        routeVisible: false,
        IPVisible: false,
        timeList: null,
        whiteListList: null,
        jsonFilterList: null,
        listQuery: {
          page: 1,
          limit: 10,
          apiName: undefined
        },
        dialogTimeStatus: '',
        dialogIPStatus: '',
        dialogJsonFilterStatus: '',
        tableKey: 0,
        IPForm: {
          ipContent: undefined,
          ipNote: undefined
        },
        JsonFilterForm: {
          fromUser: undefined,
          fieldList: undefined
        },
        apiRouterDefineManager_btn_edit: false,
        apiRouterDefineManager_btn_del: false,
        dialogTimeTitle: '',
        dialogIPTitle: '',
        dialogJsonFilterTitle: '',
        activeNames: ['1'],
        rules: {
          ipContent: [
            {
              required: true,
              message: '请输入地址',
              trigger: 'blur'
            }
          ], ipNote: [
            {
              required: true,
              message: '请输入地址描述',
              trigger: 'blur'
            }
          ]
        },
        options: [],
        userOptions: [],
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
        value: '',
        curr: '',
        startplaceholder: '开始日期',
        endplaceholder: '结束日期',
        updateTimeId: '',
        updateWhiteId: '',
        updateJsonId: '',
        readonly: false,
        filterUserjson: {},
        middle: {},
        keyArr: [],
        updateFilterList: [],
        routeUpdateApiId: undefined
      }
    },
    methods: {
      getFilterList() {
        getAllPublisherFilter(this.api_id).then(response => {
          let rsp_data = response;
          let all_filters = rsp_data.allFilter;
          if (all_filters != null && all_filters.length > 0) {
            for (let index = 0; index < all_filters.length; index++) {
              const element = all_filters[index];
              this.filterList.push({key: element.id, label: element.filterName});
            }
          }
        });
      }, getUpdateFilterList() {
        getAllPublisherFilter(this.api_id).then(response => {
          let rsp_data = response;
          let all_filters = rsp_data.allFilter;
          let api_user_filters = rsp_data.apiUserFilterList;
          if (api_user_filters.length > 0) {
            for (let index = 0; index < api_user_filters.length; index++) {
              const element = api_user_filters[index];
              this.selectedFilterList.push({key: element.filterDouterId, label: element.filterName});
              this.originList.push({key: element.filterDouterId, label: element.filterName});
            }
          }
          if (all_filters != null && all_filters.length > 0) {
            for (let index = 0; index < all_filters.length; index++) {
              const element = all_filters[index];
              this.updateFilterList.push({key: element.id, label: element.filterName});
            }
          }
          let originAuthSet = new Set(this.updateFilterList);
          let filterIdValueSet = new Set(this.selectedFilterList);
          // 取原始权限和待提交的权限列表的交集
          let interactAuthSet = [...originAuthSet].filter(x => [...filterIdValueSet].some(y => y.key === x.key));
          // 将待提交的权限与交集取差集，获得新增的权限
          let diffFilterIdValueAndInterActObjArr = [...originAuthSet].filter(x => [...interactAuthSet].every(y => y.key !== x.key));
          diffFilterIdValueAndInterActObjArr.forEach(element => {
            this.filterList.push({key: element.key, label: element.label});
          });
        });
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {
          });
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            const status = response.status;
            if (status === 200) {
              this.list = response.data.rows;
              this.total = response.data.total;
              this.listLoading = false;
            } else if (status === 20500) {
              this.$message({
                message: response.message,
                type: 'error',
                duration: 1500
              })
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
      update() {
        this.submitUpdateAuthData();
        const obj1 = {};
        obj1.apiId = this.api_id;
        obj1.filterUserjson = this.filterUserjson;
        const obj = Object.assign(this.form, obj1);
        putObj(this.api_id, obj).then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      cancel() {
        this.dialogFormVisible = false;
        this.updateFilterList = [];
        this.resetTemp();
      },
      keyCancel() {
        this.keyList = null;
        this.keyArr = [];
        this.keyVisible = false;
      },
      handleCreate() {
        this.api_id = undefined;
        this.getFilterList();
        this.dialogTitle = '新增接口';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      routeCancel() {
        this.routeVisible = false;
      },
      routeUpdate() {
        this.routeVisible = true;
        updateApiRouterInfo(this.routeUpdateApiId, this.routeForm).then(() => {
          this.routeVisible = false;
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
            delObj(row.apiId)
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
      ,
      handleUpdate(row) {
        getOneApiBaseInfo(row.apiId)
          .then(response => {
            this.dialogTitle = '修改接口';
            this.form = response.data;
            this.dialogStatus = 'update';
            this.dialogFormVisible = true;
          });
        if (typeof row.apiId !== 'undefined') {
          this.api_id = row.apiId;
          this.getUpdateFilterList();
        }
      }
      ,
      handleKey(row) {
        getOneApiBaseInfo(row.apiId).then(response => {
          const status = response.status;
          if (status === 200) {
            this.keyVisible = true;
            this.keyArr.push(response.data);
            this.keyList = this.keyArr;
          } else if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          }
        });
      }
      ,
      handleRoute(row) {
        this.routeUpdateApiId = row.apiId;
        getOneApiRouterDefineInfo(row.apiId).then(response => {
          const status = response.status;
          if (status === 200) {
            this.routeVisible = true;
            this.routeForm = response.data;
          } else if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          }
        });
      },
      resetTemp() {
        this.form = {
          apiName: undefined,
          baseUrl: undefined,
          path: undefined,
          method: '',
          responsiblePersonName: undefined,
          responsiblePersonTel: undefined
        };
        this.filterList = [];
        this.originList = [];
        this.selectedFilterList = [];
      }
      ,
      // 将左边表格选择项存入filterData中
      handleFilterChange(rows) {
        this.filterData = [];
        if (rows) {
          rows.forEach(row => {
            if (row) {
              this.filterData.push(row);
            }
          });
        }
      }
      ,
      // 左边表格选择项移到右边
      addFilter() {
        setTimeout(() => {
          this.$refs["filterTable"].clearSelection();
          this.$refs["selectedFilterTable"].clearSelection();
        }, 0);
        let repeat = false;
        this.selectedFilterList.forEach(item => {
          if (this.filterData[0] && item.key === this.filterData[0].key) {
            repeat = true;
            alert("过滤器已添加");
            return;
          }
        });
        if (repeat === false) {
          this.filterData.forEach(item => {
            this.selectedFilterList.push(item);
          });
          for (let i = 0; i < this.filterList.length; i++) {
            for (let j = 0; j < this.filterData.length; j++) {
              if (
                this.filterList[i] &&
                this.filterData[j] &&
                this.filterList[i].key === this.filterData[j].key
              ) {
                this.filterList.splice(i, 1);
              }
            }
          }
        }
      }
      ,
      // 右边表格选择项移到左边
      removeFilter() {
        setTimeout(() => {
          this.$refs["filterTable"].clearSelection();
          this.$refs["selectedFilterTable"].clearSelection();
        }, 0);
        this.selectedFilterData.forEach(item => {
          this.filterList.push(item);
        });
        for (let i = 0; i < this.selectedFilterList.length; i++) {
          for (let j = 0; j < this.selectedFilterData.length; j++) {
            if (
              this.selectedFilterList[i] &&
              this.selectedFilterData[j] &&
              this.selectedFilterList[i].key === this.selectedFilterData[j].key
            ) {
              this.selectedFilterList.splice(i, 1);
            }
          }
        }
      }
      ,
      // 将右边表格选择项存入selectedFilterData中
      handleSelectedFilterChange(rows) {
        this.selectedFilterData = [];
        if (rows) {
          rows.forEach(row => {
            if (row) {
              this.selectedFilterData.push(row);
            }
          });
        }
      }
      ,
      submitAuthData() {
        let filterIdValueSet = new Set(this.selectedFilterList);
        // 取原始权限和待提交的权限列表的交集
        let diffOriginAndInterAct = [];
        let diffFilterIdValueAndInterAct = [];
        filterIdValueSet.forEach(d => {
          diffFilterIdValueAndInterAct.push(d.key);
        });
        let req_json = {addIdList: diffFilterIdValueAndInterAct, deleteIdList: diffOriginAndInterAct};
        this.filterUserjson = req_json;
      },
      submitUpdateAuthData() {
        let originAuthSet = new Set(this.originList);
        let filterIdValueSet = new Set(this.selectedFilterList);
        // 取原始权限和待提交的权限列表的交集
        let interactAuthSet = [...originAuthSet].filter(x => [...filterIdValueSet].some(y => y.key === x.key));
        // 将原始权限与交集取差集，获得删除的权限
        let diffOriginAndInterActObjArr = [...originAuthSet].filter(x => [...interactAuthSet].every(y => y.key !== x.key));
        // 将待提交的权限与交集取差集，获得新增的权限t
        let diffFilterIdValueAndInterActObjArr = [...filterIdValueSet].filter(x => [...interactAuthSet].every(y => y.key !== x.key));
        // 提交请求
        let diffOriginAndInterAct = [];
        let diffFilterIdValueAndInterAct = [];
        diffOriginAndInterActObjArr.forEach(d => {
          diffOriginAndInterAct.push(d.key);
        });
        diffFilterIdValueAndInterActObjArr.forEach(d => {
          diffFilterIdValueAndInterAct.push(d.key);
        });
        let req_json = {addIdList: diffFilterIdValueAndInterAct, deleteIdList: diffOriginAndInterAct};
        this.filterUserjson = req_json;
      }
      ,
      onCopy() {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      }
      ,
      // 复制失败
      onError() {
        this.$message({
          message: '复制失败',
          type: 'error',
          duration: 1500
        })
      }
      ,
      isShowButton(id) {
        if (id === '1h5OiYUc') {
          this.timeVisible = true;
        } else if (id === '1h5OiYUo') {
          this.JsonFilterVisible = true;
        } else if (id === '1h5OiYUs') {
          this.whiteListVisible = true;
        }
      }
      ,
      allUsers() {
        all().then(response => {
          response.forEach(item => {
            let obj = {};
            obj.label = item.username;
            obj.value = item.id;
            this.userOptions.push(obj)
          })
        })
      }
      ,
      chooseTimeRange: function (t) {
        const t1 = t.toString();
        this.stime = this.getTime(t1.substring(0, t1.lastIndexOf(',')));
        this.etime = this.getTime(t1.substring(t1.indexOf(',') + 1));
      }
      ,
      getTime(val) {
        const d = new Date(val);
        return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
      }
      ,
      handleTimeCreate() {
        this.dialogTimeTitle = '上网时间控制';
        this.dialogTimeStatus = 'create';
        this.timeIndexVisible = true;
      }
      ,
      handleIPCreate() {
        this.dialogIPTitle = '网站过滤';
        this.dialogIPStatus = 'create';
        this.IPVisible = true;
      }
      ,
      handleJsonFilterCreate() {
        this.dialogJsonFilterTitle = 'Json过滤';
        this.dialogJsonFilterStatus = 'create';
        this.JsonFilterIndexVisible = true;
      }
      ,
      handleTimeUpdate(row) {
        getOneApiTimeFilter(row.id)
          .then(response => {
            const result = response.data;
            this.dialogTimeTitle = '修改时间';
            this.readonly = true;
            this.startplaceholder = result.stime;
            this.endplaceholder = result.etime;
            this.updateTimeId = result.id;
            this.dialogTimeStatus = 'update';
            this.timeVisible = true;
          });
      }
      ,
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
      }
      ,
      handleIPUpdate(row) {
        getOneApiIPFilter(row.id)
          .then(response => {
            this.dialogIPTitle = '修改路由';
            this.IPForm = response.data;
            this.updateWhiteId = response.data.id;
            this.dialogIPStatus = 'update';
            this.IPVisible = true;
          });
      }
      ,
      handleIPDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(response => {
            const status = response.status;
            if (status === 20500) {
              this.$message({
                message: response.message,
                type: 'error',
                duration: 1500
              })
            } else {
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
            }
          });
      }
      ,
      handleJsonFilterUpdate(row) {
        getOneApiJsonKeyInfo(row.id)
          .then(response => {
            this.dialogJsonFilterTitle = '修改路由';
            this.JsonFilterForm = response.data;
            this.updateJsonId = response.data.id;
            this.dialogJsonFilterStatus = 'update';
            this.JsonFilterVisible = true;
          });
      }
      ,
      handleJsonFilterDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(response => {
            const status = response.status;
            if (status === 20500) {
              this.$message({
                message: response.message,
                type: 'error',
                duration: 1500
              })
            } else {
              delOneApiJsonKeyInfo(row.id)
                .then(() => {
                  this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                  });
                  const index = this.jsonFilterList.indexOf(row);
                  this.jsonFilterList.splice(index, 1);
                });
            }
          });
      }
      ,
      create() {
        this.submitAuthData();
        this.$set(this.middle, 'filterUserjson', this.filterUserjson);
        const obj = Object.assign(this.form, this.middle);
        addObj(obj).then(response => {
          const status = response.status;
          if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          } else {
            this.resetTemp();
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          }
        });

      }
    }
    ,
    TimeCreate() {
      this.timeIndexVisible = false;
      const obj = {};
      obj.stime = this.stime;
      obj.etime = this.etime;
      obj.apiId = this.curr;
      addObj1(obj)
        .then(response => {
          const status = response.status;
          if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          } else {
            this.resetTimeTemp();
            this.timeIndexVisible = false;
            this.getTimeList(this.curr);
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          }
        })
    }
    ,
    IPCreate() {
      this.IPVisible = false;
      const obj = {};
      obj.ipContent = this.IPForm.ipContent;
      obj.ipNote = this.IPForm.ipNote;
      obj.apiId = this.curr;
      addObj2(obj)
        .then(response => {
          const status = response.status;
          if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          } else {
            this.resetIPTemp();
            this.IPVisible = false;
            this.getWhiteList(this.curr);
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          }
        })
    }
    ,
    JsonFilterCreate() {
      this.JsonFilterIndexVisible = false;
      const obj = {};
      obj.fromUser = this.JsonFilterForm.fromUser;
      obj.fieldList = this.JsonFilterForm.fieldList;
      obj.apiId = this.curr;
      addApiJsonKeyFilter(obj)
        .then(response => {
          const status = response.status;
          if (status === 20500) {
            this.$message({
              message: response.message,
              type: 'error',
              duration: 1500
            })
          } else {
            this.resetJsonTemp();
            this.JsonFilterIndexVisible = false;
            this.getJsonFilterList(this.curr);
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          }
        })
    }
    ,
    TimeCancel() {
      this.timeIndexVisible = false;
    }
    ,
    JsonFilterCancel() {
      this.JsonFilterIndexVisible = false;
    }
    ,
    IPCancel() {
      this.resetIPTemp();
      this.IPVisible = false;
    }
    ,
    TimeUpdate() {
      this.timeVisible = false;
      const obj = {};
      obj.stime = this.stime;
      obj.etime = this.etime;
      obj.apiId = this.curr;
      obj.id = this.updateTimeId;
      putObj1(this.updateTimeId, obj).then(response => {
        const status = response.status;
        if (status === 20500) {
          this.$message({
            message: response.message,
            type: 'error',
            duration: 1500
          })
        } else {
          this.resetTimeTemp();
          this.timeVisible = false;
          this.getTimeList(this.curr);
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        }
      });
    }
    ,
    IPUpdate() {
      this.IPVisible = false;
      const obj = {};
      obj.ipContent = this.IPForm.ipContent;
      obj.ipNote = this.IPForm.ipNote;
      obj.apiId = this.curr;
      obj.id = this.updateWhiteId;
      putObj2(this.updateWhiteId, obj).then(response => {
        const status = response.status;
        if (status === 20500) {
          this.$message({
            message: response.message,
            type: 'error',
            duration: 1500
          })
        } else {
          this.resetIPTemp();
          this.IPVisible = false;
          this.getWhiteList(this.curr);
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        }
      });
    }
    ,
    JsonFilterUpdate() {
      this.JsonFilterVisible = false;
      const obj = {};
      obj.fromUser = this.JsonFilterForm.fromUser;
      obj.fieldList = this.JsonFilterForm.fieldList;
      obj.apiId = this.curr;
      obj.id = this.updateJsonId;
      updateOneApiJsonKeyInfo(this.updateJsonId, obj).then(response => {
        const status = response.status;
        if (status === 20500) {
          this.$message({
            message: response.message,
            type: 'error',
            duration: 1500
          })
        } else {
          this.resetJsonTemp();
          this.JsonFilterVisible = false;
          this.getJsonFilterList(this.curr);
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          });
        }
      });
    }
    ,
    resetIPTemp() {
      this.IPForm = {
        ipContent: undefined,
        ipNote: undefined
      }
    }
    ,
    resetJsonTemp() {
      this.JsonFilterForm = {
        fromUser: undefined,
        fieldList: undefined
      }
    }
    ,
    resetTimeTemp() {
      this.startplaceholder = '开始时间';
      this.endplaceholder = '结束时间'
    }
    ,
    getTimeList(curr) {
      getApiTimeFilterInfoList(curr).then(response => {
        const result = response;
        this.timeDiv = result.IsFilter;
        if (result.IsFilter) {
          this.timeList = result.apiTimeFilterInfoList;
        }
      });
    }
    ,
    getWhiteList(curr) {
      getApiIPFilterInfoList(curr).then(response => {
        const result = response;
        this.whiteListDiv = result.IsIPFilter;
        if (result.IsIPFilter) {
          this.whiteListList = result.apiIPFilterInfoList;
        }
      });
    }
    ,
    getJsonFilterList(curr) {
      getAllapiJsonKeyInfoList(curr).then(response => {
        const result = response;
        this.jsonFilterDiv = result.IsFilter;
        if (result.IsFilter) {
          this.jsonFilterList = result.apiJsonFilterInfoList;
        }
      });
    }
  }
</script>

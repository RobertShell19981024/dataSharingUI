<template>
  <div class="app-container calendar-list-container">
    <!--<el-row>-->
    <!--<el-input v-model="form.apiId" placeholder="apiId" class="FORM"></el-input>-->
    <!--   </el-form-item>
      </el-row>-->
    <el-form :model="form" label-width="100px" :rules="rules">
      <el-form-item label="接口Id" prop="apiId" v-show="isShow">
        <el-input v-model="api_id" placeholder="apiId" class="FORM" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="接口名称" prop="apiName">
        <el-input v-model="form.apiName" placeholder="接口名称" class="FORM"></el-input>
      </el-form-item>
      <el-form-item label="IP访问地址" prop="baseUrl">
        <el-input v-model="form.baseUrl" placeholder="IP访问地址" class="FORM"></el-input>
      </el-form-item>
      <el-form-item label="后缀地址" prop="path">
        <el-input v-model="form.path" placeholder="后缀地址" class="FORM"></el-input>
      </el-form-item>
      <el-form-item label="方法" prop="method">
        <el-select v-model="form.method" placeholder="请选择" style="margin-bottom: 10px">
          <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人名称" prop="responsiblePersonName">
        <el-input v-model="form.responsiblePersonName" placeholder="接口负责人名称" class="FORM"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话" prop="responsiblePersonTel">
        <el-input v-model="form.responsiblePersonTel" placeholder="接口负责人电话" class="FORM"></el-input>
      </el-form-item>
      <el-transfer v-model="filterIdValue" :data="filterData" :titles="['所有过滤器列表', '有权访问过滤器列表']"></el-transfer>
      <el-button type="primary" v-if="!isShow" @click="handleCreate">
       添加API信息
      </el-button>
      <el-button type="primary" v-if="isShow" @click="handleUpdate">
       修改API信息
      </el-button>
    </el-form>
  </div>
</template>

<style type="text/css">
  .FORM {
    width: 50%;
    margin-bottom: 10px;
  }

  .el-transfer-panel {
    width: 400px;
    height: 300px;
  }

  .el-transfer-panel__list.is-filterable {
    height: 400px;
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
    getFilterByApiId
  } from '@/api/myPublish/apiUserFilter/index';

  import {
    getAllPublisherFilter
  } from '@/api/myPublish/addApi/index';

  export default {

    created() {
      this.isShow = this.$route.query.isShow;//获取上个页面传递的id,在下面获取数据的时候先提交id
      this.api_id = this.$route.query.id
    },
    data() {
      // baseURL 校验
      let urlValidate = (rule, value, callback) => {
        // base_url 正则，匹配http或https开头,host为IP:端口或域名:端口,不允许携带任何后缀
        let base_url_reg = new RegExp('^((https|http)?://)(([0-9]{1,3}.){3}[0-9]{1,3})(:[0-9]{1,5})(?!.)|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6}(:[0-9]{1,5})?(?!.)$');
        if (value === '' || value === undefined) {
          callback(new Error('请输入baseURL'));
        } else if (!base_url_reg.test(value)) {
          callback(new Error('baseURL格式错误，请检查格式(例:http://10.10.10.10:8080)'));
        } else {
          callback();
        }
      };
      // path 校验
      let pathValidate = (rule, value, callback) => {
        // path正则表达式,匹配/xxx一次或多次,不能以字符/结尾
        let path_reg = new RegExp('\/.+');
        if (value === '' || value === undefined) {
          callback(new Error('请输入path'));
        } else if (!path_reg.test(value)) {
          callback(new Error('path格式错误，请检查格式(例:/getInfo/getId)'));
        } else {
          callback();
        }
      };
      // path 校验
      let phoneValidate = (rule, value, callback) => {
        // path正则表达式,匹配/xxx一次或多次,不能以字符/结尾
        let path_reg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
        if (value === '' || value === undefined) {
          callback(new Error('请输入手机号'));
        } else if (!path_reg.test(value)) {
          callback(new Error('手机号格式错误，请输入正确的格式'));
        } else {
          callback();
        }
      };
      return {
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
        form: {
          apiName: undefined,
          baseUrl: undefined,
          path: undefined,
          method: 'get',
          responsiblePersonName: undefined,
          responsiblePersonTel: undefined
        },
        isShow: false,
        rules: {
          apiName: [
            {
              required: true,
              message: '请输入api名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], baseUrl: [
            {
              required: true,
              trigger: 'blur',
              validator: urlValidate
            }
          ], path: [
            {
              required: true,
              trigger: 'blur',
              validator: pathValidate
            }
          ], method: [
            {
              required: true,
              message: '请选择method',
              trigger: 'blur'
            }
          ], responsiblePersonName: [
            {
              required: true,
              message: '请填写负责人姓名',
              trigger: 'blur'
            }
          ], responsiblePersonTel: [
            {
              required: true,
              trigger: 'blur',
              validator: phoneValidate
            }
          ]
        },
        filterData: [],
        filterIdValue: [],
        originList: [],
        filterUserjson: {},
        api_id: undefined,
        middle: {},
      }
    }, methods: {
      handleUpdate() {
        let base_url_reg = new RegExp('^((https|http)?://)(([0-9]{1,3}.){3}[0-9]{1,3})(:[0-9]{1,5})(?!.)|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6}(:[0-9]{1,5})?(?!.)$');
        let path_reg = new RegExp('\/.+');
        if (typeof this.form.apiName != 'undefined' && typeof this.form.baseUrl != 'undefined' && typeof this.form.path != 'undefined' && typeof this.form.responsiblePersonName != 'undefined' && typeof this.form.responsiblePersonTel != 'undefined'
          &&base_url_reg.test(this.form.baseUrl)&&path_reg.test(this.form.path)&&this.form.apiName.length>=3
        ) {       this.submitAuthData();
          const obj1 = {};
          obj1.filterUserjson = this.filterUserjson;
          const obj = Object.assign(this.form, obj1);
          putObj(this.api_id, obj).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          })
      } else {
          this.$notify({
            title: '失败',
            message: '修改失败',
            type: 'error',
          });
      }
      },
      handleCreate() {
        let base_url_reg = new RegExp('^((https|http)?://)(([0-9]{1,3}.){3}[0-9]{1,3})(:[0-9]{1,5})(?!.)|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6}(:[0-9]{1,5})?(?!.)$');
        let path_reg = new RegExp('\/.+');
        if (typeof this.form.apiName != 'undefined' && typeof this.form.baseUrl != 'undefined' && typeof this.form.path != 'undefined' && typeof this.form.responsiblePersonName != 'undefined' && typeof this.form.responsiblePersonTel != 'undefined'
        &&base_url_reg.test(this.form.baseUrl)&&path_reg.test(this.form.path)&&this.form.apiName.length>=3
        ) {
          this.submitAuthData();
          this.$set(this.middle, 'filterUserjson', this.filterUserjson);
          const obj = Object.assign(this.form, this.middle);
          addObj(obj)
            .then(() => {
              this.resetTemp();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })

        } else {
          this.$notify({
          title: '失败',
          message: '创建失败',
          type: 'error',
        });
       }
      },
      resetTemp() {
        this.form = {
          apiName: undefined,
          baseUrl: undefined,
          path: undefined,
          method: 'get',
          responsiblePersonName:
          undefined,
          responsiblePersonTel:
          undefined
        }
      },
      submitAuthData() {
        let originAuthSet = new Set(this.originList);
        let filterIdValueSet = new Set(this.filterIdValue);
        // 取原始权限和待提交的权限列表的交集
        let interactAuthSet = new Set([...originAuthSet].filter(x => filterIdValueSet.has(x)));
        // 将原始权限与交集取差集，获得删除的权限
        let diffOriginAndInterAct = new Set([...originAuthSet].filter(x => !interactAuthSet.has(x)));
        // 将待提交的权限与交集取差集，获得新增的权限
        let diffFilterIdValueAndInterAct = new Set([...filterIdValueSet].filter(x => !interactAuthSet.has(x)));
        // 提交请求
        let req_json = {addIdList: diffFilterIdValueAndInterAct, deleteIdList: diffOriginAndInterAct};
        this.filterUserjson = req_json;
      }
    },
    mounted() {
      getAllPublisherFilter(this.api_id).then(response => {
        let rsp_data = response;
        let all_filters = rsp_data.allFilter;
        let api_user_filters = rsp_data.apiUserFilterList;
        if(all_filters!=null&&all_filters.length>0){
        for (let index = 0; index < all_filters.length; index++) {
          const element = all_filters[index];
          this.filterData.push({key: element.id, label: element.filterName});
        }
        }
        if(api_user_filters.length>0){
        for (let index = 0; index < api_user_filters.length; index++) {
          const element = api_user_filters[index];
          this.filterIdValue.push(element.filterDouterId);
          this.originList.push(element.filterDouterId);
        }}
      });

      if (typeof this.api_id !== 'undefined') {
        getOneApiBaseInfo(this.api_id)
          .then(response => {
            this.form = response.data;
          });
      }
    }
  }
</script>

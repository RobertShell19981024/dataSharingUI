<template>
  <div class="app-container calendar-list-container">
    <el-form :model="form" label-width="100px" :rules=rules>
      <el-form-item label="访问地址" prop="path">
        <el-input v-model="form.path" placeholder="访问地址" class="FORM"></el-input>
      </el-form-item>
      <el-row style="margin-left: 100px;margin-bottom: 50px">
      <el-transfer v-model="filterIdValue" :data="filterData" :titles="['所有过滤器列表', '有权访问过滤器列表']"></el-transfer>
      </el-row>
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
    getObj,
    delObj,
    putObj
  } from '@/api/myRequest/requestInterfaceManage/index';
  import {
    getAllRequestFilter
  } from '@/api/myPublish/apiRouterFilter/index';
  export default {
    created() {
      this.jgId = this.$route.query.jgId;//获取上个页面传递的id,在下面获取数据的时候先提交id
      this.isShow = this.$route.query.isShow;
    },
    data() {
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
      return {
        form: {
          path: undefined
        },
        jgId:'',
        isShow: false,
        middle: {},
        filterData: [],
        filterIdValue: [],
        originList: [],
        rules: {
          path: [
            {
              required: true,
              message: '请输入访问地址别称',
              trigger: 'blur'
            },
            {
              required: true,
              trigger: 'blur',
              validator: pathValidate
            }
          ]
        }
      }
    }, methods: {

      handleUpdate() {
        let path_reg = new RegExp('\/.+');
        if(typeof this.form.path != 'undefined'&&path_reg.test( this.form.path)){
          this.submitAuthData();
          const obj1 = {};
          obj1.filterUserjson = this.filterUserjson;
          obj1.path = this.form.path;
          putObj(this.jgId,obj1).then(()=>{
            this.resetTemp();
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          });
        }else {
          this.$notify({
            title: '失败',
            message: '修改失败',
            type: 'error',
          });
        }

      },
      handleCreate() {
        let path_reg = new RegExp('\/.+');
        if(typeof this.form.path != 'undefined'&&path_reg.test( this.form.path)){
        this.submitAuthData();
        this.$set(this.middle,'filterUserjson',this.filterUserjson);
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
        }else {
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'error',
          });
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
      },
      resetTemp() {
        this.form = {
          path:undefined
        }
      }
    },
    mounted() {
      getAllRequestFilter(this.jgId).then(response => {
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

      if (typeof this.jgId !== 'undefined') {
        getObj(this.jgId)
          .then(response => {
            this.form.path = response.data.uri;
          });
      }
    }
  }
</script>

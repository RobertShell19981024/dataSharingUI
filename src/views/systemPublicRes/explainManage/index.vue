<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-input v-model="form.apiId" placeholder="apiId" class="FORM"></el-input>
    </el-row>
    <el-row>
      <el-input v-model="form.apiName" placeholder="api名称" class="FORM"></el-input>
    </el-row>
    <el-row>
      <el-input v-model="form.apiBaseUrl" placeholder="api-baseurl" class="FORM"></el-input>
    </el-row>
    <el-row>
      <el-input v-model="form.path" placeholder="api-path" class="FORM"></el-input>
    </el-row>
    <el-row>
      <el-select v-model="form.method" placeholder="请选择" style="margin-bottom: 10px">
        <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-row>
    <el-row>
      <el-input v-model="form.responsiblePersonName" placeholder="api-负责人名称" class="FORM"></el-input>
    </el-row>
    <el-row>
      <el-input v-model="form.responsiblePersonTel" placeholder="api-负责人电话" class="FORM"></el-input>
    </el-row>
    <el-row>
      公钥
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </el-row>
    <el-row>
      私钥
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </el-row>
    <el-row>
      密钥
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </el-row>
    <el-row>
      <el-transfer v-model="filterIdValue" :data="filterData" :titles="['所有过滤器列表', '有权访问过滤器列表']"></el-transfer>
    </el-row>
    <el-row>
      <el-button type="primary" v-if="!isShow" @click="handleCreate"><router-link to="myInterfaceManage">添加API信息</router-link></el-button>
      <el-button type="primary" v-else="isShow" @click="handleUpdate"><router-link to="myInterfaceManage">修改API信息</router-link></el-button>
    </el-row>
  </div>
</template>

<style type="text/css">
  .FORM{
    width: 50%;
    margin-bottom: 10px;
  }
  .el-transfer-panel{
    width: 400px;
    height: 300px;
  }
  .el-transfer-panel__list.is-filterable{
    height: 400px;
  }
</style>
<script>
  export default {

    created(){
      this.isShow = this.$route.query.isShow;//获取上个页面传递的id,在下面获取数据的时候先提交id
    },
    data() {
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
          apiId: undefined,
          apiName: undefined,
          apiBaseUrl: undefined,
          path: undefined,
          method: 'get',
          responsiblePersonName: undefined,
          responsiblePersonTel: undefined
        },
        isShow:false,
      }
    },methods:{
      handleUpdate(){
        this.isShow = false
        location.reload()
      },
      handleCreate(){
        this.isShow = true
        location.reload()
      }
    }
  }
</script>

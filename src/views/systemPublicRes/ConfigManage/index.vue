<template>
  <div class="app-container calendar-list-container">

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
  </div>
</template>

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

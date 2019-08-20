<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" style="margin-top:10px">
      <el-form-item label="API名称">
        <el-select v-model="form.name" placeholder="请选择API名称">
          <el-option label="铜山不动产点对点" value="shanghai"></el-option>
          <el-option label="沛县不动产点对点" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="method">
        <el-select v-model="form.region" placeholder="请选择method">
          <el-option label="get" value="shanghai"></el-option>
          <el-option label="post" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="contentType">
        <el-select v-model="form.region" placeholder="请选择method">
          <el-option label="application/json" value="shanghai"></el-option>
          <el-option label="text/xml" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="body内容">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发送请求</el-button>
        <el-button type="danger" @click="refreshPage">重试</el-button>
      </el-form-item>
    </el-form>

    <h3 style="margin-left:10px">返回的内容:</h3>
    <div style="width: 90%;border: 1px solid;height: 200px;margin: 10px;">
      {{responseText}}
    </div>
  </div>
</template>
<script>
  export default {
    name: "index",
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '例如:[{name:张三},{name:李四}]'
        },
        responseText: ``
      };
    },
    methods: {
      onSubmit() {
        this.responseText = `{
          status:200,
          data:[{age:15,name:"李四"},{age:16,name:"张三"}],
          sign:"a8dsad786786asd78a6d78a876da78"
          }`;
      },
      refreshPage(){
        this.responseText = ``;
      }
    }
  };
</script>
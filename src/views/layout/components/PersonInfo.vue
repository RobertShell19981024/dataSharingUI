<template>
    <div>
        <el-form :model="form" ref="form">
            <el-form-item label="机构名称" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>   
            <el-form-item label="负责人姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.attr1"></el-input>
                </el-form-item>
            <el-form-item label="负责人电话" :label-width="formLabelWidth">
                <el-input v-model="form.telPhone"></el-input>
            </el-form-item>
            <el-form-item label="机构地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            <el-form-item label="机构简介" :label-width="formLabelWidth">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="generateCorpBaseInfo">提交</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        getCorpBaseInfo,
        updateCorpBaseInfo
    } from "@/api/baseInfo/corpInfo/index";
    export default {
        data() {
            return {
                form: {
                    name: undefined,
                    address: undefined,
                    telPhone: undefined,
                    description: undefined,
                    attr1: undefined
                },
                formLabelWidth: '100px',
                dialogFormVisible: false
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                //获取后台生成的信息显示在界面
                getCorpBaseInfo().then(rsp => {
                    let rsp_data = rsp.data;
                    this.form = rsp.data;
                    this.reset_form = rsp.data;
                });
            },
            generateCorpBaseInfo() {
                updateCorpBaseInfo(this.form)
                    .then(rsp => {
                        let rsp_data = rsp.data;
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.form = rsp.data;
                        this.$emit('closeModifyPersonInfo')
                    }).catch(rsp => {
                        this.$notify({
                            title: '失败',
                            message: '修改失败',
                            type: 'warning',
                            duration: 2000
                        });
                    });
            },
            resetForm(refName) {
                this.getList();
            }
        }
    };
</script>
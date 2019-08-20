<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入url"
                v-model="listQuery.url">
            </el-input>
            <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column type="index" align="center" width="93" label="序号">
            </el-table-column>
            <el-table-column align="center" width="250px" label="路径前缀">
                <template slot-scope="scope">
                    <span>{{scope.row.path}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="350px" label="转发URL">
                <template slot-scope="scope">
                    <span>{{scope.row.url}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否可重试">
                <template slot-scope="scope">
                    <span>{{scope.row.retryable}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否可用">
                <template slot-scope="scope">
                    <span>{{scope.row.enabled}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="转发时是否去除路径前缀">
                <template slot-scope="scope">
                    <span>{{scope.row.stripPrefix}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                <el-form-item label="路径前缀" prop="path">
                    <el-input v-model="form.path" placeholder="请输入路径前缀,格式:/xxx/**"></el-input>
                </el-form-item>
                <el-form-item label="转发url" prop="url">
                    <el-input v-model="form.url" placeholder="请输入转发URL,例如:http://127.0.0.1:8080"></el-input>
                </el-form-item>
                <el-form-item label="是否可重试" prop="retryable">
                    <el-switch v-model="form.retryable" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否可用" prop="enabled">
                    <el-switch v-model="form.enabled" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="去除路径前缀" prop="stripPrefix">
                    <el-switch v-model="form.stripPrefix" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
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
    } from '@/api/interface/pathConfig/index';
    export default {
        name: 'apiRouterDefine',
        data() {
            // url 校验
            let urlValidate = (rule, value, callback) => {
                // base_url 正则，匹配http或https开头,host为IP:端口或域名:端口,不允许携带任何后缀
                let base_url_reg = new RegExp('^((https|http)?://)(([0-9]{1,3}.){3}[0-9]{1,3})(:[0-9]{1,5})(?!.)|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6}(:[0-9]{1,5})?(?!.)$');
                if (value === '' || value === undefined) {
                    callback(new Error('请输入baseURL'));
                } else if (!base_url_reg.test(value)) {
                    callback(new Error('url格式错误，请检查格式(例:http://10.10.10.10:8080)'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    path: undefined, url: undefined, retryable: false, enabled: false, stripPrefix: false
                },
                rules: {
                    path: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '请输入路径前缀,格式:/xxx/**'
                        }
                    ], url: [
                        {
                            required: true,
                            trigger: 'blur',
                            validator: urlValidate,
                            message:'url格式错误，请检查格式(例:http://10.10.10.10:8080)'
                        }
                    ]
                },
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    url: undefined
                },
                tableKey: 0,
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                page(this.listQuery)
                    .then(response => {
                        this.list = response.data.rows;
                        this.total = response.data.total;
                        this.listLoading = false;
                    })
            },
            handleFilter() {
                this.getList();
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                getObj(row.id)
                    .then(response => {
                        this.form = response.data;
                        this.dialogFormVisible = true;
                        this.dialogStatus = 'update';
                    });
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
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
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            cancel(formName) {
                this.dialogFormVisible = false;
                const set = this.$refs;
                set[formName].resetFields();
            },
            create(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        addObj(this.form)
                            .then(() => {
                                this.dialogFormVisible = false;
                                this.getList();
                                this.$notify({
                                    title: '成功',
                                    message: '创建成功',
                                    type: 'success',
                                    duration: 2000
                                });
                            })
                    } else {
                        return false;
                    }
                });
            },
            update(formName) {
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        this.form.password = undefined;
                        putObj(this.form.id, this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success',
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
                    path: undefined, url: undefined, retryable: false, enabled: false, stripPrefix: false
                }
            }
        }
    }
</script>

<style scoped>

</style>
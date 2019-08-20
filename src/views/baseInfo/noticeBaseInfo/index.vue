<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入通知类型说明"
                v-model="listQuery.noticeNote">
            </el-input>
            <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">
                添加</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
            style="width: 100%">
            <el-table-column type="index" align="center" width="93" label="序号">
            </el-table-column>
            <el-table-column align="center" width="250px" label="机构名">
                    <template slot-scope="scope">
                        <span>{{scope.row.noticeId}}</span>
                    </template>
                </el-table-column>
            <el-table-column align="center" width="250px" label="机构名">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="200px" label="用户名">
                <template slot-scope="scope">
                    <span>{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="300px" label="用户地址">
                <template slot-scope="scope">
                    <span>{{scope.row.noticePath}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="访问方式">
                <template slot-scope="scope">
                    <span>{{scope.row.method== 'get' ? '非加密(get)' : '加密(post)'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型种类">
                <template slot-scope="scope">
                    <span>{{scope.row.typeID}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型说明">
                <template slot-scope="scope">
                    <span>{{scope.row.noticeNote}}</span>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                <el-form-item label="通知地址" prop="noticePath" :label-width="formLabelWidth">
                    <el-input v-model="form.noticePath" placeholder="请输入基础URL(例如:http://192.168.1.1:8080/test)"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否加密" prop="method" :label-width="formLabelWidth">
                    <el-select v-model="form.method" placeholder="请选择">
                        <el-option label="非加密" value="get"></el-option>
                        <el-option label="加密" value="post"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型ID" prop="typeID" :label-width="formLabelWidth">
                    <el-select v-model="form.typeID" placeholder="请选择">
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
                    </el-select>
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
        updateBaseInfo,
        selectNoticeBaseInfoByUserid,
        insertNoticeBaseInfo,
        delObj,
        getObj,
        putObj
    } from "@/api/baseInfo/noticeBaseInfo/index";
    export default {
        name: 'noticeBaseInfo',
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
                    name: undefined, username: undefined, noticePath: undefined, method: undefined, typeID: undefined, noticeNote: undefined
                },
                rules: {
                    noticePath: [
                        {
                            required: true,
                            trigger: 'blur',
                            validator: urlValidate
                        }
                    ],
                    method: [
                        {
                            required: true,
                            message: '请选择加密方式'
                        }
                    ],
                    typeID: [
                        {
                            required: true,
                            message: '请选择通知类型'
                        }
                    ]
                },
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    noticeNote: undefined
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
                getObj(row.noticeId)
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
                    delObj(row.noticeId)
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
                        insertNoticeBaseInfo(this.form)
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
                        putObj(this.form.noticeId, this.form).then(() => {
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
                    name: undefined, username: undefined, noticePath: undefined, method: undefined, typeID: undefined, noticeNote: undefined
                }
            }
        }
    }
</script>

<style scoped>

</style>
<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="API名称"
                v-model="listQuery.apiName">
            </el-input>
            <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column type="index" align="center" width="93" label="序号">
            </el-table-column>
            <el-table-column align="center" width="350px" label="api名称">
                <template slot-scope="scope">
                    <span>{{scope.row.apiName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="150px" label="类型">
                <template slot-scope="scope">
                    <span>{{(scope.row.apiPubkey != undefined && scope.row.apiPubkey != '') ?'安全接口':"通用接口"}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="150px" label="method">
                <template slot-scope="scope">
                    <span>{{scope.row.method}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="400px" label="path">
                <template slot-scope="scope">
                    <span>{{ scope.row.baseUrl + scope.row.path}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" label="启用状态">
                <template slot-scope="scope">
                    <span>{{scope.row.enabledStatus == true ? '正在使用':'未启用'}}</span>
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
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>


    </div>
</template>

<script>
    import { page } from '@/api/monitor/unifiedApisManage/index'
    export default {
        name: 'unifiedApisManage',
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    apiName: undefined
                },
                tableKey: 0
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                page(this.listQuery).then(rsp => {
                    this.listLoading = false;
                    this.list = rsp.data.rows;
                    this.total = rsp.data.total;
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
            }
        }
    }
</script>

<style scoped>

</style>

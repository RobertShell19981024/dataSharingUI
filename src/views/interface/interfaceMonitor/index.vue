<template>
    <div>
        <h1 style="text-align:center">最近一周接口访问统计</h1>
        <el-row style="background:#fff;padding:16px 8px 0;margin-bottom:32px;">
            <line-chart :chart-data="lineChartData"></line-chart>
        </el-row>
        <div class="filter-container">
            接口交互时间:<el-date-picker v-model="dateDuration" style="width:390px" type="daterange" align="right"
                unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"
                value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-button style="margin-top: 5px;" class="filter-item" type="primary" icon="search" @click="getChartData">搜索</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column type="index" align="center" width="93" label="序号">
            </el-table-column>
            <el-table-column style="width:10%" align="center" label="接口名称">
                <template slot-scope="scope">
                    <span>{{scope.row.apiName}}</span>
                </template>
            </el-table-column>
            <el-table-column style="width:10%" align="center" label="Path">
                <template slot-scope="scope">
                    <span>{{scope.row.apiUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column style="width:10%" align="center" label="访问者IP">
                <template slot-scope="scope">
                    <span>{{scope.row.accessClientIp}}</span>
                </template>
            </el-table-column>
            <el-table-column style="width:10%" align="center" label="接口交互时间">
                <template slot-scope="scope">
                    <span>{{scope.row.accessTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="250" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="success" @click="showRequestData(scope.row)">发送的数据
                    </el-button>
                    <el-button size="small" type="warning" @click="showResponseData(scope.row)">接收的数据
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper"
                :total="total"> </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDataFormVisible" style="word-break: break-all">
            {{httpData}}
        </el-dialog>
    </div>
</template>

<script>
    import LineChart from './LineChart'
    import {
        page, getApiAccessWeekRecord, getApiAccessRecordByPage
    } from '@/api/interface/interfaceMonitor/index';
    export default {
        components: {
            LineChart
        },
        data() {
            return {
                lineChartData: {
                    accessSumData: [],
                    xData: []
                },
                tableKey: 0,
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    startTime: undefined,
                    endTime: undefined
                },
                dialogStatus: '',
                textMap: {
                    requestTitle: 'request数据',
                    responseTitle: 'response数据'
                },
                dialogDataFormVisible: false,
                httpData: '',
                dateDuration: '', // 查询的时间区间
                pickerOptions2: { // 查询快捷选项
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
                }
            }
        },
        created() {
            this.getList();
            this.getChartData();
        },
        methods: {
            getChartData() {
                if ( this.dateDuration == null || this.dateDuration == '' || this.dateDuration[0] == undefined || this.dateDuration[1] == undefined) {
                    this.listQuery.startTime=null;
                    this.listQuery.endTime =null;
                    this.getList();
                } else {
                    this.listQuery.startTime = this.dateDuration[0] + ' 00:00:00';
                    this.listQuery.endTime = this.dateDuration[1] + ' 23:59:59';
                    this.getList();
                }
                getApiAccessWeekRecord().then(rsp => {
                    let rsp_data = rsp.data;
                    this.lineChartData.xData = [];
                    this.lineChartData.xData = rsp_data.dateArr;
                    this.lineChartData.accessSumData = [];
                    this.lineChartData.accessSumData = rsp_data.countArr;
                });
            },
            getList() {
                this.listLoading = true;
                getApiAccessRecordByPage(this.listQuery)
                    .then(response => {
                        this.list = response.data.rows;
                        this.total = response.data.total;
                        this.listLoading = false;
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
            // 显示request数据
            showRequestData(row) {
                this.dialogDataFormVisible = true;
                this.dialogStatus = 'requestTitle';
                this.httpData = '';
                this.httpData = row.requestData;
            },
            // 显示response数据
            showResponseData(row) {
                this.dialogDataFormVisible = true;
                this.dialogStatus = 'responseTitle';
                this.httpData = '';
                this.httpData = row.responseData;
            }

        }
    }
</script>

<style scoped>

</style>
<template>
    <div id="sdkDownload">
        <div class="sdk-div">
            <el-row>
                <el-col :span="3" :offset="2" style="border: 1px solid #bcbcbc;font-size: 20px;height:48px">
                    <div style="text-align: center;font-size: 36px">说明</div>
                </el-col>
                <el-col :span="16" style="border: 1px solid #bcbcbc;font-size: 15px;height:48px">
                    <div>ztgeo-sdk是软件开发集成工具包，内含加密、解密、加签、验签以及发送通知等方法，使用简单便捷，使用户更加专注于业务逻辑，提高软件开发的准确性，同时保障数据安全，实现数据的共享。</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3" :offset="2" style="border: 1px solid #bcbcbc;font-size: 20px;height:48px">
                    <div style="text-align: center;font-size: 36px">语言</div>
                </el-col>
                <el-col :span="8" style="text-align: center;font-size: 42px;border: 1px solid #bcbcbc;height:48px">
                    <div>Java</div>
                </el-col>
                <el-col :span="8" style="text-align: center;font-size: 42px;border: 1px solid #bcbcbc;height:48px">
                    <div>.Net</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3" :offset="2" style="border: 1px solid #bcbcbc;font-size: 20px;height:300px">
                    <div style="text-align: center;font-size: 36px;margin-top:120px">下载</div>
                </el-col>
                <el-col :span="8" style="text-align: center;font-size: 28px;border: 1px solid #bcbcbc;height:300px">
                    <div style="margin-top:50px">
                        <a :href="url_str+'/1'" style="line-height: 60px;" download="ztgeo-sdk.jar"><i class="el-icon-download" style="padding-right:10px"></i>ztgeo-sdk.jar</a><br/>
                        <a :href="url_str+'/2'" style="line-height: 60px;" download="ztgeo-sdk-source.zip"><i class="el-icon-download" style="padding-right:10px"></i>ztgeo-sdk-source.zip</a><br/>
                        <a :href="url_str+'/3'" style="line-height: 60px;" download="ztgeo-sdk-demo.zip"><i class="el-icon-download" style="padding-right:10px"></i>ztgeo-sdk-demo.zip</a>
                    </div>
                </el-col>
                <el-col :span="8" style="text-align: center;font-size: 28px;border: 1px solid #bcbcbc;height:300px">
                    <div style="margin-top:50px">
                        <a :href="url_str+'/1'" style="line-height: 60px;" download="ztgeo-sdk.zip"><i class="el-icon-download" style="padding-right:10px"></i>ztgeo-sdk.jar</a><br/>
                        <a :href="url_str+'/2'" style="line-height: 60px;" download="ztgeo-sdk.zip"><i class="el-icon-download" style="padding-right:10px"></i>ztgeo-sdk-source.zip</a><br/>
                        <a :href="url_str+'/3'" style="line-height: 60px;" download="ztgeo-sdk.zip"><i class="el-icon-download" style="padding-right:10px"></i>ztgeo-sdk-demo.zip</a>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {
        getJavaSDK
    } from "@/api/baseInfo/sdkDownload/index";
    export default {
        data() {
            return {
                url_str:'http://172.18.0.147:9998/sdkFileManage/downloadSDKFile' 
            }
        },
        methods: {
            
        }
    }
</script>

<style scoped>
    #sdkDownload{
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
        color: #606266
    }

    .sdk-div {
        margin-top: 100px;
    }

    a:hover {
        cursor: pointer;
        color: blue
    }

</style>
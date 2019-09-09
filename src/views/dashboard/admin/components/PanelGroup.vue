<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日接口访问量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="getCountPublishByApiUserIdAndBydayCount"
                    :duration="2600"></count-to>
          <span>次</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">访问总量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="getCountPublishByApiUserIdCount" :duration="3000"></count-to>
          <span>个</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="org" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">发布接口数量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="getCountPublishByApiOwnerIdCount"
                    :duration="3200"></count-to>
          <span>个</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="form" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">请求接口数量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="getCountRequsetByApiOwnerIdCount" :duration="3600"></count-to>
          <span>个</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {
    getCountPublishByApiOwnerId,
    getCountPublishByApiUserId,
    getCountPublishByApiUserIdAndByday,
    getCountRequsetByApiOwnerId
  } from '@/api/HomePage/index';

  export default {
    data() {
      return {
        getCountPublishByApiOwnerIdCount: '',
        getCountPublishByApiUserIdCount: '',
        getCountPublishByApiUserIdAndBydayCount: '',
        getCountRequsetByApiOwnerIdCount: '',
      }
    },
    components: {
      CountTo
    }
    ,
    created() {
      this.publishByApiOwnerId();
      this.publishByApiUserId();
      this.publishByApiUserIdAndByday();
      this.requsetByApiOwnerId();
    }
    ,
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },
      publishByApiOwnerId() {
        getCountPublishByApiOwnerId().then(response => {
          this.getCountPublishByApiOwnerIdCount = response.data;
        })
      },
      publishByApiUserId() {
        getCountPublishByApiUserId().then(response => {
          this.getCountPublishByApiUserIdCount = response.data;

        })
      },
      publishByApiUserIdAndByday() {
        getCountPublishByApiUserIdAndByday().then(response => {
          this.getCountPublishByApiUserIdAndBydayCount = response.data;

        })
      },
      requsetByApiOwnerId() {
        getCountRequsetByApiOwnerId().then(response => {
          this.getCountRequsetByApiOwnerIdCount = response.data;
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shoppingCard {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shoppingCard {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;

        }
      }
    }
  }
</style>

<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <span style="right: 90px;position: absolute;">欢迎您，{{name}}</span>

      <!-- <error-log class="errLog-container right-menu-item"></error-log> -->

      <!-- <lang-select class="international right-menu-item"></lang-select> -->

      <!-- <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
          <img class="user-avatar" src="../../../assets/personCenter1.svg">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <!-- {{$t('navbar.dashboard')}} -->
              首页
            </el-dropdown-item>
          </router-link>
          <!--<el-dropdown-item divided>-->
            <!--<span @click="modifyPersonInfo" style="display:block;">个人信息</span>-->
          <!--</el-dropdown-item>-->
          <el-dropdown-item divided>
            <!-- <span @click="onChangePassword" style="display:block;">{{$t('navbar.changePassword')}}</span> -->
            <span @click="onChangePassword" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <!-- <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span> -->
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip> -->

    </div>
    <div>
      <el-dialog title="修改密码" width="30%" :visible.sync="dialogPasswordVisible">
        <ChagePassowrd @closePasswordDialog="closePasswordDialog" ref="passwordDialog"></ChagePassowrd>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="修改本机构信息" width="30%" :visible.sync="dialogPersonInfoVisible">
        <PersonInfo @closeModifyPersonInfo="closeModifyPersonInfo" ref="personInfoDialog"></PersonInfo>
      </el-dialog>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import ChagePassowrd from './ChangePassword'
import PersonInfo from './PersonInfo'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker,
    ChagePassowrd,
    PersonInfo
  },
  data() {
    return {
      dialogPasswordVisible: false,
      dialogPersonInfoVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    modifyPersonInfo(){
      this.dialogPersonInfoVisible = true;
    },
    closeModifyPersonInfo(){
      this.dialogPersonInfoVisible = false;
    },
    onChangePassword() {
      this.dialogPasswordVisible = true
    },
    closePasswordDialog() {
      this.dialogPasswordVisible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

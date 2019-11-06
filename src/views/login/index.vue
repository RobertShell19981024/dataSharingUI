<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">共享平台</div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" class="ms-content">
        <el-form-item prop="username" style="height: 50px">
          <el-input v-model="loginForm.username" placeholder="用户名">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="loginForm.password"
            @keyup.enter.native="handleLogin()"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="handleLogin()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import LangSelect from '@/components/LangSelect'

  export default {
    components: {LangSelect},
    name: 'login',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginRules: {
          username: [{
            required: true,
            message: '账户不能为空',
            trigger: 'blur'
          },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePass
          }]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({
                path: '/'
              })
              // this.showDialog = true;
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      afterQRScan() {
        // const hash = window.location.hash.slice(1)
        // const hashObj = getQueryObject(hash)
        // const originUrl = window.location.origin
        // history.replaceState({}, '', originUrl)
        // const codeMap = {
        //   wechat: 'code',
        //   tencent: 'code'
        // }
        // const codeName = hashObj[codeMap[this.auth_type]]
        // if (!codeName) {
        //   alert('第三方登录失败')
        // } else {
        //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
        //     this.$router.push({ path: '/' })
        //   })
        // }
      }
    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    }
  }
</script>


<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/signin_background.png');
    background-size: 100%;
  }

  .ms-title {
    width: 100%;
    line-height: 75px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 70%;
    top: 50%;
    width: 400px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 50px 50px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
  }

</style>

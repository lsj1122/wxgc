<template>
  <div class="login-container">
    <video src="@/assets/newlogin.mp4" class="bjimg" autoplay loop muted ></video>


      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <!--      <el-form ref="loginForm" autocomplete="off" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">-->

        <div class="title-container">
          <h3 class="title">
            {{ $t("login.title") }}
          </h3>
          <lang-select class="set-language" />
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="off"
          />
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('login.password')"
              name="password"
              tabindex="2"
              autocomplete="off"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item
          prop="verifyCode"
          style="width: 50%; display: inline-block"
        >
          <span class="svg-container">
            <svg-icon icon-class="captcha" />
          </span>
          <el-input
            ref="verifyCode"
            v-model="loginForm.verifyCode"
            :placeholder="$t('login.captcha')"
            @keyup.enter.native="handleLogin"
            name="verifyCode"
            type="text"
            tabindex="1"
            autocomplete="off"
          />
        </el-form-item>

        <div class="captcha">
          <img
            :src="captchaUrl"
            @click="changeCaptcha"
            style="border: 1px solid #eee"
          />
          <a @click="changeCaptcha" style="color: #777">看不清</a>
        </div>

        <el-button
          :loading="loading"

          style="width: 100%; margin-bottom: 30px; background:#4856E3;color:#fff;"
          @click.native.prevent="handleLogin"
        >
          {{ $t("login.logIn") }}
        </el-button>

        <div style="position: relative" class="login-bottom">
         <!-- <img
            src="../../assets/appCode.png"
            class="app-code"
            alt=""
            srcset=""
          />-->
          <vue-qr :text="getMobileUrl()" :size="120" :logoSrc="qrCodeConfig.logoSrc" :margin="qrCodeConfig.margin" ></vue-qr>
          <div>扫码下载APP</div>
        </div>
      </el-form>


    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t("login.thirdpartyTips") }}
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import LangSelect from "@/components/LangSelect";
import SocialSign from "./components/SocialSignin";
import { getAllSysProject } from "@views/sysproject/api/sysproject.js";
import VueQr from 'vue-qr'

export default {
  name: "Login",
  namespaced: true,
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入账号名"));
      } else if (!validUsername(value)) {
        callback(new Error("用户名由字母、数字、下划线组成，10个字符以内"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码的长度不能小于6位字符"));
      } else {
        callback();
      }
    };
    return {
      //具体其他的设置参考 https://www.npmjs.com/package/vue-qr
      qrCodeConfig:{
        margin:5, //二维码图像的外边距, 默认 20px,
        backgroundColor:'#3E93EE', //背景色,
        logoSrc:window.location.protocol+'//'+window.location.host+'/logo.png', //嵌入至二维码中心的 LOGO 地址 放在public下了
      },
      loginForm: {
        username: "",
        password: "",
        verifyCode: "",
        timeStamp:''
      },
      loginRules: {
         username: [
          {
            required: true,
            message: "必填,账号名只能是2-15位字母或数字！",
            trigger: "blur",
          },
          {
            pattern: /^[A-Za-z0-9]{2,15}$/,
            message: "账号名只能是2-15位字母或数字！",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validatePassword,
          },
        ],
        verifyCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "请输入验证码",
          },
          {
            pattern: /^[\d]{4}$/,
            message: "验证码为4位数字",
            trigger: ["blur", "change"],
          },
        ],
      },
      captchaUrl: "",
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    // console.log(176,this.$store.state.project.projectData)

    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
    this.changeCaptcha();
  },
  destroyed() {
    // this.$store.commit('project/loadProjectData',"登录")
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getMobileUrl(){
      return window.location.protocol+'//'+window.location.host+'/mobile'
    },
    commitProId() {
      getAllSysProject({ isNode: true }).then((res) => {
        if (res.data.length >= 1) {
          //只有一个项目时，默认选中。
          console.log(res);
          var projectId = res.data[0].proId; // 项目id
          var projectName = res.data[0].proName; // 项目子
          var projectChildrenIds = [];
          for (var i = 0; i < res.data[0].children.length; i++) {
            projectChildrenIds.push(res.data[0].children[i].proId);
          }
          this.$store.dispatch("project/setProjectId", projectId);
          this.$store.dispatch("project/setProjectName", projectName);

          this.$store.dispatch(
            "project/setProjectChildrenIds",
            projectChildrenIds
          );
        }
      });
    },

    changeCaptcha() {
      this.loginForm.timeStamp= new Date().getTime();
      this.captchaUrl =
        process.env.VUE_APP_BASE_API +
        "/auth/captcha?timeStamp=" +this.loginForm.timeStamp;

    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              // this.$router.push({ path: this.redirect || '/viewPlate', query: this.otherQuery })
              //判断类别
              //加载项目数据
              this.commitProId();

              // this.$router.push({
              //   path: "/viewPlate",
              //   query: this.otherQuery,
              // });
              if (this.loginForm.username == "hnhqc") {
                this.$router.push({
                  path: "/enterPrise/describe/describe", //企业级页面
                  query: this.otherQuery,
                });
              } else { // 中台页面
                this.$router.push({
                  path: this.redirect || "/",
                  query: this.otherQuery,
                });
              }

              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              //登录失败刷新验证码
              this.changeCaptcha();
            });
        } else {
          console.log("error submit!!");
          //登录失败刷新验证码
          this.changeCaptcha();
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: rgb(143, 143, 143);
$cursor: rgb(161, 161, 161);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: rgb(150, 150, 150) !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(211, 211, 211, 0.925);
    background: rgb(255, 255, 255);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
// $bg: url("../../assets/login_bg.png") no-repeat;
$dark_gray: #889aa4;
$light_gray: #4856E3;

.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
    .bjimg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -9999;
    object-fit: cover;
  }
  // background-size: 100% 100%;
  .login-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    img.login-item {
      width: 700px;
    }
  }
  .login-form {
    position: absolute;
    width: 550px;
    padding: 30px 35px 0;
    overflow: hidden;
    background-color: #fff;
    height: 580px;
    border-radius: 60px;
    border-top-left-radius: 0;
    // border: 4px solid #69b2e4e8;
    right: 10%;
    top: calc((100vh - 580px) / 2);

  }
  .app-code {
    width: 116px;
  }
  .login-bottom {
    text-align: center;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .captcha {
    display: inline-block;
    color: white;
    img {
      vertical-align: middle;
      margin: 0 15px;
      cursor: pointer;
    }
  }
}

@media screen and (max-width: 1200px) {
  .login-content {
    // transform: scale(0.95);
    img.login-item {
      transform: scale(0.8);
      transform-origin: 0;
    }
  }
  .login-form {
    transform: scale(0.8);
    transform-origin: 0 0;
    margin-left: -200px;
  }
}
@media screen and (max-width: 1024px) {
  .login-content {
    // transform: scale(0.95);
    img.login-item {
      transform: scale(0.7);
      transform-origin: 0;
    }
  }
  .login-form {
    transform: scale(0.85);
    transform-origin: 0 0;
    margin-left: -200px;
  }
}
@media screen and (max-width: 768px) {
  .login-content {
    // transform: scale(0.95);
    img.login-item {
      transform: scale(0.5);
      transform-origin: 0;
    }
  }
  .login-form {
    transform: scale(0.8);
    transform-origin: 0 0;
    margin-left: -500px;
  }
}
</style>

<template>
  <div class="wrap-content">
    <div class="content-top">
      <div class="content-top-one">
         <div class="weather_top" style="font-size :14px ;   margin-top: 6px;" >
                  系统已监管
                  <span
                    style="color: #fff; font-size:14px"
                    >{{timeDay}}</span
                  >
                  天
                </div>
        <!-- <div>企业级看板</div><div @click="switchProject">项目级看板</div> -->
        <!-- <el-button type="text login_form toptitle">企业级看板  <span class="light"></span><span class="light"></span><span class="light"></span><span class="light"></span>
</el-button>
        <el-button type="text" @click="showBox" class="toptitle"
          >项目级看板</el-button
        > -->
        <el-dialog class="dialogCheck" title="查询条件" :visible.sync="dialogVisible" width="50%" :modal-append-to-body='false'>
          <ul class="selectCondition">
            <li>
              <span>项目名称</span
              ><input v-model="input1" placeholder="请输入内容" />
            </li>
            <li>
              <span>建设单位</span
              ><input v-model="input2" placeholder="请输入内容" />
            </li>
            <li>
              <span>监理单位</span
              ><input v-model="input3" placeholder="请输入内容" />
            </li>
            <li>
              <span>施工单位</span
              ><input v-model="input4" placeholder="请输入内容" />
            </li>
            <li>
              <span>项目日期</span>
              <div>
                <el-date-picker
                class="date-picker"

                  v-model="value2"
                  type="daterange"
                  align="right"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </div>
            </li>
          </ul>
          <div><el-button>搜索</el-button> <el-button>清空</el-button></div>
        </el-dialog>
      </div>
      <div class="content-top-two">
        <div
          style="
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

          "
        >
          <div class="projectvp-nav">
            <div class="router-left">
              <router-link
                v-for="item in pchid"
                :key="item.path"
                :to="item.path"
                class="aaa"
                >{{ zh.route[item.meta.title] }}</router-link
              >
            </div>
            <div class="pTitle">
              西南分公司管理平台

            </div>
            <div class="router-right">
              <div class="content-top-right">

                <div style="" class="weather_top weather-time">
                  {{currentData}} <span style="">{{ currentTime }}</span>
                </div>
                <div class="right_kz">
                  <img src="../../../assets/compent/Frame.png" alt="" style="margin-right:19px;cursor:pointer;" @click="$router.push('/')" title="中台系统" >
                  <img src="../../../assets/compent/zt.png"  style="margin-right:19px;cursor:pointer;" title="企业级首页" @click="$router.push('/enterPrise/describe/describe')">
                  <img src="../../../assets/compent/qp.png"  @click="setScreen" style="cursor:pointer;" title="全屏模式">

                  <!-- <a
                    class="el-icon el-icon-full-screen"
                    @click="setScreen"
                    title="全屏模式"
                  ></a>
                  <a
                    class="iconfont iconzhongtai"
                    @click="$router.push('/')"
                    title="中台系统"
                  ></a>
                  <a class="iconfont iconshezhi" title="设置"></a>
                  <a class="iconfont iconyonghu" title="用户"></a> -->
                </div>
              </div>
              <router-link
                v-for="item in pchid2"
                :key="item.path"
                :to="item.path"
                class="aaa"
                >{{ zh.route[item.meta.title] }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-bottom vp-project-content">
      <router-view></router-view>
    </div>

    <!-- 提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="projectTiShi"
      width="30%"
      :before-close="handleClose"
      modal-append-to-body="false"
      class="projectTiShiBox"
    >
      <span style="color:#fff">暂未开放</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="projectTiShi = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import fullScreen from "@/utils/fullScreen";
import {
  selectPro
} from "../../sysproject/api/ttProject";
// import daojishi from './daojishi'
import zh from "../../../lang/zh";
import moment from "moment";

export default {
  name: "layout",
  components: {
    // daojishi,
  },
  data() {
    return {
      projectTiShi:false,
      zh: zh,
      isShow: false,
      imgEnter: require("../../../assets/project/line.png"),
      Arrow: require("../../../assets/project/arrow.png"),
      currentTime: "",
      currentData:"",
      pchid: [],
      pchid2: [],
      timeDay:null,
      dialogVisible: false, //控制企业级看板弹框
      selectForm: {
        input1: "",
        input2: "",
        input3: "",
        input4: "",
      },
      createtime:"",
    };
  },
  watch: {
    "$store.getters.projectData": {
      handler(val, oldval) {
        this.setProjectId();
      },
      immediate: true,
    },
  },
  computed: {
    getterProjectId() {
      return this.$store.getters.projectId || "";
    },
    getProjectData() {
      return this.$store.getters.projectData;
    },
  },
  created() {
    let that = this;
    this.timer = setInterval(function () {
      //定时器每秒获取时间
      that.currentData = moment().format("yyyy-MM-DD");
      that.currentTime = moment().format("HH:mm:ss");

    }, 1000);
    this.$store.dispatch("project/loadProjectData");

  },
  mounted() {
    this.getViewPlateRoutes();

    this.selectPro()

  },
  methods: {
    selectPro() {
      //初始化当前项目信息
 selectPro().then((res) => {
     if (res.data) {
      this.createtime = res.data.createTime
     }
         console.log("监管时间",this.createtime);
  this.getdayTime()
      });
    },
    getdayTime(){
      console.log("2200",this.createtime);
        var endTime = new Date().getTime() / 1000 - parseInt(new Date(this.createtime).getTime() / 1000);
        this.timeDay = parseInt(endTime / 60 / 60 / 24) +1;        //相差天数
        console.log(198,this.timeDay)
    },
    showBox(){
      // this.dialogVisible = true
      // alert('暂未开放')
      this.projectTiShi =true
    },
    getViewPlateRoutes() {
      var roules = null;
      console.log("路由",this.$store)
      this.$store.getters.permission_routes.forEach((item, index) => {

        if (item.path === "/enterPrise") {
          roules = item.children;
          roules.forEach((item, index) => {
            if (index < 4) {
              this.pchid.push(item);
            } else {
              this.pchid2.push(item);
            }
          });
        }
      });
      console.log(221,this.pchid)
      console.log(221,this.pchid2)
    },
    setScreen() {
      //全屏模式
      fullScreen();
    },
    setProjectId() {
      if (this.getterProjectId == "undefined") {
        this.$store.dispatch(
          "project/setProjectId",
          this.getProjectData[0].proId
        );
        this.$store.dispatch(
          "project/setProjectName",
          this.getProjectData[0].proName
        );
      }
    },
    //
    switchProject() {
      alert(11);
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
};
</script>


<style scoped lang="less">
.projectTiShiBox /deep/.el-dialog {

    background: rgba(3, 7, 34, 0.8);
    border: 2px solid #06d9ec;

    .el-dialog__header{
     height: 50px;
     line-height: 50px;
    }



}
.el-dialog /deep/.el-button{
    display: none !important;
}

.projectTiShiBox .el-button--primary{
   background-color: rgba(0, 0, 0, 0) !important;
    color: rgb(0, 186, 255) !important;
    border: 1px solid rgb(0, 186, 255) !important;
}
/deep/.el-dialog {
  // background: rgba(16, 48, 97, 0.8);
  padding: 0 10px;
  // width: 45% ;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
  }
  .selectCondition {
    padding: 0;
    li {
      display: flex;
      justify-content: left;
      height: 40px;
      margin: 20px 0;
      span {
        width: 80px;
        line-height: 40px;
      }
      input {
        outline-style: none;
        // border: 1px solid #ccc;
        border-radius: 3px;
        padding: 13px 14px;
        padding: 5px 10px;
        font-size: 14px;
        flex: 1;
      }
      input:focus {
        // border-color: #66afe9;
        outline: 0;
        // -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        //   0 0 8px rgba(102, 175, 233, 0.6);
        // box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        //   0 0 8px rgba(102, 175, 233, 0.6);
      }
    }
  }
}


// 导航栏的样式

.projectvp-nav {
    // margin-top: 6px;
      // margin-left: 10px;
    flex: 1;
    display: flex;
    justify-content: center;
    margin-bottom: 12px;

    //
    .router-left{
       width:35% ;
      position: relative;
      display: flex;
      justify-content: space-evenly;

      // right: -60px;
    }
    .router-right{
      width:35% ;
       position: relative;
      //  min-width: 565px;
        display: flex;
      justify-content: space-evenly;
    }
    //
    .pTitle{
      // width: 770px;
      width: 40%;
      text-align: center;
      position: relative;
      top: -31px;
height: 60px;
line-height: 60px;
font-size: 48px;
font-family: pmzd;
font-weight: 400;
color: #FFFFFF;

  // background: url('../../../assets/compent/projectTitle.png') no-repeat ;
  background-size:100% 100%;
    }
  .aaa {
    display: inline-block;
    // padding: 7px 11px;
    width: 28%;
    height: 46px;
    line-height: 50px;
    text-align: center;
    color: #F4FBFF;
    text-decoration: none;
    font-size: 20px;
    // border: 1px solid #0d7da7;
    // background: url("../../../assets/compent/bgc1.png") no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-left: -25px;
    font-family: pmzd;
  }
  .aaa:nth-child(1) {
    margin-left: 0px;
  }
  .aaa.router-link-active {
    // border-color: #dc9c0c;
    color: #FFC737;
    position: relative;
    font-family: pmzd;
    font-size: 20px;

    // &::before {
    //   position: absolute;
    //   right: 1px;
    //   bottom: -1px;
    //   content: "\27A7";
    //   font-size: 10px;
    //   transform: rotate(45deg);
    // }
    background: url("../../../assets/compent/jh.png") no-repeat;
    // background-size: 100% 100%;
    background-position:  20px 37px;
    background-repeat: no-repeat;
     animation: clipMe 1s linear 1;
     opacity: 1;

  }

  .router-right {
    a {
      // background: url("../../../assets/compent/bgc3.png") no-repeat;
      background-size: 100% 100%;
    }
    a.router-link-active {

      // background: url("../../../assets/compent/bgc4.png") no-repeat;
      // background-size: 100% 100%;
    }
  }
}
.weather_top {
  font-size: 14px;
  // color: @fcolor;
  color: #ffffff;
  opacity: 0.6;
  span {
    font-size: 14px;
    color: #FFD15C;
  }
}
.weather-time {
  height: 16px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  min-width: 200px;
  text-align: center;
}
.wrap-content::-webkit-scrollbar { width: 0 !important ;height: 10px !important;}
.wrap-content {
  // min-height: 998px;
  overflow: auto;
  scrollbar-width:none;/*Firefox*/
  -ms-overflow-style:none;/*IE10+*/
  //
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 1620px;
  // min-height: 870px;
  background: url("../../../assets/project/background.png") no-repeat;
  background-size: 100% 100%;
  .content-top-one {
    // line-height: 60px;
    // height: 60px;
    // margin-top: 10px;
    display: flex;
    align-items: center;
    /deep/.el-button--text {
      padding: 0 10px;
      cursor: pointer;
      // width: 86px;
      font-size: 16px;

      font-weight: bold;
      color: #65bcff;
    }
  }
}

.content-top {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 105px;  //
  padding:0 20px;
  justify-content: space-between;
   background: url('../../../assets/compent/log.png') no-repeat ;
   background-size: 100% 100%;
  // margin-bottom: 20px;
}
.content-bottom {
  box-sizing: border-box;
  margin: 0 20px 0px 20px;
  height: calc(100% - 96px);
  margin-top: -24px;
}
.content-top-two {
  width: 100%;
  // height: 100%;
  text-align: left;
  // padding-top: 8px;
}
.content-top-right {
  position: absolute;
  top: -30px;
  // left: 10%;
  width: 100%;
  min-width: 480px;

  // height: 40%;
  display: flex;
  flex-direction: row;
  justify-content: end;

}
.text-title {
  font-size: 30px;
  text-shadow: 0 0 19px #26f5ff;
}
.sys {
  width: 136px;
  line-height: 46px;
  height: 40px;
  cursor: pointer;
  color: #00fef5;
  font-size: 16px;
  margin: 0 auto;
  background: url("../../../assets/project/system.png");
}
.bg-pic {
  width: 288px;
  height: 45px;
  background: url("../../../assets/project/bg-spot.png");
}
.img-pic {
  margin: 0 14px;
}
.right_kz {
  float: right;
  color: #008cc7;
  a.iconfont,
  a.el-icon {
    font-size: 19px;
    margin-left: 12px;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
}

.router-left {
}




////
 .login_form {position: relative;
 width: 150px;
 margin: 5px 0;
padding: 0 10px;
 height: 50px;
        overflow: hidden;
        }

.light {
      position: absolute;
      display: block;
    }
    .light:nth-child(1) {
      filter: hue-rotate(0deg);
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, #3a86ff);
      animation: animate1 4s linear infinite;
    }

    @keyframes animate1 {
      0% {
        left: -100%;
      }

      50%,
      100% {
        left: 100%;
      }
    }
    .light:nth-child(2) {
      filter: hue-rotate(60deg);
      top: -100%;
      right: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(180deg, transparent, #3a86ff);
      animation: animate2 4s linear infinite;
      animation-delay: -2s;
    }

    @keyframes animate2 {
      0% {
        top: -100%;
      }

      50%,
      100% {
        top: 100%;
      }
    }
    .light:nth-child(3) {
      filter: hue-rotate(120deg);
      bottom: 0;
      right: 0;
      width: 100%;
      background: linear-gradient(270deg, transparent, #3a86ff);
      animation: animate3 4s linear infinite;
      animation-delay: 0s;
    }

    @keyframes animate3 {
      0% {
        right: -100%;
        height: 3px;
      }

      50%,
      100% {
        height: 2px;
        right: 100%;
      }
    }
    .light:nth-child(4) {
      filter: hue-rotate(300deg);
      bottom: -100%;
      left: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(360deg, transparent, #3a86ff);
      animation: animate4 4s linear infinite;
      animation-delay: 2s;
    }

    @keyframes animate4 {
      0% {
        bottom: -100%;
      }

      50%,
      100% {
        bottom: 100%;
      }
    }

     @keyframes clipMe {
          0%{
            opacity: 0.1;
          }

          100%{
             opacity: 1;
          }
        }
////
// @media screen and (max-width: 1860px) {
//   .projectvp-nav {
//     a {
//       // padding: 5px 10px;
//     }
//   }
// }
// @media screen and (max-width: 1660px) {
//  .content-top .content-top-two {
//     transform: scale(0.92);
//     transform-origin: 0;
//   }

//   .content-bottom {
//     transform: scaleX(0.9);
//     transform-origin: left top;
//   }
// }

// @media screen and (max-width:1600px){
//   .content-top .content-top-two {
//     transform: scale(0.92);
//     transform-origin: 0;
//   }

//   .content-bottom {
//     transform: scaleX(0.9);
//     transform-origin: left top;
//   }
// }

// @media screen and (max-width:1440px){
//   .content-top .content-top-two {
//     transform: scale(0.82);
//     transform-origin: 0;
//   }
//   .content-bottom{
//     transform: scaleX(0.81);
//     transform-origin: 0 -10%;
//   }
// }
// @media screen and (max-width:1366px){
//   .content-top .content-top-two{
//     transform: scale(0.78);
//     transform-origin: 0 ;
//   }
//   .content-bottom{
//     transform: scaleX(0.76);
//     transform-origin: 0 -10%;
//   }
// }
// @media screen and (max-width:1200px){
//   .content-top .content-top-two{
//     transform: scale(0.68);
//     transform-origin: 0 ;
//   }
//   .content-bottom{
//     transform: scaleX(0.67);
//     transform-origin: 0 -10%;
//   }
// }

// @media screen and (max-width: 1024px) {
//   .content-top  {
//     height: 120px;
//     margin-bottom: 0px;
//   }
//   .content-top .content-top-two {
//     transform: scale(0.585);
//     transform-origin: 0;
//   }

//   .wrap-content .content-top-one {
//     position: absolute;
//     transform-origin: 0 ;
//     top:-22px;
//   }
//   .content-left, .content-right{
//     width:460px!important;
//   }
//   .wrap-content .content-top-one .toptitle {
//     transform: scale(0.6);
//     transform-origin: 0;
//   }
//   .content-bottom {
//     transform: scaleX(0.575) scaleY(0.75);
//     transform-origin: 0 -15%;
//     height: calc(100% - 120px);
//   }
//   .date-picker{
//     position: absolute;
//     width: 59%;
//   }

// }

// // @media screen and (max-width:768px){
// //   .content-top {
// //     height: 120px;
// //     margin-bottom: 0px;
// //   }
// //   .content-top .content-top-two {
// //     transform: scale(0.53);
// //     transform-origin: 0;
// //   }

// //   .wrap-content .content-top-one {
// //     position: absolute;
// //     transform: scale(0.53);
// //     transform-origin: 0;
// //     top:-20px;
// //   }
// //   .content-bottom {
// //     transform: scaleX(0.575) scaleY(0.68);
// //     transform-origin: left top;
// //     height: calc(100% - 120px);
// //   }
// // }
</style>

<template>
  <div class="wrap-content">
    <div class="content-top">
      <div class="content-top-left">
         <div class="text-title" style="color: #fff">{{ getProjectName }}</div>

       
      </div>
       <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
         
          <div class="projectvp-nav">
            <router-link
              v-for="(item, index) in getViewPlateRoutes"
              :key="index"
              :to="item.path"
              @click.native="addColor($event, index)"
              >{{ zh.route[item.meta.title] }}</router-link
            >
          </div>
        </div>
      <div class="content-top-right">
        <!-- <div style="padding-top:5px;margin:0 auto;">
          <el-image :src="Arrow" style="margin-bottom:10px;"></el-image>
        </div> -->
        <div class="right-left">
             <div style="font-size :14px; color:#fff; margin-bottom:4px" >
                  系统已监管
                  <span
                    style="color: #fff; font-size:14px"
                    >{{timeDay}}</span
                  >
                  天
                </div>
          <div  class="weather_top">
            
            {{ currentData }}<span style="color:#FFA843;margin-left:6px ">{{currentTime}}</span>
          </div>
          <!-- <daojishi /> --> 
     </div>

       <el-divider direction="vertical" content-position="center" ></el-divider>
          <div class="right_kz" >
             <img src="../../../assets/compent/Frame.png" alt="" style="margin-right:19px;cursor:pointer;" @click="$router.push('/')" title="中台系统">
                  <img src="../../../assets/compent/zt.png"  style="margin-right:19px;cursor:pointer;" title="企业级首页" @click="setenter">
                  <img src="../../../assets/compent/qp.png"  @click="setScreen" style="cursor:pointer;" title="全屏模式">
             <!-- <a class="iconfont iconanquan1" title="实名制安全培训准入管理平台" v-if="linkShow"  :href="safeLinkUrl"  target="_blank" style=" font-size: 20px;"></a>
             <a class="iconfont iconmaozi" title="智能安全帽" v-if="linkShow" :href="linkUrl"  target="_blank"></a>
            <a
              class="el-icon el-icon-full-screen"
              @click="setScreen"
              title="全屏模式"
            ></a>
            <a
              class="iconfont iconzhongtai"
              @click="$router.push('/')"
              title="中台系统"
            ></a> -->
          </div>
        </div>

    </div>

    <div class="content-bottom vp-project-content">
      <router-view></router-view>
    </div>

    <div class="changeProject" v-show="isShow">
      <div class="changeProject-l">
        <h3>行政区</h3>
        <a>荔湾区</a>
      </div>
      <div class="changeProject-r">
        <h3>看板列表</h3>
        <a>智慧工地演示项目1</a>
      </div>
    </div>
  </div>
</template>
<script>
var $ = require("jquery");
import {
  selectPro
} from "../../sysproject/api/ttProject";
import fullScreen from "@/utils/fullScreen";
import daojishi from "./daojishi";
import zh from "../../../lang/zh";
import moment from "moment";
import {getlinkInfo} from "@/api/user";

export default {
  name: "layout",
  components: {
    daojishi,

  },
  data() {
    return {
    timeDay:null,
    currentData:'',
    createtime:"",
      zh: zh,
      isShow: false,
      imgEnter: require("../../../assets/project/line.png"),
      Arrow: require("../../../assets/project/arrow.png"),
      currentTime: "",
      linkShow:false,
      linkUrl:"",
      safeLinkUrl:'http://dmt.bosafe.com/stbms_DHY/JUMP/'
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
    getProjectName() {
      return this.$store.getters.projectName || "";
    },
    getterProjectId() {
      return this.$store.getters.projectId || "";
    },
    getProjectData() {
      return this.$store.getters.projectData;
    },
    getViewPlateRoutes() {
      let pchid = [];
      this.$store.getters.permission_routes.forEach((item, index) => {

        if (item.path === "/viewPlate") {
          pchid = item.children;

        }
      });
      // console.log(100,this.$store.getters.permission_routes)
      console.log(93,pchid)
      return pchid;
    },
  },
  created() {
    let that = this;
    this.timer = setInterval(function () {
      //定时器每秒获取时间
      that.currentTime = moment().format("HH:mm:ss");
      that.currentData = moment().format("yyyy-MM-DD");


      
    }, 1000);
    this.$store.dispatch("project/loadProjectData");

    if(this.$store.state.user.name =="ahnjzsg"  ||
       this.$store.state.project.projectName == '中国能建安徽电建二公司多功能展示馆一期项目'){
         this.linkShow =true
         this.getlink()
       }else{
          this.linkShow =false
       }
  },
  mounted(){
    this. selectPro()

  },
  methods: {
        selectPro() {
      //初始化当前项目信息
 selectPro().then((res) => {
     if (res.data) {
      this.createtime = res.data.createTime
     }
         console.log("监管时间",res);
  this.getdayTime()
      });
    },
     getdayTime(){
        var endTime = new Date().getTime() / 1000 - parseInt(new Date(this.createtime).getTime() / 1000);
        this.timeDay = parseInt(endTime / 60 / 60 / 24) +1;        //相差天数
    
    },
    getlink(){  //  中国能建安徽电建二公司多功能展示馆一期项目 的跳转接口
        getlinkInfo().then(res=>{
          this.linkUrl =res
        })
    },
    setScreen() {
      fullScreen();
    },
    setenter(){
      alert("不可跳转到企业级")
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
    showprobox() {
      this.isShow = this.isShow ? false : true;
    },
    addColor(e, index) {
      if (index == 1) {
        e.target.classList.add("router-link-active");
      } else {
        $(".projectvp-nav a").eq(1).removeClass("router-link-active");
      }
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
.el-divider--vertical{
background: #52C2FA;
    margin-top: 20px;
    height: 46px;
}
.projectvp-nav {
  width: 104px;
  margin-top: 21px;
  flex: 1;
  margin-left: 14px;
  // display: flex;
  justify-content: center;
  width:calc(100% - 240px);
  text-align: center;
  a {
    width: 106px;
    display: inline-block;
    padding: 7px 11px;
    color: #fff;
    font-family: pmzd;
    text-decoration: none;
    font-size: 20px;
    background: url("../../../assets/project/wjh.png") no-repeat;
    margin-right: 10px;
  }
  a.router-link-active {
   background: url("../../../assets/project/jh.png");
    // &::before {
    //   position: absolute;
    //   right: 1px;
    //   bottom: -1px;
    //   content: "\27A7";
    //   font-size: 10px;
    //   transform: rotate(45deg);
    // }
  }
}
.weather_top {
  font-size: 14px;
color: #fff;
}
.wrap-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 1366px;
  min-height: 870px;
  background: url("../../../assets/project/newbg.gif") no-repeat;
  background-size: 100% 100%;
}
.content-top {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 105px;
  padding:0 20px;
  justify-content: space-between;
  background: url("../../../assets/project/dhl.png") no-repeat;
  background-size: 100% 100%;
}
.content-bottom {
  margin: 0 20px 20px 20px;
  height: calc(100% - 125px);
}
.content-top-left {
  text-align: left;
  padding-top: 8px;
}
.content-top-right {
  // width: 12%;
  // height: 100%;
  // width: 20%;
  display: flex;
  justify-content: end;
  flex-direction: row;
  .right-left{
    margin-top: 25px;

  }

}
.text-title {
  text-shadow: 0 0 19px #26f5ff;
     font-size: 40px;
    font-family: pmzd;
    margin-left: 62px;
    margin-top: 10px;
    width: 100%;
}
// .sys {
//   width: 136px;
//   line-height: 46px;
//   height: 40px;
//   cursor: pointer;
//   color: #00fef5;
//   font-size: 16px;
//   margin: 0 auto;
//   background: url("../../../assets/project/system.png");
// }
.bg-pic {
  width: 288px;
  height: 45px;
 
}
.img-pic {
  margin: 0 14px;
}
.right_kz {
  // width: 100%;
  float: right;
  margin-top: 30px;
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
.changeProject {
  width: 19rem;
  min-height: 8rem;
  position: absolute;
  right: 5rem;
  top: 6rem;
  z-index: 999;
  background: rgba(3, 35, 73, 0.7);
  border: 1px solid #00b1c3;
  border-radius: 6px;
  display: flex;
  h3 {
    font-weight: 400;
    margin: 10px 0;
    color: @scolor;
  }
  a {
    cursor: pointer;
  }
  .changeProject-l {
    flex: 2;
    border-right: 1px solid #026973;
  }
  .changeProject-r {
    flex: 4;
  }
}

@media screen and (max-width: 1860px) {
  .projectvp-nav {
    a {
      padding: 5px 10px;
    }
  }
}

// @media screen and (max-width:1760px){
//   .content-top{
//     transform: scale(0.96);
//     transform-origin: 0;
//   }
//   .content-bottom{
//     transform: scaleX(0.95);
//     transform-origin: 0;
//   }
// }
// @media screen and (max-width:1600px){
//   .content-top{
//     transform: scale(0.91);
//     transform-origin: 0;
//   }
//   .content-bottom{
//     transform: scaleX(0.91);
//     transform-origin: 0;
//   }

// }
// @media screen and (max-width:1440px){
//   .content-top{
//     transform: scale(0.82);
//     transform-origin: 0;
//   }
//   .content-bottom{
//     transform: scaleX(0.82);
//     transform-origin: 0;
//   }
// }
// @media screen and (max-width:1366px){
//   .content-top{
//     transform: scale(0.72);
//     transform-origin: 0;
//   }
//   .content-bottom{
//     transform: scaleX(0.72);
//     transform-origin: 0;
//   }
// }
@media screen and(max-width:1660px) {
  .bg-pic {
    width: 250px;
  }
}
@media screen and(max-width:1440px) {
  .bg-pic {
    width: 160px;
  }
  .right_kz{
  transform: scale(0.95);
  transform-origin: 0 0;
  }
}
@media screen and(max-width:1366px) {
   .right-pic{
    transform: scale(0.9);
  }
}

@media screen and (max-width: 1024px) {
  .content-top {
    transform: scale(0.74);
    transform-origin: 0 5%;
  }
  .text-title {
    width: 30%;

  }
  .projectvp-nav {
    transform-origin: left top;
    a {
      padding: 5px 8px;
    }
  }

  .content-bottom {
    transform: scaleX(0.74) scaleY(0.75);
    transform-origin: 0 -16%;
  }
}

@media screen and (max-width:768px){
  .content-top{
    transform: scale(0.56);
    transform-origin: 0;
  }
  .projectvp-nav{
    transform-origin: left top;
  }
  .content-bottom{
    transform: scale(0.55);
    transform-origin: 0 0;
  }
}
</style>

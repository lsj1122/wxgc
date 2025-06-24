<template>
  <div class="wrap-content">
    <div class="content-top">
      <img src="@/assets/newScreen/logo.png" alt="" class="logo" />
      <div class="title">聚正企业级BI分析大屏</div>
      <div class="time">
        北京时间
        <span style="color: #ffa843; font-size: 22px"> {{ currentTime }}</span>
      </div>
    </div>
    <div class="content-bottom">
      <div class="left item">
        <combox
          title="项目统计"
          :isRight="true"
          total="项目总数"
          :num="projectOptions.length"
          class="combox"
        >
        <projectStatistics />
        </combox>
        <combox title="新增设备统计（近90天）" class="combox">
          <new-machine />
        </combox>
        <combox title="累计设备统计" class="combox">
          <cumulative />
        </combox>
        <combox title="大型设备统计" class="combox">
          <large />
        </combox>
      </div>
            <!-- 中间地图模块 -->
      <div class="center item">
        <baiduMap />
      </div>
      <div class="right item">
        <combox title="设备在线统计" class="combox"> <online /> </combox>
        <combox
          title="各省市设备分布数量top5"
          style="height: 50%"
          class="combox"
        >
        <province />
        </combox>
        <combox title="设备报警统计（近30天）" class="combox">
          <warning />
        </combox>
      </div>
    </div>
  </div>
</template>

<script>
import { selectBigScreenCore } from "./api.js";
import combox from "./modules/combox";
import moment from "moment";
import NewMachine from "./modules/newMachine.vue";
import Cumulative from "./modules/cumulative.vue";
import Warning from "./modules/warning.vue";
import Large from "./modules/large.vue";
import Online from "./modules/online.vue";
import Province from './modules/province.vue';
import baiduMap from './modules/baiduMap.vue';
import projectStatistics from './modules/projectStatistics.vue';
export default {
  name: "newEnterprise",
  components: {
    combox,
    NewMachine,
    Cumulative,
    Warning,
    Large,
    Online,
    Province,
    baiduMap,
    projectStatistics
  },
  data() {
    return {
      currentTime: "",
      projectOptions:[]
    };
  },
  created(){
    this.selectBigScreenCore()
  },
  methods: {
    // 获取日期时间
    getDate() {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return year + "-" + month + "-" + day;
    },
  },
  mounted() {
    let that = this;
    this.timer = setInterval(function () {
      //定时器每秒获取时间
      that.currentTime = moment().format("yyyy-MM-DD HH:mm:ss");
    }, 1000);
  },
  // 
  methods:{
      selectBigScreenCore(){
        selectBigScreenCore().then((res) => {
        this.projectOptions = res.data;
       
      });
  }
  }

};
</script>

<style lang="less" scoped>
.wrap-content {
  width: 100%;
  height: 100%;
  background: url("~@/assets/newScreen/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-width: 1366px;
  min-height: 768px;
  .content-top {
    height: 100px;
    width: 100%;
    background: url("~@/assets/newScreen/top-gif.gif");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    .logo {
      width: 177px;
      position: absolute;
      top: 10px;
      left: 36px;
    }
    .title {
      font-size: 48px;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      color: #dfecff;
      line-height: 56px;
      text-shadow: 0px 0px 10px #105ed9;
      position: absolute;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -50%);
    }
    .time {
      font-size: 22px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 26px;
      position: absolute;
      right: 0%;
      top: 40%;
      transform: translate(-10%, -50%);
    }
  }
  .content-bottom {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 100px);
    padding: 10px 20px;
    .item {
      // border: 1px solid red;
      width: 27%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .combox {
        width: 100%;
        height: 25%;
        div {
          width: 100%;
          height: 100%;
        }
      }
    }
    .center {
      width: 42%;
    }
  }
}
</style>
<template>
  <div class="outstanding">
    <div v-show="!isData" v-for="(item, index) in goodProject" :key="index" class="outstand">
      <img :src="item.projectPicture" alt="">
      <!-- <div>项目名称： {{ index + 1 }}.{{ item.name }}</div>
      <div>建设单位： {{ item.type }}</div>
      <div>开工时间： {{ item.type }}</div> -->
      <div class="info">
  <div class="text"><span>项目名称：</span>{{item.projectName}}</div>
      <div class="text"><span>建设单位：</span>{{item.buildCompany}}</div>
      <div class="text"><span>开工时间：</span> {{item.startDate}}</div>
</div>
    </div>
    <div class="noData" v-show="isData">暂无数据</div>
  </div>
</template>

<script>
import { outstandingProject,outstandingProjectnew } from "@/views/viewPlate/enterPrise/api/safetyManagement";
// import { log } from "video.js";
export default {
  components: {},
  data() {
    return {
      goodProject: [],
      development: [],
      isData: false,
    };
  },
  created() {
   this.getproject()
  },
  mounted() {},
  methods: {

getproject(){
  outstandingProjectnew().then((res) =>{
    if (res.code === "success") {
      console.log("优秀项目",res);
       if (res.data.length == 0) {
            this.isData = true;
          } else {
           this.goodProject = res.data
            this.isData = false;
          }
     
    }
  });
},
    // // 获取优秀安全项目数据
    // getOutstandingProject() {
    //   outstandingProject().then((res) => {
    //     console.log('优秀安全项目数据',res)
    //     if (res.code === "success") {
    //       if (res.data.length == 0) {
    //         this.isData = true;
    //       } else {
    //         this.goodProject = res.data.data ? res.data.data : "-";
    //         this.development = res.data.type ? res.data.type : "-";
    //         this.isData = false;
    //       }
    //     }
    //   });
    // },
  },
};
</script>
<style lang="scss" scoped>
.outstanding {
  height: 37vh;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  .outstand{
   
    display: flex;
    
    
     img{
      width: 147px;
      height: 105px;
      margin: 10px;
      // padding-bottom: 8px;
  }

    .info{
      margin-top: 25px;
      font-size: 14px;
      .text{
        margin-bottom: 8px;
      }
      span{
      color: #60B1FF;
  
      }
} 
  }
 
  .info {
    // width: 80%;
    // height: 80px;
    // margin-bottom: 15px;
    // line-height: 70px;
    // text-align: center;
    // padding-left: 55px;
    // padding-top: 15px;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // overflow: hidden;
    span:nth-child(2) {
      margin-left: 40px;
      height: 14px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      opacity: 0.5;
    }
  }
  // div:nth-child(1) {
  //   background: url("../../../../../assets/compent/project1.png") no-repeat;
  //   background-size: 100% 100%;
  // }
  // div:nth-child(2) {
  //   background: url("../../../../../assets/compent/project2.png") no-repeat;
  //   background-size: 100% 100%;
  // }
  // div:nth-child(3) {
  //   background: url("../../../../../assets/compent/project3.png") no-repeat;
  //   background-size: 100% 100%;
  // }
}
.noData {
  margin: auto;
  font-size: 14px;
  z-index: 100;
  color: #909399;
  position: absolute;
  letter-spacing: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

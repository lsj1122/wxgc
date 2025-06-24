<template>
  <div class="middle_slqkfx box">
    <div class="title">
      <div class="title_text">收料情况分析</div>
      <div>
        <el-button size="small" @click="handSlqkfx(0)" :class="{ active: isActive == 0 }" >今日</el-button>
        <el-button size="small" @click="handSlqkfx(1)" :class="{ active: isActive == 1 }" >本月</el-button>
        <el-button size="small" @click="handSlqkfx(2)" :class="{ active: isActive == 2 }" >累计</el-button>
      </div>
    </div>
   
    <div style="height:87%" v-loading="loading">
       <div id="slqkfx"></div>
    </div>
  </div>
</template>

<script>
import { initSlqkfx } from "./slqkfx.js";
import { getSHOULIAOINFO } from "../../api/wlys.js";
export default {
  data() {
    return {
      loading:true,
      isActive: 0,
      dataSource: [
        [
          [18, 20, 68, 15],
          [17.5, 19.5, 66.9, 14.5],
        ],
        [
          [45, 60, 180, 35],
          [44, 59, 179, 34],
        ],
        [
          [50, 66, 200, 40],
          [49, 65, 199, 39],
        ],
      ],
    };
  },
  mounted() {
    this.handSlqkfx(0);
  },
  methods: {
    getSHOULIAOINFO(isActive){
      
      let obj ={
        lx:0,type:isActive
      }
      if(isActive  ==2){
        obj.type =''
      }
      let arrName =[]
      let arr1=[] // 运单重量
      let arr2=[] // 实际重量

      getSHOULIAOINFO(obj).then(res=>{
        console.log('收料情况分析',res)
        res.forEach(element => {
          arrName.push(element.CLMC)
          arr1.push(element.sjzl)
          arr2.push(element.ydzl)
        });

        initSlqkfx(
        arrName,
        arr1,
        arr2
      );
      this.loading =false
        
      }).catch(error=>{
        this.loading =false
      })
    },
    handSlqkfx(isActive) {
      this.loading =true
      let interval = [10, 50, 100];
      this.isActive = isActive;
      this.getSHOULIAOINFO(isActive)
     
    },
  },
};
</script>

<style lang="less" scoped>
@import "./MQBaseStyle.less";

.middle_slqkfx {
    height: 50%;
    #slqkfx {
    width: 100%;
    height: 90%;
    }
}
</style>
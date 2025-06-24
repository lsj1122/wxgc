<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">预警日志</div>
    </div>
    <div style="width:100%;height:95%;overflow-y:auto;" class="bigBox">
        <div class="error-log-con" v-if="showBox">
           <!-- <span><span style="color:rgba(255,255,255,0.4)">2020/3/5</span> 右侧基坑钢板桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点14超限，累计位移41mm。</span>
           <span><span style="color:rgba(255,255,255,0.4)">2020/3/5</span> 右侧基坑钢板桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点14超限，累计位移41mm。</span>
           <span><span style="color:rgba(255,255,255,0.4)">2020/3/5</span> 右侧基坑钢板桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点14超限，累计位移41mm。</span>
           <span><span style="color:rgba(255,255,255,0.4)">2020/3/5</span> 右侧基坑钢板桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点14超限，累计位移41mm。</span>
           <span><span style="color:rgba(255,255,255,0.4)">2020/3/5</span> 右侧基坑钢板桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点14超限，累计位移41mm。</span>
           <span><span style="color:rgba(255,255,255,0.4)">2020/3/5</span> 右侧基坑钢板桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点14超限，累计位移41mm。</span> -->
           <span>东侧基坑旋挖桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点10超限，累计位移45mm。</span>
           <span>东侧基坑旋挖桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点12超限，累计位移41mm。</span>
           <span>东侧基坑旋挖桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点13超限，累计位移55mm。</span>
           <span>东侧基坑旋挖桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点14超限，累计位移46mm。</span>
           <span>东侧基坑悬臂桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点15超限，累计位移52mm。</span>
           <span>东侧基坑悬臂桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点16超限，累计位移47mm。</span>
           <span>东侧基坑悬臂桩位移量变化较大，有增大趋势；基坑封底；场地硬化；测点18超限，累计位移46mm。</span>
        </div>
        <div class="error-log-con" v-if="!showBox">
           <span>无预警数据</span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
       showBox:true
    };
  },
  created(){
    if(this.$store.state.user.name =="zgnj123"  ||
       this.$store.state.project.projectName == '中国能建安徽电建二公司多功能展示馆一期项目'){
         this.showBox = false
       }else{
          this.showBox =true
       }
  },
  mounted(){
    if(this.showBox){
      this.roll();
    }
    },
    methods:{
        roll(){
            let speed = 1;
            let outBox = document.querySelector('.bigBox');
            let inBox = document.querySelector('.error-log-con');
            setInterval(() =>{
                if(outBox.scrollTop >= inBox.scrollHeight - outBox.clientHeight) speed = -1;
                if(outBox.scrollTop <= 0) speed = 1;
                outBox.scrollTop += speed;
            },100)
        }
    }
};
</script>

<style lang="less" scoped>
@import "../../laborManagement/MQBaseStyle.less";

.slgk {
  height: 100%;
  overflow: hidden;
  position: relative;
}
.error-log-con{
    padding: 15px;
    >span{
        cursor: pointer;
        color: rgba(255,255,255,0.7);
        display: block;
        margin-bottom: 10px;
        font-size: 14px;
        text-align: justify;
    }
}
</style>
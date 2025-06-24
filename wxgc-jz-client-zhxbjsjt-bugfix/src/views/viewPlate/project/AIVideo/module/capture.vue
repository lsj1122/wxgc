<template>
    <combox title="抓拍记录统计" style="flex: 1; margin: 0">
         <div class="boot">
            <div class="bootnum">
                 <img src="../../../../../assets/project/yj.png" alt="">
                    <div class="text">越界检测</div>
                    <!-- <div class="text"><span class="num">{{ videoMonitoringtData[4].num ? videoMonitoringtData[4].num :'--' }}</span> 次</div> -->
            </div>
         </div>
    </combox>
</template>

<script>
    import {violationsStatistics} from "@/views/digitalConstructionSite/spjk/api/ttaialarmdata";
    export default {
        props:['projectId','gjlxData'],
        data() {
            return {
                noneAqm: 0,
                yjjc: 0,
                wcfgy: 0,
                ryjj: 0,
                videoMonitoringtData:[],

            }
        },
        created(){
            this.getvideoMonitoring();
        },
        methods:{
                      // 违规统计
    getvideoMonitoring() {
      violationsStatistics().then((res) => {
        if (res.code == "success") {
console.log(77777,res);
          this.videoMonitoringtData = res.data;
           console.log("8888888", this.videoMonitoringtData);
    
        }
      });
    },
        },
     
    }
</script>

<style lang="less" scoped>
.boot{
    height: 100%;
    width: 100%;
}
.zhuap_l {
        display: flex;
        height: 100%;
        width: 100%;
        flex-wrap: wrap;
        align-items: center;
        // justify-content: center;
        .zhuap_b{
            margin-left: 77px;
            text-align: center;
            img{
                width: 80px;
                height: 50px;
            }
            .text{
               color: #C3E9FC; 
               font-size: 14px;
            }
            .num{
                font-size:24px ;
                font-family: fantasy;
            }
        }
    
    }
</style>

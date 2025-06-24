<template>
    <combox title="抓拍记录统计" style="flex: 1;margin-bottom:0px">
            <div class="zhuap_l">
                <div class="zhuap_b">
                    <img src="../../../../../assets/project/yj.png" alt="">
                    <div class="text">越界检测</div>
                    <div class="text" v-if="videoMonitoringtData.length"><span class="num">{{ videoMonitoringtData[4].num}}</span> 次</div>
                </div>
                <div class="zhuap_b" >
                      <img src="../../../../../assets/project/mj.png" alt="">
                    <div class="text">未穿反光衣</div>
                    <div class="num" v-if="videoMonitoringtData.length">{{ videoMonitoringtData[1].num  }} </div>
                </div>
                 <div class="zhuap_b" style="margin-left: 64px;">
                      <img src="../../../../../assets/project/aqm.png" alt="">
                    <div class="text">未戴安全帽</div>
                    <div class="num" v-if="videoMonitoringtData.length">{{videoMonitoringtData[0].num }} </div>
                </div>
                 <div class="zhuap_b">
                      <img src="../../../../../assets/project/ry.png" alt="">
                    <div class="text">人员聚集</div>
                    <div class="num" v-if="videoMonitoringtData.length">{{ videoMonitoringtData[5].num }} </div>
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
          this.videoMonitoringtData = res.data;
           console.log("8888888", this.videoMonitoringtData);
    
        }
      });
    },
        },
        watch:{
            gjlxData:function (val){
                val.forEach(item =>{
                    if(item.videoName==='未戴安全帽'){
                        this.noneAqm = item.num
                    }
                    if(item.videoName==='越界检测'){
                        this.yjjc = item.num
                    }
                    if(item.videoName==='未穿反光衣'){
                        this.wcfgy = item.num
                    }
                    if(item.videoName==='人员聚集'){
                        this.ryjj = item.num
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.zhuap_l {
        display: flex;
        height: 100%;
        flex-wrap: wrap;
        align-items: center;
        // justify-content: center;
        .zhuap_b{
            margin-left: 77px;
            text-align: center;
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

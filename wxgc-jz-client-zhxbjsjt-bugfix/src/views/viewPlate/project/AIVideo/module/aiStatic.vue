<template>
    <combox title="AI统计" style="flex: 1; margin-bottom: 18px">
        <div id="Ai" class="chart-box">
            <div class="ai-div">
        <div class="item">
          <img src="../../../../../assets/project/jk.png" alt=""/>
          <div style="align-items: center;">
            <span>视频监控总数</span>
            <span style="font-family: 'dzfont'; color: blueviolet; font-size: 42px">{{
                data.aiNum ? data.aiNum : '--'
              }}</span>
          </div>
        </div>
        <div class="item">
          <img src="../../../../../assets/project/ls.png" alt=""/>
          <div style="align-items: center;">
            <span>算法总路数</span>
            <span style="font-family: 'dzfont'; color: blueviolet; font-size: 42px">{{
                data.totalAlgorithms ? data.totalAlgorithms : '--'
              }}</span>
          </div>
        </div>
      </div>
          <div id="source">
            <h3 style=" margin: 0;
                padding: 0 0 0 15px;
                text-align: left;
                font-weight: 400;
                height: 15px;
                line-height: 15px;
                border-left: 3px solid @scolor;
                color: #c3e9fc;">来源统计</h3><br/>

            <div style="margin-top: 20px;" v-for="(item,index) in data.detail" :key="index">
                 <span>摄像头id：<span style="font-family: 'dzfont'; color: #0cd013; font-size: 15px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block; width:146px">{{
                  item.cid
                }}</span></span>
              <span
              >统计次数：<span
                class="num"
                style="font-family: 'dzfont'; color: #2096ed; font-size: 30px width:50%"
              >{{ item.num }}</span
              >
              次</span
              >
            </div><br/><br/>

          </div>
        </div>
      </combox>
</template>

<script>
    import {select1,aisum} from "@/views/digitalConstructionSite/spjk/api/ttaialarmdata";
    export default {
        props:['projectId'],
        data() {
            return {
                data: []
            }
        },
        created () {
            this.query();
        },
        methods: {
            query(){
                aisum().then(res=>{
                  if(res.code=="success"){
                    console.log("ai",res);
                        this.data = res.data
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.ai-div {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-evenly;

  .item {
    display: flex;
    align-items: center;


    img {
      flex: 0.4;
    }

    div {
      display: flex;
      flex-direction: column;

      span:nth-child(1) {
        font-size: 14px;
        line-height: 40px;
      }
    }
  }
}
</style>

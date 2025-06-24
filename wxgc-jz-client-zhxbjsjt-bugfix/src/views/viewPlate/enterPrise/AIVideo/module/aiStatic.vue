<template>
    <div id="Ai" class="chart-box">
      <div class="ai-div">
        <div class="item">
          <img src="../../../../../assets/project/jk.png" alt=""/>
          <div style="align-items: center;">
            <span>视频监控总数</span>
            <span style="font-family: 'Acens'; color: #FFD15C; font-size: 42px">{{
                data.aiNum ? data.aiNum : '--'
              }}</span>
          </div>
        </div>
        <div class="item">
          <img src="../../../../../assets/project/ls.png" alt=""/>
          <div style="align-items: center;">
            <span>算法总路数</span>
            <span style="font-family: 'Acens'; color: #FFD15C; font-size: 42px">{{
                data.totalAlgorithms ? data.totalAlgorithms : '--'
              }}</span>
          </div>
        </div>
      </div>
      <div id="source" style="height: 100%">
        <h3
          style="
            margin: 0;
            padding: 20px 0 0 10px;
            text-align: left;
            font-weight: 400;
            height: 15px;
            line-height: 15px;
            border-left: 3px solid @color;
            color: #c3e9fc;
          "
        >
          来源统计
        </h3>
        <br/>

        <div class="sourceDiv">
          <div
            style="margin-left: 10px; margin-top: 20px"
            v-for="(item, index) in data.detail"
            :key="index"
          >
            <div style="display: flex;justify-content: space-between;">
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
            </div>
          </div>
        </div>
        <br/><br/>
      </div>
    </div>

</template>

<script>
import {selectAI} from '@/views/digitalConstructionSite/spjk/api/ttaialarmdata'
import {aisum} from "@/views/viewPlate/enterPrise/api/aivideo"
export default {
  props: ['projectId'],
  data() {
    return {
      data: []
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      aisum().then((res) => {
        console.log('AI统计', res)
        if (res.code == 'success') {
          this.data = res.data
          console.log("AI",res.data);
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.chart-box {
  height: 100%;
  overflow: hidden;
}

.sourceDiv {
  height: 170px;
  overflow: auto;
  width: 100%;
}

.ai-div {
  width: 100%;
  height: 40%;
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

@media only screen and (max-width: 1024px) {
  .item {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  img {
    width: 50px;
    height: 50px;
  }

  .num {
    font-size: 20px !important;
  }

  .sourceDiv {
    display: flex;
  }
}
</style>

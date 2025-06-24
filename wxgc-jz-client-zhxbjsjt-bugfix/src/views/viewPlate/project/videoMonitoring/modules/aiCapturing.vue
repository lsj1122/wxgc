<template>
  <div class="AI1">
    <!-- <div id="pEcharts"></div> -->

    <div class="ai-aa">
      <p>{{this.data}}</p>
      <p>视频监控总数</p>
    </div>
    <div class="ai-aa">
      <p>{{this.data}}</p>
      <p>算法总路数</p>
    </div>
  </div>
</template>

<script>
import { AiStatistics } from "@/views/viewPlate/enterPrise/api/videoMonitoring";
export default {
  created() {
    this.getAiStatistics();
  },
  components: {},
  data() {
    return {
      data: 0,
    };
  },
  mounted() {},
  methods: {
    //获取ai统计数据
    getAiStatistics() {
      AiStatistics().then((res) => {
        if (res.code == "success") {
          this.data = res.data;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.AI1 {
  height: 100%;
  // min-height: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .ai-aa {
    width: 30%;
    border: 1px solid rgb(0, 162, 255, 0.5);

    p {
      text-align: center;
      font-size: 16px;
    }
    p:nth-child(1) {
      //    color: #4C4C4C;
      font-size: 18px;
      font-weight: 600;
    }
    p:nth-child(2) {
      color: #00b1ff;
    }
  }
}
</style>

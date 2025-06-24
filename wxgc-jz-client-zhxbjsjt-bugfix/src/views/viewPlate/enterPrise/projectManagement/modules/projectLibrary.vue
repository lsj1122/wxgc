<template>
  <div class="pro-library">
    <ul class="pro-title">
      <li
        class="liMenu"
        :class="idx == index ? 'hover' : ''"
        @click="son(item, idx)"
        v-for="(item, idx) in menu"
        :key="idx"
      >
        {{ item }}
      </li>
    </ul>
    <div class="info-content" v-loading="loading">
      <ul v-show="!isData">
        <li v-for="(item, index) in data" :key="index">
          <div class="d1">
            <img :src="item.projectPicture" alt="" />
          </div>
          <div class="d2">
            <p>{{ item.proName }}</p>
            <p>
              开工：<span>{{ item.startDate }}</span>
            </p>
            <p>
              计划竣工：<span>{{ item.endDate }}</span>
            </p>
            <p>
              剩余工期：<span>{{ item.dayStr>=0?item.dayStr:0 }}</span
              >天
            </p>
          </div>
          <div class="d3">
            <div>
              <p>设备在线率</p>
              <p>
                <span style="color: #84ffe4">{{ item.sbzx>=100?100:item.sbzx }}</span
                >%
              </p>
            </div>
            <div>
              <p>员工出勤率</p>
              <p>
                <span style="color: #af84ff">{{
                  item.ygcq ? (item.ygcq>=100?100: item.ygcq) : 0
                }}</span
                >%
              </p>
            </div>
            <div>
              <p>隐患整改率</p>
              <p>
                <span style="color: #ffe984">{{ item.yh ? (item.yh>=100?100: item.yh) : 0 }}</span
                >%
              </p>
            </div>
            <div>
              <p>AI监控算法</p>
              <p>
                <span style="color: #84ffe4">0</span
                ><i style="position: relative; top: -5px">种</i>
              </p>
            </div>describe
            <div>
              <p>监控摄像头</p>
              <p>
                <span style="color: #ff9e84">{{ item.sxt ?  (item.sxt>=100?100: item.sxt) : 0 }}</span
                >路
              </p>
            </div>
          </div>
        </li>
      </ul>
      <div class="noData" v-show="isData">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { projectLibrary } from "@/views/viewPlate/enterPrise/api/enterPriseSchedule";
import moment from "moment";
export default {
  components: {},
  data() {
    return {
      menu: ["全部", "在建", "未开工", "完工"],
      index: 0,
      data: [],
      isData: false,
      loading: true,
    };
  },
  created() {
    this.getProjectLibrary(0);
  },
  mounted() {},
  methods: {
    getProjectLibrary(flag) {
      projectLibrary(flag).then((res) => {
        // 请求成功 关闭加载动画
        this.loading = false;
        if (res.code == "success") {
          this.data = res.data;
          if (this.data.length == 0) {
            this.isData = true;
          } else {
            this.isData = false;
          }
        }
      });
    },
    son(item, idx) {
      // idx 的值为 0 获取全部项目 1 获取在建项目 2 未开工项目 3 完工项目
      this.index = idx;
      this.getProjectLibrary(idx);
    },
  },
};
</script>
<style lang="scss" scoped>
.pro-library {
  height: 100%;
  min-height: 680px;
  overflow: auto;
}
.pro-title {
  margin-left: 20px;
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: left;
  align-items: center;
  color: #84c7ff;
  font-weight: 400;
  li {
    font-size: 20px;
    height: 150px;
    height: 50px;
    padding: 10px 15px;
    //   background-color: pink;
  }
}
.liMenu {
  margin-right: 20px;
  cursor: pointer;
}
.liMenu.hover {
  //   color: #FFFFFF;
  border-width: 0 0 5px;
  border-style: solid;
  border-image: linear-gradient(45deg, #0d3349, #56b6ff) 10% round;
}

.info-content {
  width: 100%;
  ul {
    padding: 0;
    list-style: none;
    li {
      display: flex;
      justify-content: left;
      align-items: center;
      border-bottom: 1px solid #283450;
      .d1 {
        margin-left: 20px;
        img {
          width: 180px;
          height: 120px;
        }
      }
      .d2 {
        min-width: 200px;
        margin-left: 3%;
        margin-right: -1%;
        p {
          color: #84c7ff;
          font-size: 14px;
        }
        p:nth-child(1) {
          font-weight: 500;
          color: #ffffff;
          font-family: PingFang SC;
          height: 20px;
          font-size: 20px;
        }
        p:nth-child(4) {
          span {
            color: #68ffda;
            padding: 0 5px;
          }
        }
      }
      .d3 {
        display: flex;
        width: 65%;
        justify-content: space-between;
        align-items: center;
        //  margin-right: 12%;
        div {
          width: 147px;
          height: 90px;
          text-align: center;
          background: rgba(63, 89, 226, 0.1);
          border: 1px solid rgba(0, 174, 255, 0.5);
          color: #84c7ff;

          span {
            font-size: 40px;
            margin-right: 5px;
          font-family: "Times New Roman", Times, serif;
          }
          p:nth-child(1) {
            margin: 12px 0px 10px 0px;
          }
          p:nth-child(2) {
            margin: 0px 0px;
          }
        }
      }
    }
  }
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

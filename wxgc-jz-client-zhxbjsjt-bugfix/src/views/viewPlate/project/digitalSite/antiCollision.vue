<template>
  <div class="contentTJ">
    <div class="left">
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        height="95%"
        style="width: 100%"
      >
        <el-table-column property="machineName" label="设备名称">
        </el-table-column>
        <el-table-column property="userName" label="司机"> </el-table-column>
        <el-table-column property="machineState" label="设备状态">
          <template slot-scope="scope">
            {{
              scope.row.machineState == 0
                ? "在线"
                : scope.row.machineState == 1
                ? "离线"
                : ""
            }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="center" ref="centerBox">
      <!-- 展示的盒子 -->
      <div
        v-if="show"
        class="zbCanvas"
        :style="{ width: offsetWidth + 'px', height: offsetHeight + 'px' }"
      >
        <!-- 点 -->
        <div
          class="site-item"
          v-for="(item, ind) in controlData"
          :key="ind"
          :style="{
            left: item.ttTj.coordinateX * pantographRatio + 'px',
            bottom: item.ttTj.coordinateY * pantographRatio + 'px',
          }"
        >
          <!-- 旋转的指针 -->
          <div
            v-if="item.tjWorkData"
            class="tjdb-item"
            :style="{
              height: item.ttTj.armLengthF * pantographRatio + 'px',
              transform: `rotate(${item.tjWorkData.rotationValue}deg)`,
            }"
          ></div>

          <span
            class="radius-box item_active istaji"
            :style="{
              backgroundColor: item.ttTj.towerCraneBGC
                ? item.ttTj.towerCraneBGC
                : '',
              width: item.ttTj.armLengthF * pantographRatio * 2 + 'px',
              height: item.ttTj.armLengthF * pantographRatio * 2 + 'px',
            }"
          >
            <span class="device-tips">{{
              item.ttTj ? item.ttTj.machineName : ""
            }}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="right">
      <div v-if="currentRow.machineName">
        <div class="rightDiv">
          <span class="rigthSpanL">名称:</span>
          <span class="rigthSpan">{{
            device.ttTj ? device.ttTj.machineName : ""
          }}</span>
        </div>
        <div class="rightDiv">
          <span class="rigthSpanL">高度:</span>
          <span class="rigthSpan">{{
            device.tjWorkData ? device.tjWorkData.heightValue : ""
          }}</span>
        </div>
        <div class="rightDiv">
          <span class="rigthSpanL">幅度:</span>
          <span class="rigthSpan">{{
            device.tjWorkData ? device.tjWorkData.rangeValue : ""
          }}</span>
        </div>
        <div class="rightDiv">
          <span class="rigthSpanL">回转:</span>
          <span class="rigthSpan">{{
            device.tjWorkData ? device.tjWorkData.rotationValue : ""
          }}</span>
        </div>

        <div class="rightDiv">
          <span class="rigthSpanL">倾角(°):</span>
          <span class="rigthSpan">{{
            device.tjWorkData ? device.tjWorkData.dipAngle : ""
          }}</span>
        </div>

        <div class="rightDiv">
          <span class="rigthSpanL">力矩(%):</span>
          <span class="rigthSpan">{{
            device.tjWorkData ? device.tjWorkData.momentPercent : ""
          }}</span>
        </div>

        <div class="rightDiv">
          <span class="rigthSpanL">前臂长:</span
          ><span class="rigthSpan">{{
            device.ttTj ? device.ttTj.armLengthF : ""
          }}</span>
        </div>
        <!-- <div class="rightDiv">
          <span class="rigthSpanL">限位:</span>
          <span class="rigthSpan">111</span>
        </div> -->
        <div class="rightDiv">
          <span class="rigthSpanL">重量(%):</span>
          <span class="rigthSpan">{{
            device.tjWorkData ? device.tjWorkData.weightPercent : ""
          }}</span>
        </div>
        <div class="rightDiv">
          <span class="rigthSpanL">风速(m/s):</span>
          <span class="rigthSpan">{{
            device.tjWorkData ? device.tjWorkData.windSpeed : ""
          }}</span>
        </div>
        <!-- <div class="rightDiv">
          <span class="rigthSpanL">塔机间碰撞:</span>
          <span class="rigthSpan">111</span>
        </div> -->
        <div class="rightDiv">
          <span class="rigthSpanL">采集时间:</span
          ><span class="rigthSpan">{{
            device.tjWorkData ? device.tjWorkData.uploadDate : ""
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { realTimeOne } from "@/views/viewPlate/project/digitalSite/api/ttdigitlocation";
import { selectAllInfoList } from "./api/antiCollision";
import { selectAllInfo } from "@/views/digitalConstructionSite/tj/api/tttj";
export default {
  name: "WxgcJzClientAntiCollision",
  data() {
    return {
      tableData: [],
      show: false,
      offsetWidth: "",
      offsetHeight: "",
      pantographRatio: 0, // px /米
      controlData: [],
      device: {}, //右侧的设备信息
      currentRow: {},
      timer: null,
      timer2: null,
    };
  },
  mounted() {
    this.selectAllInfoList();
  },
  destroyed() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
      console.log("this.currentRow", this.currentRow);
      selectAllInfo(this.currentRow.machineNumber).then((res) => {
        if (res.code == "success") {
          this.device = res.data || {};
        }
      });
      this.timer = setInterval(() => {
        this.selectAllInfo();
      }, 5000);
    },

    selectAllInfo() {
      if (this.currentRow && this.currentRow.machineNumber) {
        selectAllInfo(this.currentRow.machineNumber).then((res) => {
          if (res.code == "success") {
            this.device = res.data || {};
          }
        });
      }
    },

    selectAllInfoList() {
      let _this = this;
      if (
        this.$refs.centerBox.offsetWidth <= this.$refs.centerBox.offsetHeight
      ) {
        this.offsetWidth = this.$refs.centerBox.offsetWidth;
        this.offsetHeight = this.$refs.centerBox.offsetWidth;
      } else {
        this.offsetWidth = this.$refs.centerBox.offsetHeight;
        this.offsetHeight = this.$refs.centerBox.offsetHeight;
      }

      selectAllInfoList().then((res) => {
        // 取出 x,y 的最大值
        this.controlData = res.data;
        this.show = true;
        var xyArr = [];
        res.data.forEach((item) => {
          xyArr.push(item.ttTj.coordinateX);
          xyArr.push(item.ttTj.coordinateY);

          _this.tableData.push({
            machineName: item.ttTj ? item.ttTj.machineName : "",
            userName: item.tjAttendanceData
              ? item.tjAttendanceData.userName
              : "",
            machineState: item.ttTj ? item.ttTj.machineState : "",
            machineNumber: item.ttTj ? item.ttTj.machineNumber : "",
          });
        });
        this.$refs.singleTable.setCurrentRow(this.tableData[0]);
        // 默认半径有50米
        // 缩放比
        this.pantographRatio = this.offsetWidth / (Math.max(...xyArr) + 100);
        // 定时请求
        this.realTimeOne(res.data);
        this.timer2 = setInterval(() => {
          this.realTimeOne(res.data);
        }, 4000);
      });
    },

    realTimeOne(data) {
      let _this = this;
      let list = [];
      console.log(243, data);
      data.forEach((item) => {
        list.push(item.ttTj.machineNumber);
      });
      if (list.length > 0) {
        realTimeOne({ hostNumbers: list }).then((res) => {
          if (res.code == "success") {
            console.log("=========", res);
            data.forEach((item, index) => {
              res.data.forEach((item2, index2) => {
                if (item2) {
                  if (item2.hostNumber == item.ttTj.machineNumber) {
                    if (item2.machineStatus != null) {
                      // 判断设备是否离线
                      if (item2.alarmStatus == 0) {
                        this.controlData[index].ttTj.towerCraneBGC =
                          "rgba(245, 107, 1, 0.27)";
                      } else if (item2.alarmStatus == 1) {
                        _this.$set(this.controlData, index, {
                          ...item,
                          towerCraneBGC: "rgba(245, 1, 1, 0.50)",
                        });
                        this.controlData[index].ttTj.towerCraneBGC =
                          "rgba(245, 1, 1, 0.50)";
                      } else {
                        this.controlData[index].ttTj.towerCraneBGC = "";
                      }
                    } else {
                      this.controlData[index].ttTj.towerCraneBGC =
                        "rgba(187, 184, 182, 0.24)";
                    }
                    // 修改转角
                    this.controlData[index].tjWorkData.rotationValue =
                      item2.rotationValue;
                  }
                }
              });
            });
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contentTJ {
  width: 100%;
  height: 100%;
  display: flex;
}
.left {
  width: 300px;
  height: 100%;
}
.center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.right {
  width: 220px;
  height: 100%;
}
.zbCanvas {
  position: relative;
  //   background-color: pink
}

.site-item {
  position: absolute;
  z-index: 98;

  div.tjdb-item {
    position: absolute;
    width: 4px;
    background: rgba(222, 113, 76, 0.74);
    z-index: 9;
    left: 50%;
    transform-origin: center bottom;
    margin-left: -2px;
    transition: all 3.5s linear;
  }
  &:hover {
    div.tjdb-item {
      background: rgb(255, 126, 64);
    }
  }
  span {
    display: block;
    border-radius: 50%;
    text-align: center;
    min-width: 30px;
    position: relative;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    .device-tips {
      z-index: 100;
    }
    // i {
    //   border: 3px solid;
    //   background: #fff;
    //   padding: 3px;
    //   border-radius: 50%;
    //   position: relative;
    //   z-index: 91;
    //   &:hover {
    //     a.device-tips {
    //       display: block;
    //     }
    //   }
    //   a.device-tips {
    //     position: absolute;
    //     top: -28px;
    //     left: -140%;
    //     display: none;
    //     font-size: 12px;
    //     color: #d1f4ff;
    //     background: rgba(0, 75, 119, 0.57);
    //     border-radius: 3px;
    //     min-width: 86px;
    //     padding: 3px 0;
    //   }
    //   &::after {
    //     content: "\25BC";
    //     position: absolute;
    //     left: 3px;
    //     bottom: -20px;
    //   }
    // }
  }
  span.isCollision {
    i {
      animation: shadowAnim 1s infinite;
      animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
    }
  }
  span.istaji {
    background: rgba(1, 178, 245, 0.17);
    // background: rgba(245, 1, 1, 0.50);
    border: 1px dashed #008de0;
  }
}

::v-deep .current-row {
  background-color: rgb(13, 158, 242, 0.3) !important;
}
::v-deep .el-table__body .current-row td {
  background-color: rgb(13, 158, 242, 0.3) !important;
}
.rightDiv {
  margin-top: 20px;
  font-size: 16px;
  display: flex;
  justify-content: left;
}
.rigthSpanL {
  display: inline-block;
  width: 100px;
}
.rigthSpan {
  display: inline-block;
  width: 100px;
  background-color: rgb(13, 158, 242, 0.3);
  text-align: center;
}
</style>
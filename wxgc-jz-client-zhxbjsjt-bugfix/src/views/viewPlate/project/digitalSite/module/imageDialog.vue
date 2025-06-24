<template>
  <el-dialog
    title="深基坑监测"
    :footer="null"
    :visible.sync="openCard"
    @ok="openCard = false"
    @close="cancelDig"
    width="80%"
    :modal-append-to-body="false"
  >
    <div
      @scroll="calculateOfffset"
      class="dcBox"
      id="parentBox"
      @mouseup="handleup"
      @mousemove="handlemove($event)"
    >
      <img
        :src="srcFile"
        alt=""
        srcset=""
        @click="showTip = false"
        id="imgWh"
      />
      <div
        class="tooltip"
        :style="{
          left: pointParam.valueX - 0 + 10 + 'px',
          top: pointParam.valueY - 0 + 10 + 'px',
        }"
        v-if="showCnt"
      >
        <h4>基坑监测点数据</h4>
        <ul>
          <li><span>水位高程：</span>2.78m</li>
          <li><span>日变化量：</span>0m</li>
          <li><span>预警判断：</span>正常</li>
        </ul>
        <div style="display: flex; justify-content: space-between">
          <el-button
            style="background: #0078d7; color: #fff"
            size="small"
            @click.stop="
              showCnt = false;
              showTip = false;
            "
            >取消</el-button
          >
          <el-button
            style="background: #ff4d4f; color: #fff"
            size="small"
            @click.stop="delPoint"
            >删除</el-button
          >
        </div>
      </div>
      <span
        v-for="(item, index) in pointData"
        class="jikendian"
        :class="{
          color0: item.type === '0',
          color1: item.type === '1',
          color2: item.type === '2',
          color3: item.type === '3',
          color4: item.type === '4',
        }"
        :style="{ left: item.valueX + 'px', top: item.valueY + 'px' }"
        @click.self="handClickJid(item)"
        :key="index"
      >
        <a class="device-tips">{{ item.pointNumber }}</a>
      </span>
      <div
        class="tooltip"
        :style="{
          left: moveItem.valueX + 10 + 'px',
          top: moveItem.valueY + 10 + 'px',
        }"
        v-if="showTip"
      >
        <h4>深基坑监测数据</h4>
        <ul>
          <li>
            <span>监测类型：</span>
            <el-select
              size="small"
              style="margin-left: 10px; width: 150px"
              v-model="params.pointNumber"
              @change="changeValue"
            >
              <el-option
                v-for="(item, index) in swList"
                :key="index"
                :value="item.pointNumber"
                >{{ item.pointNumber }}</el-option
              >
            </el-select>
          </li>
        </ul>
      </div>
      <div class="right-tuli">
        <span v-for="(item, i) in bsList" :key="i"
          ><span
            ><i
              @mousedown="downItem($event, item)"
              :style="{ background: item.bg }"
            ></i
            >{{ item.title }}</span
          >{{ item.num }}</span
        >
      </div>
      <i
        id="movitem"
        v-show="ismove"
        :style="{
          top: moveItem.valueY + 'px',
          left: moveItem.valueX + 'px',
          background: moveItem.bg,
        }"
      ></i>
    </div>
  </el-dialog>
</template>

<script>
import {
  getAllOptions,
  deletePoint,
  getAllType,
  addPoint,
} from "../api/jkjcapi";
export default {
  props: ["picType"],
  data() {
    return {
      openCard: false,
      pointData: [],
      srcFile: "",
      swList: [],
      showCnt: false, //弹框的内容
      pointInfo: {}, //测点信息
      bsList: [
        {
          type: 0,
          title: "地下水位观测点",
          num: 46,
          bg: "#00c3ff",
        },
        {
          type: 1,
          title: "竖向位移观测点",
          num: 30,
          bg: "#005fcd",
        },
        {
          type: 2,
          title: "水平位移观测点",
          num: 16,
          bg: "#fe0101",
        },
        {
          type: 3,
          title: "深层土体水平位移观测点(测斜)",
          num: 13,
          bg: "#fea201",
        },
        {
          type: 4,
          title: "临近建筑竖向位移观测",
          num: 4,
          bg: "#0cff01",
        },
      ],
      moveItem: {
        name: "",
        bg: "",
        num: "",
        valueX: 0,
        valueY: 0,
        type: "",
      },
      parentOffset: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
      imgLength: {
        w: 0,
        h: 0,
      },
      pointParam: {}, //删除测点参数
      //添加测点的参数
      params: {
        picType: "",
        pointNumber: "",
        valueX: "",
        valueY: "",
        type: "",
        percentX: "",
        percentY: "",
      },
      ismove: false,
      mouseUP: true,
      showTip: false,
      padding: -50,
    };
  },
  watch: {
    openCard(val) {
      if (val) {
        this.$nextTick(() => {
          this.calculateOfffset();
        });
        this.params.picType = this.picType;
        this.getImgPoints();
      }
    },
  },
  mounted() {
    this.getImgPoints();
    this.getPoints();
  },
  methods: {
    //获取图片布点
    getImgPoints() {
      getAllOptions({ picType: this.picType }).then((res) => {
        if (res.code === "success") {
          this.ismove = false; //获取布置点后，应将移动的那个点隐藏
          this.pointData = res.data;
        }
      });
    },
    //获取测点下拉数据
    getPoints() {
      getAllType().then((res) => {
        if (res.code === "success") {
          this.swList = res.data;
        }
      });
    },
    //添加测点
    addPoint(params) {
      addPoint(params).then(async (res) => {
        if (res.code === "success") {
          this.showTip = false;
          await this.getImgPoints();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    //获取每个测点的数据信息
    async getPointInfo(val) {
      await getAction("/entryJk/wxJkPoint/getDetail", {
        pointNumber: val,
      }).then((res) => {
        if (res.success) {
          this.pointInfo = res.result;
          this.showCnt = true;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    //弹框显示
    changeImg(val) {
      this.srcFile = val;
      this.openCard = true;
      this.showCnt = false;
      this.showTip = false;
    },
    //选择测点
    changeValue(val) {
      this.params.pointNumber = val;
      this.addPoint(this.params);
    },
    calculateOfffset() {
      this.$nextTick(() => {
        let combox = document.querySelector(".el-dialog");
        let parentbox = document.querySelector(".dcBox");
        //求取元素与屏幕距离，当图片滚动的时候，此时要减去滚动上去的高度
        console.log(111, parentbox.scrollTop);
        this.parentOffset.y =
          parentbox.offsetTop + combox.offsetTop - parentbox.scrollTop;
        this.parentOffset.x = combox.offsetLeft + parentbox.offsetLeft;
        //求取容器宽 高
        this.parentOffset.w = parentbox.offsetWidth;
        this.parentOffset.h = parentbox.offsetHeight;
        //求图片的宽、高
        this.imgLength.w = document.querySelector("#imgWh").offsetWidth;
        this.imgLength.h = document.querySelector("#imgWh").offsetHeight;
      });
    },
    downItem(e, item) {
      console.log(item);
      //鼠标点击设备元素（左按下）触发
      //设备信息赋值给移动元素
      this.moveItem.name = "XXX" + item.title;
      this.moveItem.bg = item.bg;
      this.moveItem.num = item.num;
      this.moveItem.type = item.type;
      this.params.type = item.type;
      this.ismove = true;
      this.mouseUP = false;
      this.showTip = false;
    },
    handleup() {
      // 放开鼠标左键后触发
      this.mouseUP = true;
      this.showTip = true;
      this.getPoints();
    },
    handlemove(e) {
      //鼠标移动中持续触发
      console.log('移动中触发');
      if (!this.mouseUP) {
        //移动元素跟随鼠标指针移动
        let xalias = e.clientX - this.parentOffset.x;
        let yalias = e.clientY - this.parentOffset.y;
        this.moveItem.valueX = xalias;
        this.moveItem.valueY = yalias;
        this.params.valueX = this.moveItem.valueX;
        this.params.valueY = this.moveItem.valueY;
        this.params.percentX = this.params.valueX / this.imgLength.w;
        this.params.percentY = this.params.valueY / this.imgLength.h;
      }
    },
    //点击布置好的点
    handClickJid(item) {
      this.pointParam = item;
      this.showTip = false;
      this.showCnt = true;
      // this.getPointInfo(item.pointNumber) //后期如果是需要后端对接，将上面this.showCnt删除，开放这个函数
    },
    //删除测点
    delPoint() {
      this.showTip = false;
      deletePoint(this.pointParam.id).then((res) => {
        if (res.code === "success") {
          this.showCnt = false;
          this.getImgPoints();
          this.getPoints();
          this.$message.success(res.message);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    cancelDig() {
      this.openCard = false;
      this.$emit("off");
    },
  },
};
</script>

<style scoped lang="less">
.dcBox {
  position: relative;
  overflow: scroll;
  height: 50vh;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  img {
    width: 1100px;
  }
  .jikendian {
    position: absolute;
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 2px solid #fff;
    border-radius: 100%;
    &:hover {
      a.device-tips {
        display: block;
      }
    }
  }
  a.device-tips {
    position: absolute;
    top: -28px;
    left: -140%;
    display: none;
    text-align: center;
    font-size: 12px;
    color: #d1f4ff;
    background: rgba(0, 75, 119, 0.57);
    border-radius: 3px;
    min-width: 100px;
    padding: 3px 0;
  }
  .right-tuli {
    position: fixed;
    top: 18%;
    right: 14%;
    flex-direction: column;
    display: flex;
    > span {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      color: rgba(179, 188, 202, 1);
      span {
        margin-right: 5px;
      }
      i {
        width: 12px;
        display: inline-block;
        margin-right: 5px;
        height: 12px;
        border-radius: 100%;
        border: 2px solid #fff;
      }
    }
  }
}
i#movitem {
  width: 13px;
  height: 13px;
  border: 2px solid #fff;
  position: absolute;
  z-index: 9;
  -webkit-animation: none;
  animation: none;
  border-radius: 50%;
}
.tooltip {
  position: absolute;
  padding: 15px;
  min-width: 260px;
  z-index: 999;
  background-color: rgba(1, 26, 55, 0.95);
  box-shadow: 0 0 5px #0be3e6 inset;
  border-radius: 5px;
  h4 {
    padding: 0;
    margin: 0;
    font-weight: 400;
    margin-bottom: 10px;
    font-size: 18px;
    color: #017cd6;
  }
  ul {
    color: white;
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      padding: 3px 0;
      span {
        text-align: right;
        display: inline-block;
        width: 33%;
        white-space: nowrap;
      }
    }
  }
}
.color0 {
  background-color: #00c3ff;
}
.color1 {
  background-color: #005fcd;
}
.color2 {
  background-color: #fe0101;
}
.color3 {
  background-color: #fea201;
}
.color4 {
  background-color: #0cff01;
}
::v-deep .ant-modal-body {
  overflow: hidden;
}
</style>
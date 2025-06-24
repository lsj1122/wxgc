<template>
  <div class="gzm">
    <div class="gzm-left">
      <div class="gzm-left-top box">
        <el-select
          v-model="value"
          @change="createXY"
          placeholder="请选择"
          style="width: 200px; margin-bottom: 10px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="img">
          <div class="right-tuli">
            <span
              ><span
                ><i style="background-color: blue"></i>斜坡高排架区域</span
              ></span
            >
            <span
              ><span
                ><i style="background-color: yellow"></i>高排架区域</span
              ></span
            >
            <span
              ><span
                ><i style="background-color: purple"></i>盘扣式支撑架区域</span
              ></span
            >
          </div>
          <img
            @click="changeImage"
            :src="img"
            alt=""
            srcset=""
            class="foundpit-img"
          />
          <span
            v-for="(item, index) in pointData"
            class="jikendian"
            :class="{
              color0: item.name === '0',
              color1: item.name === '1',
              color2: item.name === '2',
            }"
            :style="{ left: item.xaxis + 'px', top: item.yaxis + 'px' }"
            :key="index"
          >
            <a class="device-tips">{{ item.labelName }}</a>
          </span>
        </div>
      </div>
      <div class="gzm-left-bottom box">
        <gzm-left-bottom />
      </div>
    </div>
    <div class="gzm-right">
      <div class="gzm-right-top box">
        <gzm-left-top />
      </div>
      <div class="gzm-right-top box">
        <gzm-right-middle />
      </div>
      <div class="gzm-right-top box">
        <gzm-right-bottom />
      </div>
    </div>
    <image-dialog ref="diag" :picType="value" @off="createXY"></image-dialog>
  </div>
</template>

<script>
import { getAllOptions } from "./api/gzmapi";
import ComBox from "../../components/combox";
import gzmLeftTop from "./module/gzmLeftTop";
import gzmRightMiddle from "./module/gzmRightMiddle";
import gzmRightBottom from "./module/gzmRightBottom";
import gzmLeftBottom from "./module/gzmLeftBottom";
import imageDialog from "./module/imageDialog";
export default {
  components: {
    ComBox,
    gzmLeftTop,
    gzmRightMiddle,
    gzmRightBottom,
    gzmLeftBottom,
    imageDialog,
  },
  data() {
    return {
      pointData: [],
      imgList: [
        "https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210525/QQpicture20210525160239.png",
        "https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210604/8.4m标高高排架.jpg",
        "https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210604/16.4m标高高排架.jpg",
        "https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210604/27.9m标高高排架.jpg",
      ],
      options: [
        {
          value: "0",
          label: "0.1m标高高排架",
        },
        {
          value: "1",
          label: "8.4m标高高排架",
        },
        {
          value: "2",
          label: "16.4m标高高排架",
        },
        {
          value: "3",
          label: "27.9m标高高排架",
        },
      ],
      value: "0",
    };
  },
  computed: {
    img() {
      return this.imgList[this.value - 0];
    },
  },
  mounted() {
    this.createXY();
  },
  methods: {
    //加载测点
    createXY() {
      getAllOptions({ pictureType: this.value }).then((res) => {
        if (res.code === "success") {
          let offsetH = document.querySelector(".foundpit-img");
          res.data.forEach((item) => {
            item.xaxis =
              item.xproportion * offsetH.offsetWidth + offsetH.offsetLeft;
            item.yaxis =
              item.yproportion * offsetH.offsetHeight + offsetH.offsetTop;
          });
          this.pointData = res.data;
        }
      });
    },
    //点击图片
    changeImage() {
      this.$refs.diag.changeImg(this.img);
    },
  },
};
</script>

<style lang="less" scoped>
@import "./MQBaseStyle.less";
.gzm {
  width: 100%;
  height: 106%;
  display: flex;
  .gzm-left {
    flex: 4;
    margin-right: 15px;
    .gzm-left-top {
      height: 65%;
      display: flex;
      flex-direction: column;
      .img {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 90%;
        .foundpit-img {
          height: 41vh;
          position: relative;
        }
      }
    }
    .gzm-left-bottom {
      margin-top: 15px;
      height: 35%;
    }
  }
  .gzm-right {
    flex: 1.5;
    .gzm-right-top {
      height: 33%;
      &:nth-child(2) {
        margin: 10px 0;
      }
    }
  }
}
.right-tuli {
  position: absolute;
  bottom: 3%;
  right: 2%;
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
      background-color: rgb(0, 195, 255);
    }
  }
}
.jikendian {
  position: absolute;
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 1px solid #fff;
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
  min-width: 86px;
  padding: 3px 0;
}
.color0 {
  background-color: rgb(103, 175, 8);
}
.color1 {
  background-color: orange;
}
.color2 {
  background-color: #f10df1;
}
::v-deep .com-box .cb-content {
  height: 95%;
}
</style>

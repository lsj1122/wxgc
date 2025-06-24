<template>
  <div>
    <div v-if="title" style="margin-bottom: -9px;" class="commonbox">
      <div class="commonboxBoom">
      <img src="../../../assets/compent/q1.png" alt="" style="margin-right:10px">
      <img src="../../../assets/compent/q2.png" alt="" style="margin-right:8px;" class="img2">

      <span style="font-family: pmzd; font-size: 20px; margin-left:8px">{{ title }}</span>
      <span style="color: #1360A9; font-size:12px; margin-left:16px">{{ title2 }}</span>



      <!-- <span class="el-icon-arrow-right"></span> -->
      <slot name="button"></slot>
      </div>
    </div>
    <div class="com-box">
      <div class="cb-head">
        <div class="cb-head-right">
          <slot name="head"></slot>
        </div>
      </div>

      <div class="cb-content" :style="conentStyle">
        <slot></slot>
      </div>

      <!-- 边角 -->

      <!-- <i class="jiao jiao-l-b"></i>
      <i class="jiao jiao-r-t"></i> -->
    </div>
  </div>
</template>

<script>

export default {
  name: "combox",
  props: ["title", "title2"],
  data() {
    return {
      active: 0,
    };
  },
  created() {

  },
  methods: {
    handClick(item) {
      this.active = item;
      this.$emit("update:currentIndex", item);
    },

  },
};
</script>

<style lang="less" scoped>
.commonbox{
  height: 32px;
  background: url("../../../assets/compent/Group.png") no-repeat  ;
background-size: 100% 100%;
  .commonboxBoom{
    background: url("../../../assets/compent/bk.png") no-repeat;
    background-size: 100% 100%;
    .img2{
      width: 18px;
      height: 18px;
      margin-top: 5px;
    }

  }
}
.commonbox span:nth-child(1) {
  color: #fff;
  font-weight: 500;
  font-size: 20px;
  margin-right: 3px;
  font-family: pmzd;
  letter-spacing: 2px;
}
.com-box {
  margin-top: 2px;
  // margin-bottom: 12px;
  box-sizing: border-box;
  position: relative;
  padding: 15px;
  padding-top: 0px;
  // border: 1px solid #113aae;
  background:rgba(126,183,255,0.1);
  //   box-shadow: inset 0 0 20px rgba(0, 163, 255, 0.5);
  //  box-shadow: inset 0 0 20px rgba(7, 20, 54);
  .cb-head {
    position: relative;
    margin-bottom: 10px;
    .moreTile {
      display: flex;
      h3 {
        border: 0;
        margin-right: 15px;
        padding: 0;
        cursor: pointer;
        &:hover {
          opacity: 0.9;
        }
      }
      h3.titleActive {
        color: #00f0fd;
      }
    }
    .combox-title {
      margin: 0;
      padding: 0 0 0 15px;
      text-align: left;
      font-weight: 400;
      height: 15px;
      line-height: 15px;
      border-left: 3px solid @scolor;
      color: #c3e9fc;
    }
    .cb-head-right {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 1000;
      i {
        font-size: 18px;
        margin-left: 7px;
        color: #01b9ff;
      }
    }
  }
  .cb-content {
    height: 90%;
    text-align: left;
  }

  i.jiao {
    position: absolute;
    width: 11px;
    height: 11px;
    background: url("../../../assets/viewplate/box_jiao.png") no-repeat;
  }
  i.jiao-l-t {
    top: -3px;
    left: -3px;
  }
  i.jiao-r-t {
    top: -3px;
    right: -2px;
    background-position: -11px 0;
  }
  i.jiao-l-b {
    bottom: -2px;
    left: -3px;
    background-position: 0 -11px;
  }
  i.jiao-r-b {
    bottom: -2px;
    right: -2px;
    background-position: -11px -11px;
  }
}
// @media screen and (max-width: 1024px) {
//   .commonbox span:nth-child(1) {
//     transform: scaleY(0.9);
//   }
// }

.el-img {
  float:right;
  margin-top: 12px;
  cursor: pointer;

}

.el-icon-s-unfold {
  font-size: 20px;
  float: right;
  color: #0384ff;
  cursor: pointer;
}
</style>

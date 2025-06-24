<template>
  <div class="layout">
    <div class="top right" v-if="isRight">
      <span class="title">{{ title }}</span>
      <span class="total"
        ><span>{{ total }}</span> <span class="num">{{ num }}</span>
      </span>
    </div>
    <div class="top" v-else>
      <span class="title">{{ title }}</span>
    </div>
    <div class="bottom">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "combox",
  props: {
    title: String,
    isRight: {
      default: false,
      type: Boolean,
    },
    total: String,
    num: Number,
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
  position: relative;
  .top {
    height: 24px;
    width: 100%;
    background: url("~@/assets/newScreen/combox.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .title {
      //   height: 31px;
      font-size: 24px;
      font-family: "YouSheBiaoTiHei";
      font-weight: 400;
      color: #ebfff9;
      line-height: 28px;
      padding-left: 18px;
      // font-style: italic;
      // letter-spacing: 1px;
    }
  }
  .right {
    width: 60%;
    .total {
      font-size: 18px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ebfff9;
      position: absolute;
      right: 5px;
    }
    .num {
      margin-left: 10px;
      font-size: 24px;
      font-family: DIN-Bold, DIN;
      font-weight: bold;
      color: #ffa843;
    }
  }
  .bottom {
    width: 100%;
    height: calc(100% - 24px);
    padding: 5px 0;
  }
}
</style>
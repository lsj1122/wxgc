<template>
  <div class="com-box">
    <div class="cb-head" v-if="route">
      <slot name="route"></slot>
    </div>  
    <div class="cb-head" v-if="title">
      <template v-if="title instanceof Array">
        <div class="moreTile">
          <h3 class="combox-title" :class="{'titleActive':active===item}" v-for="(item) in title" :key="item" @click="handClick(item)">{{ item }}</h3>
        </div>
      </template>
      <template v-else>
        <h3 class="combox-title">{{ title }}</h3>
      </template>
      <div class="cb-head-right">
        <slot name="head"></slot>
      </div>
    </div>

    <div class="cb-content" :style="conentStyle">
      <slot></slot>
    </div>

    <!-- 边角 -->
    <i class="jiao jiao-l-t"></i>
    <i class="jiao jiao-l-b"></i>
    <i class="jiao jiao-r-t"></i>
    <i class="jiao jiao-r-b"></i>
  </div>
</template>

<script>
export default {
  name: "combox",
  props: ['title','route','conentStyle'],
  data() {
    return {
      active:0
    }
  },
  created(){

  },
  methods:{
    handClick(item){
      this.active = item
      this.$emit('update:currentIndex',item)
    }
  }
};
</script>

<style lang="less" scoped>
.com-box {
  margin-bottom: @spacing;
  position: relative;
  padding: 15px;
  border: 1px solid #00f0fd;
  box-shadow: inset 0 0 20px rgba(0, 163, 255, 0.5);
  .cb-head {
    position: relative;
    margin-bottom: 10px;
    .moreTile{
      display: flex;
      h3{
        border:0;
        margin-right: 15px;
        padding: 0;
        cursor: pointer;
        &:hover{
          opacity: 0.9;
        }
      }
      h3.titleActive{
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
      top: -4px;
      i {
        font-size: 18px;
        margin-left: 7px;
        color: #01b9ff;
      }
    }
  }
  .cb-content {
    height: 96%;
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
</style>

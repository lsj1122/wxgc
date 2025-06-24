<template>
  <div class="class-manage-box">
    <div class="class-manage-left">
      <classLeftTop @success2="addDone" @onSearch="onSearch" :count="buildLangth" ref="lefttop"/>
      <classLeftCen @clickRow="handClickRow" @buildCount="getBuildLength" ref="leftcen"/>
    </div>
    <div class="class-manage-right">
      <div class="class-manage-right-top">
        <classRightTop :build="buildData" @handView="openDialog"/>
      </div>
      <div class="class-manage-right-center">
        <classRightCenter :build="buildData"/>
      </div>
    </div>
  </div>
</template>

<script>
import classLeftTop from './module/classLeftTop.vue'
import classLeftCen from './module/classLeftCen.vue'
import classRightTop from './module/classRightTop.vue'
import classRightCenter from './module/classRightCenter.vue'

export default {
  components: {
    classLeftTop,
    classRightTop,
    classRightCenter,
    classLeftCen
  },
  data() {
    return {
      buildData: {},
      buildLangth: 0
    }
  },
  methods: {
    handClickRow(row) {
      this.buildData = {...row}
    },
    getBuildLength(n) {
      this.buildLangth = n
    },
    addDone() {
      this.$refs.leftcen.query()
    },
    openDialog(row) {
      this.$refs.lefttop.handldAdd(row)
    },
    onSearch(value) {
      this.$refs.leftcen.query(value)
    },
  }

}
</script>

<style lang="scss" scoped>
.class-manage-box {
  display: flex;
  height: 100%;
  background: #ecf0f3;
  padding: 10px;

  .class-manage-left {
    width: 280px;
    background: #fff;
    color: #585858;
  }

  .class-manage-right {
    flex: 1;
    margin-left: 18px;
    display: flex;
    flex-direction: column;

    .class-manage-right-top {
      background: #fff;
    }

    .class-manage-right-center {
      flex: 1;
      background: #fff;
      margin-top: 18px;
    }
  }
}
</style>

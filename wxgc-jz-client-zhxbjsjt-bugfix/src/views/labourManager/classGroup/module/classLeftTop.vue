<template>
  <div style="" class="class-left-top-cen">
    <el-input
      placeholder="请输入参建单位"
      suffix-icon="el-icon-search"
      v-model="inputValue"
      @input="onSearch">
    </el-input>
    <div>共<span class="cjdw-count">{{ count }}</span>个参建单位</div>
    <el-button type="primary" @click="handldAdd">添加</el-button>
    <addDwDialog ref="adddw" @success="addDone"/>
  </div>
</template>

<script>
import addDwDialog from './addDwDialog.vue'

export default {
  props: ['count'],
  components: {
    addDwDialog
  },
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    handldAdd(row) {
      this.$refs.adddw.open(row)
    },
    onSearch() {
      console.log('onSearch', this.inputValue)
      this.$emit('onSearch', this.inputValue)
    },
    addDone() {
      this.$emit('success2')
    }
  }
}
</script>

<style lang="scss" scoped>
.class-left-top-cen {
  padding: 20px;

  > * {
    margin-top: 10px;
  }

  .cjdw-count {
    color: rgb(23, 170, 255);
    margin: 0 3px;
  }
}
</style>

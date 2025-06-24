<template>
  <el-switch
    v-model="value"
    active-value="TDengine"
    inactive-value="Mysql"
    active-text="TDengine库"
    inactive-text="Mysql库"
    @change="changeSwitch"
  >
  </el-switch>
</template>

<script>
export default {
  name: "index",
  props: {
    value: String
  },
  data() {
    return {}
  },
  methods: {
    changeSwitch(newValue) {
      this.$emit("input", newValue === 'Mysql' ? "" : newValue)
      this.$emit("changeSwitch")
    }
  }
}
</script>

<style scoped>

</style>

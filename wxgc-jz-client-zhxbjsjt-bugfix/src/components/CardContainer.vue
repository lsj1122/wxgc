<template>
  <el-col
    :span="resp && resp.span ? resp.span : 8"
    :xl="resp && resp.xl ? resp.xl : undefined"
    :lg="resp && resp.lg ? resp.lg : undefined"
    :md="resp && resp.md ? resp.md : undefined"
    :sm="resp && resp.sm ? resp.sm : undefined"
    :xs="resp && resp.xs ? resp.xs : undefined"
    style="margin: 10px 0;"
  >
    <div class="card-container">
      <div v-if="title" class="title">
        <div class="title-pro"></div>
        <div class="title-msg">{{title}}</div>
      </div>
      <slot class="full-height full-width" />
    </div>
  </el-col>
</template>

<script>
export default {
  name: "CardContainer",
  props: {
    title: {
      type: String,
      default: undefined
    },
    resp: {
      type: Object,
      default: undefined
    }
  }
};
</script>

<style scoped>
.card-container {
  border-radius: 8px;
  background-color: white;
  width: calc(100% - 0px);
  padding: 15px 40px;
}

.title {
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 0;
  margin-bottom: 10px;
  justify-content: flex-start;
}

.title-pro {
  width: 4px;
  background-color: #409eff;
  height: 16px;
  margin-right: 10px;
}

.title-msg {
  font-size: 18px;
  color: rgba(100, 108, 117, 1);
}

</style>

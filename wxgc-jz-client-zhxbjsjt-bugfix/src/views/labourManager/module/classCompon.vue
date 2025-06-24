<template>
  <div style="height: 100%">
    <el-input placeholder="" v-model="filterTreeText" class="input-with-select">
      <el-button
        type="primary"
        slot="append"
        icon="el-icon-search"
     
      ></el-button>
    </el-input>
    <div class="peopleCe">
      <el-tree
      ref="elTree"
        :data="data"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
  </div>
</template>

<script>
import { selectTtBuildTree } from "@/views/labourManager/api/ttbuildunit";

export default {
  data() {
    return {
      filterTreeText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
    watch: {
    // 监听树形组件过滤文本
    filterTreeText(val) {
        console.log(33,val);
      this.$refs.elTree.filter(val);
    },
  },
  created() {
    selectTtBuildTree().then((res) => {
      if (res.code == "success") {
        this.data = res.data;
      }
    });
  },
  methods: {
    handleNodeClick(data) {
      this.$emit("handleTreeClick", data);
    },
        // 树形搜索
    filterNode(value, data) {
        console.log(11,value);
        console.log(22,data);
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

  },
};
</script>

<style lang="scss" scoped>
.input-with-select {
  margin-bottom: 15px;
}
.peopleCe {
  overflow: auto;
  height: calc(100% - 50px);
}
</style>

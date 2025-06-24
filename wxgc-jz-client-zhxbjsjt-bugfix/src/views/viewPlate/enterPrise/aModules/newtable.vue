<template>
  <div>
        <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer">
        <el-table :data="equipmentData" style="width: 100%">
          <el-table-column prop="machineName" label="设备名称" width="180">
          </el-table-column>
          <el-table-column prop="machineNumber" label="设备编号" width="180">
          </el-table-column>
          <el-table-column prop="projectName" label="所属项目"> </el-table-column>
        </el-table>
    
      </span>
          </el-dialog>
  </div>
</template> 

<script>

export default {
  components: {},
  props:['newdata',],
  data() {
    return {

    };
  },
  mounted() {
     
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>

</style>

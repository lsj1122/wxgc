<template>
  <div style="height:100%">

    <el-table
      :data="tableData"
      height="350"
      style="width: 100%">
      <el-table-column
        prop="fileName"
        label=""
        width="300">
        <template slot-scope="scope">
          <span v-text="scope.row.fileName" @click="openFile(scope.row.filePath)">{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label=""
        width="180">
      </el-table-column>
      <el-table-column
        prop="filePath"
        label=""
        align="right"
      >
        <template slot-scope="scope">
          <img src="../../../../../assets/compent/xz.png" alt=""
               @click.stop="download(scope.row.filePath, scope.row.fileName)" style="cursor: pointer">
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {downloadFile} from "@/utils/downloadUtils";
import {quailtykhow} from "@/views/viewPlate/enterPrise/api/safetyManagement";

export default {
  name: 'knowledge',

  data() {
    return {
      tableData: []
    };
  },

  mounted() {
    this.discknws();
  },

  methods: {
    // 打开文件f29948054fbc499bb74c28aec7a7f4ac
    openFile(url) {
      console.log('打开文件', url);
      var b64Encoded = Base64.encode(url);
      window.open('/view-api/onlinePreview?url=' + encodeURIComponent(b64Encoded));
    },
    // 下载
    download(url, fileName) {

      console.log(url, fileName);
      downloadFile(url, fileName);
    },

    discknws() {
      let option = {
        // type:8,
        proName: ""
      }
      quailtykhow(option)
        .then((res) => {
          if (res.code == "success") {
            // this.tableData = res.data
            this.tableData = res.data
            console.log("质量知识库", res.data);
          }

        })
        .catch((err) => {
          // console.log(JSON.stringify(err));
          // this.dataLoading = false;
        });
    }
  },
};
</script>

<style lang="scss" scoped>

</style>

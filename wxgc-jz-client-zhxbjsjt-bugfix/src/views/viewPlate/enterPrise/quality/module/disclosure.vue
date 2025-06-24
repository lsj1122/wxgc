<template>
  <div style="height: 100%">
    <el-table :data="tableData" style="width: 100%" height="350">
      <el-table-column prop="text" label="" width="300" align="left">
        <template slot-scope="scope">
          <span v-text="scope.row.text" @click="openFile(scope.row.otherFilePath)">{{ scope.row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="" width="180" align="center">
      </el-table-column>
      <el-table-column prop="otherFilePath" label="" align="right">
        <template slot-scope="scope">
          <img
            src="../../../../../assets/compent/xz.png"
            alt=""
            style="cursor: pointer"
            @click.stop="download(scope.row.otherFilePath, scope.row.text) "
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {downloadFile} from "@/utils/downloadUtils";
import {quailtydesli} from "@/views/viewPlate/enterPrise/api/safetyManagement";
import {handleBatchDownload} from "@/utils/zipDownFile";

export default {
  name: "disclosure",

  data() {
    return {
      tableData: [],
    };
  },

  mounted() {
    this.disclos();
  },

  methods: {
    // 打开文件
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

    disclos() {
      let option = {
        type: 8,
        proName: "",
      };
      quailtydesli(option)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data;
            for (let index = 0; index < this.tableData.length; index++) {
              if (this.tableData[index].text) {
                this.tableData[index].text = this.tableData[
                  index
                  ].otherFilePath.substring(
                  this.tableData[index].otherFilePath.lastIndexOf("/") + 1
                );
              }

            }
            // res.data.text=res.data.otherFilePath.substring(res.data.otherFilePath.lastIndexOf('/') + 1)
          }
        })
        .catch((err) => {
          // console.log(JSON.stringify(err));
          // this.dataLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>

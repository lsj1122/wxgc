<template>
  <div>
    <upload-file
      :file-type="fileType"
      ref="clearData"
      list-type="text"
      :accept="accept"
      max-size="1000"
      :limit="5"
      :multiple="true"
      @change="getFiles"
    >
    </upload-file>
    <!-- <el-button size="small" type="primary" @click="uploadVideo()" style="margin-top:20px">点击选择文件</el-button>
      <el-button size="small" type="primary" @click="uploadVideo()" style="margin-top:20px">点击上传视频</el-button> -->
    <div class="ssbox">
      <label class="el-form-item__label">上传进度</label>
      <el-progress
        class="progress"
        style="top: 10px"
        :text-inside="true"
        :stroke-width="18"
        :percentage="upTotal"
      ></el-progress>
    </div>
  </div>
</template>

<script>
import OSS from "ali-oss";
import moment from "moment";
import uploadFile from "@/components/Upload/uploadFile";

export default {
  name: "proQualityVideo",
  components: { uploadFile },
  props: {
    fileType: {
      type: String,
      default: "*",
    },
    accept: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      fileName1: "",
      fileList1: "",
      ossConfig: {
        region: "oss-cn-hangzhou",
        accessKeyId: "LTAI4GKpzVjLoHp8rrrpTLFK",
        accessKeySecret: "sQHHfIvEr981dLIMUPwlSxJsx7cQcB",
        bucket: "newzhuochuang",
      },
      loading: false,
      upTotal: 0,
      fileList: [],
    };
  },
  created() {},
  methods: {
    uploadVideo(index) {
      this.fileName1 = this.fileList[index].name;
      this.fileList1 = this.fileList[index].raw;

      console.log(this.fileName1);
      console.log(this.fileList1);

      this.loading = true;
      let that = this;
      this.upTotal = 0;
      new OSS(this.ossConfig)
        .multipartUpload(
          moment().format("yyyyMMDD") + "/" + this.fileName1,
          this.fileList1,
          {
            progress: function (p, checkpoint) {
              that.upTotal = parseInt(p * 100);
            },
            meta: { year: 2021, people: "test" },
            mime: "image/jpeg",
          }
        )
        .then((res) => {
          let filePath =
            "https://" +
            this.ossConfig.bucket +
            "." +
            this.ossConfig.region +
            ".aliyuncs.com" +
            "/" +
            moment().format("yyyyMMDD") +
            "/" +
            this.fileName1;
          // 返回一个数组
          this.fileList[index].filePath = filePath;
          if (index < this.fileList.length - 1) {
            this.uploadVideo(index + 1);
          } else {
            that.$emit("upUrlArr", that.fileList);
            this.close();
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    getFiles(file, fileList) {
      this.fileList = fileList;
      this.$emit("change", this.fileList);
    },
    sureUploadVideo() {
      //   for (let i = 0; i < this.fileList.length; i++) {
      //      this.uploadVideo(i);
      //   }
      this.uploadVideo(0);
    },
    close() {
      this.fileList = [];
      (this.upTotal = 0), this.$refs.clearData.clearData();
    },
  },
};
</script>

<style scoped lang="less">
.el-form-item__label {
  text-align: left;
  width: 75px;
}
.ssbox {
  display: flex;
  height: 40px;
  .progress {
    display: inline-block;
    width: 300px;
    top: 10px;
  }
}
</style>

<template>
  <div >
    <!-- <upload-file
          file-type="jpg/png"
          ref="clearData1"
          list-type="picture"
          accept="image/*"
          max-size="20"
          @change="getFile1"
        /> -->
    <upload-file file-type="mp4" ref="clearData1" list-type="video" accept="video/*" max-size="1000"   @change="getFile1"/>
    <el-button size="small" type="primary" @click="uploadVideo()" style="margin-top:20px">点击上传视频</el-button>
     <div class="ssbox">
     <label class="el-form-item__label">上传进度</label>
     <el-progress class="progress" style="top:10px;" :text-inside="true" :stroke-width="18" :percentage="upTotal"></el-progress>
   </div>
    <h2 style="color: red; text-align:left" v-if="videoFilePath">已上传过工程质量样板</h2>


  </div>
</template>

<script>
    import OSS from "ali-oss";
    import moment from "moment";
    import uploadFile from "@/components/Upload/uploadFile";
    import {addTtUploadFile, selectType} from "@/views/sysproject/api/ttuploadfile";

    export default {
        name: "proQualityVideo",
      components:{uploadFile},
      data(){
        return{
          fileName1: "",
          fileList1: "",
          ossConfig:{
            region: 'oss-cn-hangzhou',
            accessKeyId: 'LTAI4GKpzVjLoHp8rrrpTLFK',
            accessKeySecret: 'sQHHfIvEr981dLIMUPwlSxJsx7cQcB',
            bucket: 'newzhuochuang'
          },
          loading: false,
          upTotal:0,
          videoFilePath:"",
          videoId:"",
        }
      },
      created() {
        selectType(5).then(res=>{
          if(res.data.length>0){
            this.videoFilePath = res.data[0].videoFilePath
            this.videoId = res.data[0].id
          }
        })
      },
      methods:{
        uploadVideo(){
          this.loading=true
          if(!this.fileName1){
            this.$message.error("请选择视频")
            this.loading=false
            return
          }
          let that = this
          new OSS(this.ossConfig).multipartUpload(moment().format('yyyyMMDD')+"/"+this.fileName1, this.fileList1, {
            progress: function (p, checkpoint) {
              that.upTotal = parseInt(p*100)
            },
            meta: { year: 2021, people: 'test' },
            mime: 'image/jpeg'
          }).then(res=> {
            let filePath = "https://" + this.ossConfig.bucket + "." + this.ossConfig.region + ".aliyuncs.com" + "/" + moment().format('yyyyMMDD') + "/" + this.fileName1
            addTtUploadFile({
              type:5,
              videoFilePath:filePath
            }).then(res=>{
              if (res.code=="success") {
                this.loading=false
                this.$message.success('添加成功！')
              }
            })
            this.loading=false
          })
        },
        getFile1(file,fileList){
          this.fileName1 = fileList[0].name
          this.fileList1 = fileList[0].raw
        },
      }
    }
</script>

<style scoped lang="less">

.el-form-item__label{
  text-align: left;
  width: 75px;
}
.ssbox{
  height: 40px;
 .progress{
  display: inline-block;
  // width: calc(100% - 75px);
  width: 300px;
  top:10px
 }
}
</style>

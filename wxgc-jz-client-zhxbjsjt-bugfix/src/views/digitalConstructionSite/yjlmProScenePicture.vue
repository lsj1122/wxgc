<template>
  <div>
    <upload-file file-type="jpg/png" ref="clearData" list-type="picture" accept="image/*" max-size="20"   @change="getFile"/>
    <el-button size="small" type="primary" @click="uploadVideo()" style="margin-top:20px">点击上传图片</el-button>
   <div class="ssbox">
     <label class="el-form-item__label">上传进度</label>
      <el-progress class="progress" :text-inside="true" :stroke-width="18" :percentage="upTotal"></el-progress>
   </div>
  <h2 style="color: red;text-align:left" v-if="imgUrl">已上传过项目布置图</h2>
    <el-image
      v-if="imgUrl"
      :src="imgUrl"
      :preview-src-list="[imgUrl]">
    </el-image>
  </div>
</template>

<script>
    import OSS from "ali-oss";
    import moment from "moment";
    import uploadFile from "@/components/Upload/uploadFile";
    import {addTtUploadFile, selectType} from "@/views/sysproject/api/ttuploadfile";

    export default {
        name: "proScenePicture",
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
            temp: {
              id: null,
              pictureFilePath: null,
              type: 19 //预警螺母布置图
            },
            imgUrl:""
          }
      },
      created() {
        this.initData(); // 读取图片的接口
      },
      methods:{
          initData(){  
            selectType(19).then((res) => {
              if (res.data.length!=0) {
                this.imgUrl = res.data[0].pictureFilePath;
              }
            });
          },
        cancel(){
          this.$refs.clearData.clearData()
          this.resetTemp();
          this.$emit("update:dialogVsb", false);
          this.$emit("handle-getbg");
        },
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
            this.temp.pictureFilePath = "https://" + this.ossConfig.bucket + "." + this.ossConfig.region + ".aliyuncs.com" + "/" + moment().format('yyyyMMDD') + "/" + this.fileName1
            this.temp.createBy = this.$store.getters.name
            let param = this.temp;
            addTtUploadFile(param).then(response=>{
              this.loading=false
              if(response.code=="success"){
                this.$message.success("上传成功!");
                this.cancel()
                this.initData();
              }
              this.$notify({
                title: '操作提示',
                message: response.msg,
                type: response.code,
                duration: 2000
              })
            }).catch(err=>{
              console.log(err)
              this.errorMsg()
            })
            this.loading=false
          })
        },
        getFile(file,fileList){
          this.fileName1 = fileList[0].name
          this.fileList1 = fileList[0].raw
        },
        //错误提示
        errorMsg(msg){
          if(!msg) msg="服务器异常,稍后再试试";
          this.$notify({
            title: '操作提示',
            message: msg,
            type: "error",
            duration: 2000
          })
        },
        //重置临时变量值
        resetTemp(){
          this.temp={
            id: null,
            pictureFilePath: null,
            type: 12
          }
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
  //  float: left;
  width: 300px;
  display: inline-block;
  // width: calc(100% - 75px);
  top:10px
 }
}
.el-image{
    width: 65%;
   
}
</style>

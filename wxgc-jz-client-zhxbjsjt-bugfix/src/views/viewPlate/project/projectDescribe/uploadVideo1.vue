<template>
    <el-dialog v-loading="loading"
               element-loading-text="上传中,请勿刷新页面" :close-on-click-modal="false" title="上传视频" width="500px" :visible="dialogupVideoVisible" :before-close="handleClose">
      <el-form ref="form" label-width="80px">
        <upload-file file-type="mp4" ref="clearData" list-type="video" accept="video/*" max-size="1000"   @change="getFile"/>

        <el-form-item label="上传进度">
               <el-progress style="top:10px;" :text-inside="true" :stroke-width="18" :percentage="upTotal"></el-progress>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitSurvey">上传</el-button>
      </div>
    </el-dialog>
</template>

<script>
    import OSS from 'ali-oss'
    import upcompon from '@/components/upload.vue'
    import uploadFile from '@/components/Upload/uploadFile'
    import {multipartUpload} from '@/utils/oss.js';
    import moment from "moment";
    export default {
        data(){
            return{
                upTotal:0,
                formData:null,
                showup:true,
                fileList:"",
                loading:false,
                ossConfig:{
                // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。 oss-cn-hangzhou.aliyuncs.com
                region: 'oss-cn-hangzhou',
                // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
                accessKeyId: 'LTAI4GKpzVjLoHp8rrrpTLFK',
                accessKeySecret: 'sQHHfIvEr981dLIMUPwlSxJsx7cQcB',
                bucket: 'newzhuochuang'
              },
              tempCheckpoint: '',
              client: '',
              resultPath: null
            }
        },
        props:{
            dialogupVideoVisible:Boolean
        },
        components:{
            upcompon,uploadFile
        },
        watch:{
            dialogupVideoVisible:function (val){
              this.$refs.clearData.clearData()
                if(val){
                    this.upTotal = 0;
                    this.showup = false;
                    this.$nextTick(() => {
                        this.showup = true
                    })
                }
            }
        },
      mounted() {
          this.initOss()
      },
      methods:{
          initOss(){
            this.client = new OSS(this.ossConfig);

          },
        multipartUpload (fileName,file) {
          try {
            let that = this
            // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
            let result = this.client.multipartUpload(moment().format('yyyyMMDD')+"/"+fileName, file, {
              progress: function (p, checkpoint) {
                // console.log(p,checkpoint);
                that.upTotal = parseInt(p*100)
                console.log(this.upTotal)
                // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
                this.tempCheckpoint = checkpoint;
              },
              meta: { year: 2021, people: 'test' },
              mime: 'image/jpg'
            }).then(res=>{
              this.loading=false
              this.resultPath= "https://"+this.ossConfig.bucket+"."+this.ossConfig.region+".aliyuncs.com"+"/"+ moment().format('yyyyMMDD')+"/"+fileName
              this.$emit('uploadSucc',this.resultPath)
              this.$emit('update:dialogupVideoVisible',false)
            })
          } catch(e){
            console.log(e);
          }
        },
          getFile(file,fileList){
            this.fileName = fileList[0].name
            this.fileList = fileList[0].raw
          },
            handleClose(){
                this.$emit('update:dialogupVideoVisible',false)
                this.fileList = ""
                this.$refs.clearData.clearData()
            },
            submitSurvey(){
              this.loading=true
              this.multipartUpload(this.fileName,this.fileList);
            },

        }
    }
</script>

<style lang="less" scoped>

</style>

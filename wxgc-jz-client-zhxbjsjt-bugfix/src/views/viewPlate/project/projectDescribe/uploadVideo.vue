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
    import upcompon from '@/components/upload.vue'
    import uploadFile from '@/components/Upload/uploadFile'
    import {simpleUploads} from "@/views/sysproject/api/ttfile";
    export default {
        data(){
            return{
                upTotal:0,
                formData:null,
                showup:true,
                fileList:[],
                loading:false
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
                if(val){
                    this.upTotal = 0;
                    this.showup = false;
                    this.$nextTick(() => {
                        this.showup = true
                    })
                }
            }
        },
      methods:{
          getFile(file,fileList){
            this.fileList = []
            let fd = new FormData()
            for (let i = 0; i <fileList.length ; i++) {
              fd.append('fileList',fileList[i].raw)
            }
            this.fileList = fd
          },
            handleClose(){
                this.$emit('update:dialogupVideoVisible',false)
                this.fileList = []
                this.$refs.clearData.clearData()
            },
            submitSurvey(){
              this.loading=true
              simpleUploads(this.fileList,(e) => {
                this.upTotal = parseInt((e.loaded/e.total)*100)
              }).then((res) => {
                this.loading=false
                if(res.length>0){
                  this.$emit('uploadSucc',res[0])
                  this.$emit('update:dialogupVideoVisible',false)
                }
                })
            },

        }
    }
</script>

<style lang="less" scoped>

</style>

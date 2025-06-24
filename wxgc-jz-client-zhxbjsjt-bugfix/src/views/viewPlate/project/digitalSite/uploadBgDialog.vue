<template>
  <el-dialog v-loading="loading"
             element-loading-text="上传中,请勿刷新页面" title="上传底图"
  :visible.sync="dialogVsb"
  :modal-append-to-body='false'
  width="500px"
  center
  class="dialog-wrap"
  :before-close="cancel"
  >
    <div>
      <div class="dig-body">
        <el-form ref="form" label-width="80px">
          <el-form-item label="选择图片">
            <upload-file file-type="jpg/png" ref="clearData" list-type="picture" accept="image/*" max-size="20"   @change="getFile"/>

          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="editDsj">确定</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import uploadFile from "@/components/Upload/uploadFile";
import {simpleUploads} from "@/views/sysproject/api/ttfile";
import {addTtUploadFile} from "@/views/sysproject/api/ttuploadfile";
export default {
  props: {
    dialogVsb: Boolean,
  },
  components: {
    uploadFile
  },
  data() {
    return {
      loading:false,
      fileData: null,
      temp: {
        id: null,
        pictureFilePath: null,
        type: 12
      },
      fileList:[]
    };
  },
  methods: {
    getFile(file,fileList){
      this.fileList = []
      let fd = new FormData()
      for (let i = 0; i <fileList.length ; i++) {
        fd.append('fileList',fileList[i].raw)
      }
      this.fileList = fd
    },
    cancel(){
      this.fileList = []
      this.$refs.clearData.clearData()
      this.resetTemp();
      this.$emit("update:dialogVsb", false);
      this.$emit("handle-getbg");
    },
    editDsj() {
      this.loading=true
      if(this.fileList.length==0){
        this.$message.error("请选择图片")
        this.loading=false
        return
      }
      simpleUploads(this.fileList).then(res=>{
        this.temp.pictureFilePath = res[0]
        this.temp.createBy = this.$store.getters.name
        let param = this.temp;
        addTtUploadFile(param).then(response=>{
          this.loading=false
          if(response.code=="success"){
            this.$message.success("上传成功!");
            this.cancel()
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
      })
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
    handleUplod(data) {
      this.fileData = data;
    },
  },
};
</script>

<style lang="less" scoped>
</style>

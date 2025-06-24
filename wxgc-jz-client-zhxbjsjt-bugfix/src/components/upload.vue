<template>
  <div>
    <input type="file" multiple="multiple" class="fileDom" @change="uploadFile($event)" style="display:none" :accept=image />
    <el-button @click="handleClick($event)" type="" size="small">
      {{title}}
      <i class="el-icon-upload el-icon--right"></i>
    </el-button>
    <span class="fileName" v-if="showName">{{ filename }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filename:''
    };
  },
  props: {
    attrId: String,
    image:{ 
      type:String,
      default:'*'
    },
    title:{
      type:String,
      default:'上传'
    },
    showName:{
      type:Boolean,
      default:true
    }
  },
  methods: {
    handleClick(e) {
      let parentNode = null;
      let tag = e.target;
      if(tag.nodeName==='BUTTON'){
        parentNode = tag.parentNode;
      }
      if(tag.nodeName==='SPAN'){
        parentNode = tag.parentNode.parentNode;
      }
      if(tag.nodeName==='I'){
        parentNode = tag.parentNode.parentNode.parentNode;
      }
      parentNode.querySelector(".fileDom").click();
    },
    clearFile(){
      this.filename = ''
    },
    uploadFile(e) {
      let file = e.target.files[0];
      this.filename = file.name;
      let data = new FormData();
      //data.append("attrId", this.attrId);
      data.append("fileType", file.type);
      data.append("file", file);

      this.$emit("uploading", data,file);
    }
  }
};
</script>

<style lang="less" scoped>
.fileName{
  display: inline-block;
  margin-left: 15px;
  color: rgb(189, 189, 189);
}
</style>

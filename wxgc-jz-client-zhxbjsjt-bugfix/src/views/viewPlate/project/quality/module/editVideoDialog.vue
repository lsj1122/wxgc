<template>
    <el-dialog title="编辑视频展示" :visible.sync="DialogVisible" width="1100px" center class="dialog-wrap">
      <div v-loading="loading">
        <div class="dig-body">
          <el-form ref="form" :rules="rules" :model="form" :inline="true" label-width="90px">

            <el-form-item label="选取视频" prop="video">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action=""
                    accept="video/*"
                    :multiple="false"
                    :file-list="fileList"
                    :on-change="handleChange"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取视频文件</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item label="图片/封面" prop="img">
                <el-upload
                    class="upload-demo"
                    ref="upload2"
                    action=""
                    accept="image/*"
                    :multiple="false"
                    :file-list="fileList2"
                    :on-change="handleChange2"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取缩略图</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input placeholder="请输入标题" size="small" v-model="form.title"></el-input>
            </el-form-item>

            <el-form-item label="">
              <el-button size="small" @click="DialogVisible = false">取消</el-button>
              <el-button size="small" type="primary" @click="submits">新增</el-button>
            </el-form-item>

          </el-form>

        </div>
        <el-table
            :data="members"
            style="width: 100%">

            <el-table-column
              prop="title"
              label="标题">
            </el-table-column>

            <el-table-column
              prop="video"
              label="视频地址">
            </el-table-column>

            <el-table-column
              prop="address"
              align="center"
              width="100px"
              label="操作">

              <span slot-scope="scope">
                <el-link type="danger" @click="del(scope.row.id)">删除</el-link>
              </span>

            </el-table-column>

          </el-table>
      </div>
    </el-dialog>
</template>

<script>
    // import {addVideo,delVideo} from "@/api/viewplate/enterPrise/enterprise";
    // import { upload } from "@/api/fileMange";
    import {selectType} from "@/views/sysproject/api/ttuploadfile";
    export default {
        props:['type'],
        data() {
            return {
                DialogVisible: false,
                loading:false,
                fileList:[],
                form:{
                  title:'',
                  type:'',
                  img:'',
                  video:''
                },
                rules:{
                  title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                  ],
                  img: [
                    { required: true, message: '请选择缩略图', trigger: 'blur' },
                  ],
                  // video: [
                  //   { required: true, message: '请选择视频', trigger: 'blur' },
                  // ],
                },
                fileList2:[],
                members:[],
                id: 0
            }
        },
        created () {
          this.query();
        },
        methods: {
            open(){
                this.DialogVisible = true
                this.loading=false
                this.form.title = this.form.img = this.form.video = ''
                this.fileList2 = []
                this.fileList =  []
            },
            query(){
              selectType(this.type).then(res=>{
                  this.members = res.data
                  this.$emit('getVideoData',res)
              })
            },
            handleChange(file, fileList){
              this.form.video = file
              this.fileList = fileList
            },
            handleChange2(file, fileList){
              this.form.img = file
              this.fileList2 = fileList
            },
            submits(){
                this.$refs.form.validate((valid) => {
                  if (valid) {

                      this.upfile(this.fileList[0],function (data){
                          this.form.video = data.filePath
                          this.upfile(this.fileList2[0],function (data){
                              this.form.img = data.filePath
                              this.lastSubmit()
                          })

                      })

                  }
                });


            },
            del(id){
              // delVideo(id).then(res=>{
              //   if (res.code=="success") {
              //     this.query()
              //     this.$message.success('删除成功！')
              //   }
              // })
            },
            lastSubmit(){
              this.form.type = this.type
              // addVideo(this.form).then(res=>{
              //   this.loading = false
              //   if (res.code=="success") {
              //     this.$message.success('添加成功！')
              //     this.query()
              //   }
              // })
            },
            upfile(file,fn){
              this.loading = true
              if(!file){
                fn.call(this,{filePath:''})
                return
              }
              let daraform = new FormData()
              daraform.append("attrId", "1");
              daraform.append("fileType", file.raw.type);
              daraform.append("file", file.raw);
              // upload(daraform).then((res) => {
              //
              //     if (res.code=="success") {
              //       fn.call(this,res.data)
              //     }
              // });
            }
        }
    }
</script>

<style lang="less" scoped>
/deep/.el-upload-list__item-name {

    width: 127px;
}
</style>

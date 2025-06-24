<template>
    <el-dialog title="送检提醒" width="700px" :visible.sync="visible">

        <el-form ref="form" :rules="rules" :model="form" label-width="120px" style="width:600px">
            <el-form-item label="试块送检类型" prop="type">
                <el-input v-model="form.type"></el-input>
            </el-form-item>
            <el-form-item label="试块编号" prop="code">
                <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item label="预送检日期" prop="checkDate">
                <el-date-picker v-model="form.checkDate" style="width:100%" type="date" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
            <el-form-item label="养护时间" prop="careDate">
                <el-input v-model="form.careDate"></el-input>
            </el-form-item>
            <el-form-item label="报告单">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action=""
                    :on-change="handleChange"
                    :on-preview="preFile"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>
        </el-form>

        <div>
            <el-button type="warning" @click="visible = false">取消</el-button>
            <el-button type="primary" @click="submitUpload">提交</el-button>
        </div>

    </el-dialog>
</template>

<script>
    import { saveAs } from 'file-saver'
    // import { editSongj } from "@/api/qualitySafe";
    // import { upload } from '@/api/fileMange'
    export default {
        data() {
            return {
                visible: false,
                form:{
                    checkType:0,
                    type:'',
                    code:'',
                    checkDate:'',
                    careDate:'',
                    report1:null
                },
                fileList: [],
                rules:{
                    type: [
                        { required: true, message: '请输入试块送检类型', trigger: 'blur' },
                    ],
                    code: [
                        { required: true, message: '请输入试块编号', trigger: 'blur' },
                    ],
                    checkDate: [
                        { required: true, message: '请输入预送检日期', trigger: 'blur' },
                    ],
                    careDate: [
                        { required: true, message: '请输入养护时间', trigger: 'blur' },
                    ],
                }
            }
        },
        created () {
        },
        methods: {
            open(row){
                if(row){
                    this.form.id = row.id
                    this.form.type = row.type
                    this.form.code = row.code
                    this.form.checkType = row.checkType
                    this.form.checkDate = row.checkDate
                    this.form.careDate = row.careDate
                    this.form.report1 = row.report1
                    this.fileList = row.filelist.map(item=>{
                        let arr = item.split('/');
                        return{name:arr[arr.length-1],url:item}
                    })
                }else{
                    this.reset()
                }
                this.visible = true
            },
            preFile(file){
                let url = file.url.replace('http://zhuochuangpingtai.oss-cn-beijing.aliyuncs.com', '/down')
                this.$axios.get(url,{responseType:'blob'}).then(res=>{
                    saveAs(res.data,file.name)
                })
            },
            reset(){
                this.form = {checkType:0,type:'',code:'',checkDate:'',careDate:'',report1:null}
                this.fileList = []
            },
            submitUpload() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.submitFn()
                    } else {
                        return false;
                    }
                });
            },
            submitFn(){
                if(this.fileList.length===0 || this.form.report1){
                    this.tijiao()
                    return
                }

                let file = this.fileList[0]
                let data = new FormData();
                data.append("attrId", "1");
                data.append("fileType", file.raw.type);
                data.append("file", file.raw);

                // upload(data).then((res) => {
                //     if (res.code=="success") {
                //         this.form.report1 = res.data.filePath;
                //         this.tijiao()
                //     }
                // });
            },
            tijiao(){
                // editSongj(this.form).then(res=>{
                //     if (res.code=="success") {
                //         this.$message.success('保存成功！')
                //         if(this.form.id) this.visible = false
                //         this.reset()
                //         this.$emit('submitSuccess')
                //     }
                // })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.form.report1 = null;
                this.fileList = []
            },
            handleChange(file, fileList) {

                this.fileList = fileList
            }
        }
    }
</script>

<style lang="less" scoped>

</style>

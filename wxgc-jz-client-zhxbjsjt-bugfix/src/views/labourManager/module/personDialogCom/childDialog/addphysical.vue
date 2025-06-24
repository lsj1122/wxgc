<template>
    <el-dialog
        title="添加体检"
        :visible.sync="dialogVisible"
        width="700px"
        :append-to-body="true"
        :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="110px" style="margin:0 80px">
                <el-form-item label="体检时间">
                    <el-date-picker
                        v-model="form.checkTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="身高">
                    <el-input v-model="form.height"></el-input>
                </el-form-item>
                <el-form-item label="体重">
                    <el-input v-model="form.weight"></el-input>
                </el-form-item>
                <el-form-item label="血型">
                    <el-input v-model="form.bloodType"></el-input>
                </el-form-item>
                <el-form-item label="体检状态">
                   <el-input v-model="form.checkState"></el-input>
                </el-form-item>
                <el-form-item label="附件">
                   <upload-file file-type="*" ref="clearData" max-size="20"  @change="getFile"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="handleClose">取消</el-button>
                </el-form-item>
            </el-form>
    </el-dialog>
</template>

<script>
    import upfileMixin from '../mixins/upfileMixin'
    export default {
        mixins:[upfileMixin],
        data() {
            return {
                dialogVisible: false,
                form:{
                    checkTime:'',
                    height:'',
                    weight:'',
                    bloodType:'',
                    checkState:'',
                    filePath:''
                },
                fileList:[]
            }
        },
        methods: {
            open(row){
                this.dialogVisible = true
                if(row){

                    this.form = Object.assign(this.form,row.row)
                    this.jiexiFileList()
                }else{
                    this.form = {}
                }
            },
            onSubmit(){
                this.uploadFile().then(res=>{
                    this.form.filePath = res
                    this.$emit('addSave',this.form)
                })
            },
            handleClose(){
                this.clearFileList()
                this.dialogVisible = false
            },
            handleChange(){

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>

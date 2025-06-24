<template>
    <el-dialog
        title="添加保险"
        :visible.sync="dialogVisible"
        width="700px"
        :append-to-body="true"
        :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="140px" style="margin:0 80px">
                <el-form-item label="购买日期">
                    <el-date-picker
                        v-model="form.purchaseDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="险种">
                    <el-input v-model="form.insuranceType"></el-input>
                </el-form-item>
                <el-form-item label="城乡居民医疗保险">
                    <el-input v-model="form.medicalInsurance"></el-input>
                </el-form-item>
                <el-form-item label="城乡居民养老保险">
                    <el-input v-model="form.endowmentInsurance"></el-input>
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
                    purchaseDate:'',
                    insuranceType:'',
                    medicalInsurance:'',
                    endowmentInsurance:'',
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

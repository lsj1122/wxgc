<template>
    <el-dialog
        title="添加合同"
        :visible.sync="dialogVisible"
        width="700px"
        :append-to-body="true"
        :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="110px" style="margin:0 80px">
                <el-form-item label="签订状态">
                    <el-input v-model="form.signState"></el-input>
                </el-form-item>
                <el-form-item label="合同编号">
                    <el-input v-model="form.contractNum"></el-input>
                </el-form-item>
                <el-form-item label="合同期限">
                   <el-date-picker
                        v-model="form.contractLimit"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效日期">
                   <el-row :gutter="10">
                        <el-col :span="11">
                            <el-date-picker
                                style="width:100%"
                                v-model="form.validityDate"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="1">-</el-col>
                        <el-col :span="11">
                            <el-date-picker
                                style="width:100%"
                                v-model="form.validityDateEnd"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="工资核定方式">
                   <el-input v-model="form.payWay"></el-input>
                </el-form-item>
                <el-form-item label="工资核定标准">
                    <el-input v-model="form.payFor"></el-input>
                </el-form-item>
                <el-form-item label="附件">
                        <!-- 单文件上传,无multiple -->
                        <upload-file file-type="*" ref="clea" max-size="20"  @change="getFile"/>
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
                    signState:'',
                    contractNum:'',
                    contractLimit:'',
                    validityDate:'',
                    validityDateEnd:'',
                    payWay:'',
                    payFor:'',
                    filePath:''
                },
                fileList:[]
            }
        },
        methods: {
            onSubmit(){
                this.uploadFile().then(res=>{
                    this.form.filePath = res
                    this.$emit('addSave',this.form)
                })
            },
            open(row){
                this.dialogVisible = true
                if(row){

                    this.form = Object.assign(this.form,row.row)
                    this.jiexiFileList()
                }else{
                    this.form = {}
                }
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

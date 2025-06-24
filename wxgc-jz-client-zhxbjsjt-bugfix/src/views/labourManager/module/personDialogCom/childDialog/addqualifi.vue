<template>
    <el-dialog
        title="添加资格证书"
        :visible.sync="dialogVisible"
        width="700px"
        :append-to-body="true"
        :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="110px" style="margin:0 80px">
                <el-form-item label="证书名称">
                    <el-input v-model="form.certificateName"></el-input>
                </el-form-item>
                <el-form-item label="证书编号">
                    <el-input v-model="form.certificateNum"></el-input>
                </el-form-item>
                <el-form-item label="发证日期">
                   <el-date-picker
                        v-model="form.certificateStart"
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
                <el-form-item label="发证机关">
                   <el-input v-model="form.belongUnit"></el-input>
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
                   certificateName:'',
                    certificateNum:'',
                    certificateStart:'',
                    validityDate:'',
                    validityDateEnd:'',
                    belongUnit:'',
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

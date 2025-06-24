<template>
    <el-dialog
        title="添加银行账户"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        width="700px"
        :before-close="handleClose">
        
            <el-form ref="form" :model="form" label-width="110px" style="margin:0 80px">
                <el-form-item label="银行">
                    <el-input v-model="form.bank"></el-input>
                </el-form-item>
                <el-form-item label="开户银行">
                    <el-input v-model="form.depositBank"></el-input>
                </el-form-item>
                <el-form-item label="开户行省份">
                    <el-input v-model="form.depositProvince"></el-input>
                </el-form-item>
                <el-form-item label="联行行号">
                   <el-input v-model="form.correspondentNum"></el-input>
                </el-form-item>
                <el-form-item label="银行卡卡号">
                   <el-input v-model="form.bankNum"></el-input>
                </el-form-item>
                <el-form-item label="状况">
                    <el-input v-model="form.status"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="handleClose">取消</el-button>
                </el-form-item>
            </el-form>

    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                form:{
                    bank:'',
                    depositBank:'',
                    depositProvince:'',
                    correspondentNum:'',
                    bankNum:'',
                    status:'',
                },
                dialogVisible: false
            }
        },
        methods: {
            open(row){
                this.dialogVisible = true
                if(row){
                    this.form = Object.assign(this.form,row.row)
                }else{
                    this.form = {}
                }
            },
            onSubmit(){
                this.$emit('addSave',this.form)
            },
            handleClose(){
                this.dialogVisible = false
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
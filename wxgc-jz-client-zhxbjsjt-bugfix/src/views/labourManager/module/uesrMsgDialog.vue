<template>
    <el-dialog
        title="人员信息卡"
        :visible.sync="dialogVisible"
        width="100%"
        style="overflow:hidden"
        :before-close="handleClose">
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="人员信息" name="人员信息">
                <person-info :row="personData" @success="handleClose"></person-info>
            </el-tab-pane>
            <el-tab-pane label="合同信息" name="合同信息">
                <contract-info  :row="personData"/>
            </el-tab-pane>
            <el-tab-pane label="资格证书" name="资格证书">
                <qualification  :row="personData"/>
            </el-tab-pane>
            <el-tab-pane label="银行账户" name="银行账户">
                <bank-account :row="personData"></bank-account> 
            </el-tab-pane>
            <el-tab-pane label="体检" name="体检">
                <physical :row="personData"></physical>
            </el-tab-pane>
            <el-tab-pane label="保险" name="保险">
                <insurance :row="personData"></insurance>
            </el-tab-pane>
            <el-tab-pane label="安全教育" name="安全教育">
                <education :row="personData"></education>
            </el-tab-pane>
            <el-tab-pane label="工资记录" name="工资记录">
                <payroll-record :row="personData"></payroll-record>
            </el-tab-pane>
            <el-tab-pane label="从业信息" name="从业信息">
                <getjob :row="personData"></getjob>
            </el-tab-pane>
            <el-tab-pane label="评价记录" name="评价记录">
                <evaluate :row="personData"></evaluate>
            </el-tab-pane>
            <!-- <el-tab-pane label="其他" name="其他">
                <else :row="personData"></else>
            </el-tab-pane> -->
        </el-tabs>
    </el-dialog>
</template>

<script>
    import BankAccount from './personDialogCom/bankAccount.vue'
    import ContractInfo from './personDialogCom/contractInfo.vue'
    import Education from './personDialogCom/education.vue'
    import Evaluate from './personDialogCom/evaluate.vue'
    import Getjob from './personDialogCom/getjob.vue'
    import Insurance from './personDialogCom/insurance.vue'
    import PayrollRecord from './personDialogCom/payrollRecord.vue'
    import PersonInfo from './personDialogCom/personInfo.vue'
    import Physical from './personDialogCom/physical.vue'
    import Qualification from './personDialogCom/qualification.vue'
    export default {
        remark:'人员信息卡',
        components:{
            PersonInfo,
            ContractInfo,
            Qualification,
            BankAccount,
            Physical,
            Insurance,
            Education,
            PayrollRecord,
            Getjob,
            Evaluate
        },
        data() {
            return {
                activeName:'人员信息',
                dialogVisible: false,
                personData:{},
                isAdd:false,
            }
        },
        methods: {
            open(row){
                this.dialogVisible = true
                this.$nextTick(()=>{
                    this.personData = row || {}
                })
                //this.isAdd = this.personData.id ? false : true
                
            },
            handleClose(){
                this.dialogVisible = false
                this.$emit("reload")
                this.activeName='人员信息'
                
            },
            handleTabClick(){

            }
        }
    }
</script>

<style lang="less" scoped>
>.el-tabs__content{
    overflow: auto;
}

</style>
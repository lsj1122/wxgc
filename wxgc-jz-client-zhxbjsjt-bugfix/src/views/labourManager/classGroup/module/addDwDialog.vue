<template>
    <el-dialog
        :title="title"
        width="800px"
        :visible.sync="visible"
        :okClose="false"
    >
        <el-form
            ref="ruleForm"
            :model="form"
            :rules="rules"
            label-width="120px"
        >
          <el-tabs type="card" @tab-click="callback" v-model="activeName">
            <el-tab-pane name="1" label="基本信息">
                    <el-form-item label="参建企业名称" prop="buildName">
                        <el-input v-model="form.buildName"/>
                    </el-form-item>
                    <el-form-item label="社会信用代码" prop="creditCode">
                        <el-input v-model="form.creditCode" />
                    </el-form-item>
                    <el-form-item label="企业类别" prop="buildType">
                        <el-select v-model="form.buildType" placeholder="请选择" style="width:80%;">
                            <el-option label="劳务公司" value="劳务公司"></el-option>
                            <el-option label="建设单位" value="建设单位"></el-option>
                            <el-option label="监理单位" value="监理单位"></el-option>
                            <el-option label="施工单位" value="施工单位"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="企业内部分类" prop="businessScope">
                        <el-input v-model="form.innerType" />
                    </el-form-item>
                    <el-form-item label="经营范围" prop="businessScope">
                        <el-input style="width:80%;" v-model="form.businessScope" type="textarea" />
                    </el-form-item>
                    <el-form-item  label="联系人" prop="contractPerson">
                        <el-input v-model="form.contractPerson" />
                    </el-form-item>
                    <el-form-item  label="联系电话" prop="contractPhone">
                        <el-input v-model="form.contractPhone" />
                    </el-form-item>
                    <el-form-item  label="注册地" prop="registeUnit">
                        <el-input v-model="form.name" />
                    </el-form-item>
                    <el-form-item  label="注册日期" prop="registerDate">
                        <el-input v-model="form.registerDate" />
                    </el-form-item>

            </el-tab-pane>
            <el-tab-pane name="2" label="法人信息">
                    <el-form-item  label="法定代表人" prop="legalPerson">
                        <el-input v-model="form.legalPerson" />
                    </el-form-item>
                    <el-form-item  label="法定代表人职务" prop="reginDate">
                        <el-input v-model="form.name" />
                    </el-form-item>
                    <el-form-item  label="法定代表人职称" prop="legalPerTitle">
                        <el-input v-model="form.legalPerTitle" />
                    </el-form-item>
                    <el-form-item  label="法人证件号码" prop="legalPerCertificate">
                        <el-input v-model="form.legalPerCertificate" />
                    </el-form-item>
                    <el-form-item  label="法人联系电话" prop="legalPerPhone">
                        <el-input v-model="form.legalPerPhone" />
                    </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="3" label="银行">
                    <el-form-item  label="银行支行名称" prop="bankName">
                        <el-input v-model="form.bankName" />
                    </el-form-item>
                    <el-form-item  label="银行代码" prop="bankCode">
                        <el-input v-model="form.bankCode" />
                    </el-form-item>
                    <el-form-item  label="银行卡号" prop="bankNum">
                        <el-input v-model="form.bankNum" />
                    </el-form-item>
                    <el-form-item  label="银行联号" prop="bankChain">
                        <el-input v-model="form.bankChain" />
                    </el-form-item>
            </el-tab-pane>
        </el-tabs>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {addTtBuildUnit, updateTtBuildUnit} from "@/views/labourManager/api/ttbuildunit";
    export default {
        data(){
            return{
                title:'新增参建单位',
                activeName:'1',
                visible:false,
                other: '',
                form: {},
                rules: {
                    buildName: [{required: true, message: '请输入参建企业名称', trigger: 'blur' }],
                    creditCode: [{ required: true, message: '请选择企业类别', trigger: 'change' }],
                    buildType: [{ required: true, message: '请输入社会信用代码', trigger: 'change' }],
                },
            }
        },
        methods:{
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.submitFn()
                    } else {
                        this.activeName='1'
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitFn(){
                let reqPromise = null
                if(this.form.id){
                    this.form.updateBy = this.$store.getters.name
                    reqPromise = updateTtBuildUnit(this.form)
                }else{
                    this.form.createBy = this.$store.getters.name
                    reqPromise = addTtBuildUnit(this.form)
                }
                reqPromise.then(res=>{
                    if (res.code=="success") {
                        this.$notify({
                          title: '操作提示',
                          message: res.msg,
                          type: res.code,
                          duration: 2000
                        })
                        this.$emit('success')
                    }else{
                      this.errorMsg()
                    }

                    this.visible = false
                })
            },
            resetForm() {
                this.$refs.ruleForm.resetFields();
            },
            open(row){
                this.form = {...row} || {}
                if(this.form.id){
                    this.title = '编辑参建单位'
                }else{
                    this.title = '新增参建单位'
                }
                this.visible = true
            },
            callback(){

            }

        }
    }
</script>

<style lang="scss" scoped>
.el-input{
    width:80%;
}
</style>

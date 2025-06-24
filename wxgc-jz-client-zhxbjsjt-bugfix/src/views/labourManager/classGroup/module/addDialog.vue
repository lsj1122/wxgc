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
            <el-form-item label="班组长" prop="teamLeader">
                <el-input v-model="form.teamLeader"/>
            </el-form-item>
            <el-form-item label="班组长身份证号" prop="leaderCard">
                <el-input v-model="form.leaderCard"/>
            </el-form-item>
            <el-form-item label="班组类型" prop="teamType">
                <el-radio-group v-model="form.teamType">
                    <el-radio label="0">
                    施工班组
                    </el-radio>
                    <el-radio label="1">
                    管理部门
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="所属单位" prop="buildId">
                <el-input :value="currentBuild.buildName"/>
            </el-form-item>
<!--            <el-form-item label="所属队伍" prop="ranksId">-->
<!--                <j-dict-select-tag v-model="form.ranksId" placeholder="请选择企业类别" dictCode="wx_pro_tem"/>-->
<!--            </el-form-item>-->
            <el-form-item label="班组名称" prop="teamName">
                <el-input v-model="form.teamName"/>
            </el-form-item>
            <el-form-item label="手机号" prop="telephone">
                <el-input v-model="form.telephone"/>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { addTeam,editTeam } from '@/api/personManage.js'
    import {addTtTeam, updateTtTeam} from "@/views/labourManager/api/ttteam";
    export default {
        props:['currentBuild'],
        data(){
            return{
                visible:false,
                title:'新增班组',
                other: '',
                form: {},
                rules: {
                    teamType: [{ required: true, message: '请选择班组类型', trigger: 'change' }],
                    teamName: [{ required: true, message: '请输入班组名称', trigger: 'change' }],
                },
            }
        },
        methods:{
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.submitFn()
                    } else {
                        console.log('error submit!!');
                    return false;
                    }
                });
            },
            submitFn(){
                let reqPromise = null
                this.form.buildId = this.currentBuild.id
                if(this.form.id){
                    this.form.updateBy = this.$store.getters.name
                    reqPromise = updateTtTeam(this.form)
                }else{
                    this.form.createBy = this.$store.getters.name
                    reqPromise = addTtTeam(this.form)
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
                    this.title = '编辑班组'
                }else{
                    this.title = '新增班组'
                }
                this.visible = true
            }

        }
    }
</script>

<style lang="scss" scoped>
.el-input{
    width:80%;
}
</style>

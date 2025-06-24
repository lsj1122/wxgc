<template>
    <div>
        <infotable title="资格证书" :total="total" :titleData="ruleForm" @onEdit="handleEdit" :isAdd="true" @handleAdd="onAdd" :data="data" :columns="columns" :pageOption="pageOption"/>
        <addqualifi ref="cdia" @addSave="handleAddSave"></addqualifi>
    </div>
</template>

<script>
import { getPagePQualificationCertificate,addPQualificationCertificate,updatePQualificationCertificate } from '../../api/detail/pqualificationcertificate'
    import Addqualifi from './childDialog/addqualifi.vue'
    import Infotable from './components/infotable.vue'

    export default {
        props:['row'],
        components:{
            Infotable,
            Addqualifi
        },
        data() {
            return {
                data:[],
                columns:[
                    {prop:'certificateName',label:'证书名称'},
                    {prop:'certificateNum',label:'证书编号',width:200},
                    {prop:'certificateStart',label:'发证日期'},
                    {prop:'validityDate',label:'有效开始日期'},
                    {prop:'validityDateEnd',label:'有效结束日期'},
                    {prop:'belongUnit',label:'发证机关'},
                    {prop:'fileName',label:'附件'},
                    {prop:'action',label:'操作',render:'action'},
                ],
                pageOptions:{
                    currentPage:1,
                    pageSize:10,
                 
                },
                total:1,
                ruleForm:{}
            }
        },
        watch: {
          row:function(val){
              if(val.row){
                  this.ruleForm = {...val.row}
                  this.getPerson()
              }else{
                  this.ruleForm = {}
                  this.data = []
              }
          }  
        },
        methods: {
            getPerson(){
                let params = Object.assign({personId:this.ruleForm.id},this.pageOptions)
                getPagePQualificationCertificate(params).then(res=>{
                    if(res.code === 'success'){
                        this.data = res.data.records;
                        this.total = res.data.total
                        this.$refs.cdia.handleClose()
                    }
                })
            },
            handleAddSave(data){
                if(data.id){
                    updatePQualificationCertificate(data).then(res=>{
                        if(res.code === 'success'){
                            this.$message.success('编辑成功。')
                            this.getPerson()
                        }
                    })
                    return
                }
                data.personId = this.ruleForm.id
                addPQualificationCertificate(data).then(res=>{
                    if(res.code === 'success'){
                        this.$message.success('添加成功。')
                        this.getPerson()
                    }
                })
            },
            onAdd(){
                this.$refs.cdia.open()
            },
            handleEdit(row){
                this.$refs.cdia.open(row)
            }
        } 
    }
</script>

<style lang="scss" scoped>

</style>
<template>
    <div>
        <infotable title="合同信息" :total="total" :titleData="ruleForm" @handleAdd="onAdd" @onEdit="handleEdit" :isAdd="true" :data="data" :columns="columns" :pageOption="pageOption"/>
        <addcontract ref="cdia" @addSave="handleAddSave"/>
    </div>
</template>
 
<script>
    import { getPagePContractInfo,addPContractInfo,updatePContractInfo } from '../../api/detail/pcontractinfo'
    import Addcontract from './childDialog/addcontract.vue' 
    import Infotable from './components/infotable.vue'

    export default {
        props:['row'],
        components:{
            Infotable,
            Addcontract
        },
        data() {
            return {
                data:[],
                columns:[
                    {prop:'signState',label:'签订状态'},
                    {prop:'contractNum',label:'合同编号',width:200},
                    {prop:'contractLimit',label:'合同期限'},
                    {prop:'validityDate',label:'有效开始日期'},
                    {prop:'validityDateEnd',label:'有效结束日期'},
                    {prop:'payWay',label:'工资核定方式'},
                    {prop:'payFor',label:'工资核定标准'},
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
                getPagePContractInfo(params).then(res=>{
                    if(res.code === 'success'){
                        this.data = res.data.records;
                        this.total = res.data.total
                        this.$refs.cdia.handleClose()
                    }
                })
            }, 
            handleAddSave(data){
                if(data.id){
                    updatePContractInfo(data).then(res=>{
                        if(res.code === 'success'){
                            this.$message.success('编辑成功。')
                            this.getPerson()
                        }
                    })
                    return
                }
                data.personId = this.ruleForm.id
                addPContractInfo(data).then(res=>{
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
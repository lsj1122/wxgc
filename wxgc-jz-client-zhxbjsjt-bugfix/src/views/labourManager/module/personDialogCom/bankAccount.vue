<template>
    <div>
        <infotable title="银行账户" :titleData="ruleForm" :total="total" @onEdit="handleEdit" @handleAdd="onAdd" :isAdd="true" :data="data" :columns="columns" :pageOption="pageOption"/>
        <addbank ref="cdia" @addSave="handleAddSave"></addbank>
    </div>
</template>

<script>
    import { getPagePBankAccount,addPBankAccount,updatePBankAccount } from '../../api/detail/pbankaccount'
    import Addbank from './childDialog/addbank.vue'
    import Infotable from './components/infotable.vue' 

    export default {
        props:['row'],
        components:{
            Infotable,
                Addbank
        },
        data() {
            return {
                data:[],
                columns:[
                    {prop:'bank',label:'银行'},
                    {prop:'depositBank',label:'开户银行',width:200},
                    {prop:'depositProvince',label:'开户省份'},
                    {prop:'correspondentNum',label:'联行行号'},
                    {prop:'bankNum',label:'银行卡卡号'},
                    {prop:'status',label:'状况'},
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
                getPagePBankAccount(params).then(res=>{
                    if(res.code === 'success'){
                        this.data = res.data.records;
                        this.total = res.data.total
                        this.$refs.cdia.handleClose()
                    }
                })
            }, 
            handleAddSave(data){
                if(data.id){
                    updatePBankAccount(data).then(res=>{
                        if(res.code === 'success'){
                            this.$message.success('编辑成功。')
                            this.getPerson()
                        }
                    })
                    return
                }
                data.personId = this.ruleForm.id
                addPBankAccount(data).then(res=>{
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
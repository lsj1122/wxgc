<template>
    <div>
        <infotable title="保险" :total="total" :titleData="ruleForm" @onEdit="handleEdit" @handleAdd="onAdd" :isAdd="true" :data="data" :columns="columns" :pageOption="pageOption"/>
        <addinsurance ref="cdia" @addSave="handleAddSave"></addinsurance>
    </div>
</template>

<script>
import { getPagePPersonInsurance,addPPersonInsurance,updatePPersonInsurance } from '../../api/detail/ppersoninsurance'
import Addinsurance from './childDialog/addinsurance.vue' 
    import Infotable from './components/infotable.vue'

    export default {
        props:['row'],
        components:{
            Infotable,
                Addinsurance
        },
        data() { 
            return {
                data:[],
                columns:[
                    {prop:'purchaseDate',label:'购买日期'},
                    {prop:'insuranceType',label:'险种',width:200},
                    {prop:'medicalInsurance',label:'城乡居民医疗保险'},
                    {prop:'endowmentInsurance',label:'城乡居民养老保险'},
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
                getPagePPersonInsurance(params).then(res=>{
                    if(res.code === 'success'){
                        this.data = res.data.records;
                        this.total = res.data.total
                        this.$refs.cdia.handleClose()
                    }
                })
            },
            handleAddSave(data){
                if(data.id){
                    updatePPersonInsurance(data).then(res=>{
                        if(res.code === 'success'){
                            this.$message.success('编辑成功。')
                            this.getPerson()
                        }
                    })
                    return
                }
                data.personId = this.ruleForm.id
                addPPersonInsurance(data).then(res=>{
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
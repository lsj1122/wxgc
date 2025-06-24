<template>
    <div>
        <infotable title="体检" :total="total" :titleData="ruleForm" @onEdit="handleEdit" @handleAdd="onAdd" :isAdd="true" :data="data" :columns="columns" :pageOption="pageOption"/>
        <addphysical ref="cdia" @addSave="handleAddSave"></addphysical>
    </div>
</template>

<script>
import { getPagePPhysicalCheck,addPPhysicalCheck,updatePPhysicalCheck } from '../../api/detail/pphysicalcheck'
    import Addphysical from './childDialog/addphysical.vue'
    import Infotable from './components/infotable.vue'

    export default {
        props:['row'],
        components:{
            Infotable,
                Addphysical
        },
        data() {
            return {
                data:[],
                columns:[
                    {prop:'checkTime',label:'体检时间'},
                    {prop:'height',label:'身高',width:200},
                    {prop:'weight',label:'体重'},
                    {prop:'bloodType',label:'血型'},
                    {prop:'checkState',label:'体检状态'},
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
                getPagePPhysicalCheck(params).then(res=>{
                    if(res.code === 'success'){
                        this.data = res.data.records;
                        this.total = res.data.total
                        this.$refs.cdia.handleClose()
                    }
                })
            },
            handleAddSave(data){
                if(data.id){
                    updatePPhysicalCheck(data).then(res=>{
                        if(res.code === 'success'){
                            this.$message.success('编辑成功。')
                            this.getPerson()
                        }
                    })
                    return
                }
                data.personId = this.ruleForm.id
                addPPhysicalCheck(data).then(res=>{
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
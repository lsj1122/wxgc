<template>
    <div>
        <infotable title="评价记录" :total="total" :titleData="ruleForm" :isAdd="false" :data="data" :columns="columns" :pageOption="pageOption"/>
    </div>
</template>

<script>
import { getPagePEvaluateRecord } from '../../api/detail/pevaluaterecord'
    import Infotable from './components/infotable.vue'

    export default {
        props:['row'],
        components:{
            Infotable
        },
        data() {
            return {
                data:[{name:'test',idcard:'342224195501250156',age:'23',class:'班组1',type:'木工',status:'在岗',indate:'2020-02-25',outdate:'2020-05-25'}],
                columns:[
                    {prop:'happenDate',label:'发生时间'},
                    {prop:'happenType',label:'奖惩类型',width:200},
                    {prop:'happenProject',label:'发生项目'},
                    {prop:'recordType',label:'奖惩记录分类'},
                    {prop:'description',label:'奖惩记录描述'},
                    {prop:'eventValue',label:'事件分值'},
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
                getPagePEvaluateRecord(params).then(res=>{
                    if(res.code === 'success'){
                        this.data = res.data.records;
                        this.total = res.data.total
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
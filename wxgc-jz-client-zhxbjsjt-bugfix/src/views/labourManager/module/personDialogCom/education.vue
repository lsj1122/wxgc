<template>
    <div>
        <infotable title="安全教育" :total="total" :titleData="ruleForm" :isAdd="false" :data="data" :columns="columns" :pageOption="pageOption"/>
    </div>
</template>

<script>
    import { getPagePSafetyEducation } from '../../api/detail/psafetyeducation'
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
                    {prop:'educationType',label:'教育类型'},
                    {prop:'trainDate',label:'培训日期',width:200},
                    {prop:'trainHour',label:'培训课时'},
                    {prop:'trainScore',label:'分数'},
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
                getPagePSafetyEducation(params).then(res=>{
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
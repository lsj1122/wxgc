<template>
    <div class="secur-clar">
        <CardContainer  :resp="{span: 6}" :title="'培训信息列表'" style="margin-right:15px">
            <list :listData="lists" @onclick="handleClick" @onAdd="addItem" @onDel="delItem"></list>
        </CardContainer>
        <CardContainer  :resp="{span: 17}" :title="'培训信息详情'">
            <detial :detdata="currentItem" @onSave="query"></detial>
        </CardContainer>
    </div>
</template>

<script>
    import CardContainer from "@/components/CardContainer";
    import List from './module/List.vue';
    import Detial from './module/Detial.vue';
    import { selectTtSafetyDisclosureByPro,addTtSafetyDisclosure,deleteTtSafetyDisclosure } from './api/ttsafetydisclosure'

    export default {
        components:{
            CardContainer,
            List,
            Detial,
        },
        data(){
            return{
                lists:[],
                currentItem:{}
            }
        },
        created () {
          this.query()
        },
        methods:{
            handleClick(item){
                this.currentItem = {...item}
            },
            query(){
              console.log(31,'query')
              selectTtSafetyDisclosureByPro().then(res=>{
                if(res.code=="success"){
                        this.lists = res.data
                    }
                })
            },
            addItem(val){
              addTtSafetyDisclosure({trainName:val}).then(res=>{
                if(res.code=="success"){
                        this.query()
                        this.$message.success('添加成功')
                    }
                })
            },
            delItem(id){
              deleteTtSafetyDisclosure(id).then(res=>{
                if(res.code=="success")this.$message.success('删除成功！')
                    this.query()
                })
            }
        }
    }
</script>

<style lang="less" scoped>

</style>

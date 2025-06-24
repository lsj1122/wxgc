<template>
    <div>
        <div class="info-table-head">
            <h3>{{ title }} <span> <i>姓名：</i> {{ titleData.name }}  <i>年龄：</i> {{ titleData.age }}   <i>身份证：</i> {{ titleData.idCard }}</span></h3>
            <el-button type="primary" size="small" @click="add" v-if="isAdd">添加</el-button>
        </div>
        <wx-table :columns="columns" :total="total" :pageOption="pageOption" :tableData="data" @onCurrentChange="handleChangePage">
            <template slot="action" slot-scope="row">
                <el-link type="primary" @click="edit(row)">编辑</el-link>
            </template>
        </wx-table>
    </div>
</template>

<script>
    export default {
        props:['data','columns','total','pageOption','title','isAdd','titleData'],
        data() {
            return {
                personInfo:{}
            } 
        },
        methods: {
            edit(row){
                this.$emit('onEdit',row)
            },
            handleChangePage(page){

            },
            add(){
                this.$emit('handleAdd')
            }
        }
    }
</script>

<style lang="scss" scoped>
.info-table-head{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    h3{
        font-weight: 400;
        color: #555;
        border-left: 3px solid rgb(45, 160, 255);
        padding-left: 10px;
        margin: 0;
        height: 20px;
        span{
            color: rgb(90, 90, 90);
            margin-left: 20px; 
            i{
                margin-left: 20px;
                color: rgb(151, 151, 151);
                font-style: normal;
            }
        }
    }
}
</style>
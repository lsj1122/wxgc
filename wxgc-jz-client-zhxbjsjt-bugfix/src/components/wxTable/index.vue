<template>
    <div style="flex:1">
        <el-table
            :data="tableData"
            :stripe="show"
            v-on="$listeners"
            v-bind="$attrs"
            style="width: 100%">
                <el-table-column
                    type="selection"
                    v-if="selection"
                    width="55">
                </el-table-column>

                <el-table-column
                    type="index"
                    v-if="index"
                    width="55">
                </el-table-column>

                <el-table-column type="expand" v-if="expand"></el-table-column>

                <el-table-column v-for="(item,index) in columns" :key="item.id||index" v-bind="item">
                    <template slot-scope="scope">
                        <slot :name="item.render" :row="scope.row" v-if="item.render"></slot>
                        <span v-else>{{scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
        </el-table>
        <el-pagination class="elPage"
        v-if="show"
                background
                layout="prev, pager, next"
                :current-page="pageOptions.pageIndex"
                :page-size="pageOptions.pageSize"
                @current-change="handleCurrentChange"
                :total="total">
        </el-pagination>
        <!-- <el-pagination
            class="elPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageOptions.currentPage || 1"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageOptions.pagesize || 10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageOptions.total || 10">
        </el-pagination> -->
    </div>
</template>

<script>
    export default {
        props:{
            show:{
                type:Boolean,
                default:true
            },
            selection:{
                type:Boolean,
                default:false
            },
            index:{
                type:Boolean,
                default:false
            },
            expand:{
                type:Boolean,
                default:false
            },
            columns:{
                type:Array,
                default:[]
            },
            tableData:{
                type:Array,
                default:[]
            },
            pageOptions:{
                type:Object,
                default:{
                    pageIndex:1,
                    pageSize:10,
                }
            },
            total:0
        },
        data(){
            return{
                pageObject:{}
            }
        },
        methods:{
            handleSizeChange(v){
                this.$emit('onSizeChange',v)
            },
            handleCurrentChange(p){
                this.$emit('onCurrentChange',p)
            },
        }
    }
</script>

<style lang="scss" scoped>
.elPage{
    margin-top: 16px;
}
</style>

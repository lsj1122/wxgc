<template>
    <el-dialog
        :title="`温度分析详情`"
        :visible.sync="dialogVb"
        :modal-append-to-body='false'
        :before-close="handleClose"

        width="700">
        <div class="work-type-dialog">
            <el-table
                height="500"
                ref="tbb"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="createTime"
                    label="日期">
                </el-table-column>
                <el-table-column
                    prop="win_speed"
                    label="风力">
                </el-table-column>
                <el-table-column
                    prop="temDay"
                    label="高温">
                </el-table-column>
                <el-table-column
                    prop="temNight"
                    label="低温">
                </el-table-column>
                <el-table-column
                    prop="wea"
                    label="天气">
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props:{
            dialogVb:Boolean,
            tableData:Array
        },
        created(){

        },
        data(){
            return {

            }
        },
        methods:{
            handleClose(){
                this.$emit('update:dialogVb',false)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>

<template>
    <el-dialog
        :title="`空气分析分析详情`"
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
                    prop="name"
                    label="空气质量">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="天数">
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

<template>
    <el-dialog
        :title="`(${type})分析详情`"
        :visible.sync="dialogVb"
        :before-close="handleClose"
        :modal-append-to-body='false'

        width="700">
        <div class="work-type-dialog">
            <el-table
                height="500"
                ref="tbb"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="maxTime"
                    label="月份">
                </el-table-column>
<!--                <el-table-column-->
<!--                    prop="machineName"-->
<!--                    label="设备名称">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                    prop="machineNumber"-->
<!--                    label="设备编号">-->
<!--                </el-table-column>-->
<!--              <el-table-column-->
<!--                    prop="fitArea"-->
<!--                    label="安装区域">-->
<!--                </el-table-column>-->
                <el-table-column
                    prop="totalData"
                    label="用量">
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props:{
            dialogVb:Boolean,
            type:String,
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

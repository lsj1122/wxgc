<template>
    <el-dialog
        :title="`工种分析详情(${type.name})`"
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
                    prop="name"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="jobs"
                    label="工种">
                </el-table-column>
                <el-table-column
                    prop="idCard"
                    label="身份证号">
                </el-table-column>
                <el-table-column
                    prop="telephone"
                    label="手机号">
                </el-table-column>
            </el-table>
          <el-pagination class="el-pagination"
                         v-show="total>0"
                         background
                         layout="prev, pager, next"
                         :current-page.sync="listQuery.pageIndex" :page-size.sync="listQuery.pageSize"
                         @current-change="query"
                         :total="total">
          </el-pagination>
        </div>
    </el-dialog>
</template>

<script>
import {getPageTtPerson} from "@/views/labourManager/api/ttperson";
import Pagination from "@/components/Pagination/index";
    export default {
        components: { Pagination },
        props:{
            dialogVb:Boolean,
            type:Object
        },
        created(){
            this.query();
        },
        data(){
            return {
                tableData:[],
                listQuery: { //搜索条件
                  pageIndex: 1,
                  pageSize: 10,
                  jobs: null
                },
              total: 1
            }
        },
        mounted(){

        },
        watch:{
            type:function (){
                this.query()
            }
        },
        methods:{

            query(){
              this.listQuery.jobs = this.type.name
              getPageTtPerson(this.listQuery).then(res => {
                    if (res.code=="success") {
                        res.data.records.forEach(function(item) {
                            item.teamLeader === 0
                            ? (item.teamLeader = false)
                            : (item.teamLeader = true);
                        });
                        this.tableData = res.data.records;
                        this.total = res.data.total;

                    }
                })
            },
            handleClose(){
                this.$emit('update:dialogVb',false)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>

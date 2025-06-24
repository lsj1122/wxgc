<template>
    <div class="app-container">
        <!--搜索框-->
        <div class="filter-container">
             <el-input v-model="listQuery.secret" placeholder="密码值" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
             <el-input v-model="listQuery.clientName" placeholder="客户端名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
             <el-date-picker
                     v-model="temp.createTime"
                     align="right"
                     type="date"
                     value-format="yyyy-MM-dd"
                     placeholder="选择创建时间"
             >
             </el-date-picker>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                {{ $t('table.search') }}
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
                {{ $t('table.add') }}
            </el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                {{ $t('table.export') }}
            </el-button>
        </div>
        <!--显示列表-->
        <el-table
                :data="tableData"
                v-loading="dataLoading"
                row-key="id"
                stripe
                fit
                highlight-current-row
        >

           <el-table-column
                   fixed
                   prop="secret"
                   label="密匙"
                   align="center"
           >
           </el-table-column>

           <el-table-column
                   fixed
                   prop="clientName"
                   label="客户端名称"
                   align="center"
           >
           </el-table-column>

          <el-table-column
              prop="status"
              label="状态"
              align="center"
            >
              <template slot-scope="scope">
                <span  v-if="scope.row.status==0"><svg-icon icon-class="success" /> 正常</span>
                <span  v-if="scope.row.status==1"><svg-icon icon-class="disable" /> 禁用</span>
              </template>
            </el-table-column>

           <el-table-column
                   fixed
                   prop="createTime"
                   label="创建时间"
                   align="center"
           >
           </el-table-column>

           <el-table-column
                   fixed
                   prop="sort"
                   label="排序值"
                   align="center"
           >
           </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
            >
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="handleEdit(scope)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination class="el-pagination"
                       v-show="total>0"
                       background
                       layout="prev, pager, next"
                       :current-page.sync="listQuery.pageIndex" :page-size.sync="listQuery.pageSize"
                       @current-change="loadPageData"
                       :total="total">
        </el-pagination>



        <!--增加或修改弹出层-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%" :close-on-click-modal="false">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="margin-left:5px;">

                <el-row>
                    <el-col :span="24"><div class="grid-content bg-purple">

                        <el-form-item label="客户端名称" prop="clientName">
                            <el-input v-model="temp.clientName" placeholder="客户端名称" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-switch
                              v-model="temp.status"
                              :active-value="0"
                              :inactive-value="1"
                              active-text="正常"
                              inactive-text="禁用"
                              active-color="#13ce66"
                              inactive-color="#ff4949">
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="排序值" prop="sort">
                            <el-input type="number" v-model="temp.sort" placeholder="排序值" />
                        </el-form-item>

                    </div></el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    {{ $t('table.cancel') }}
                </el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                    {{ $t('table.confirm') }}
                </el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>

    import {getPageSysSecret,getAllSysSecret,addSysSecret,updateSysSecret,deleteSysSecret}  from './api/syssecret.js'
    import {deepClone, parseTime} from '@/utils';
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    export default {
        name: 'SysSecret',
        components: { Pagination },
        data() {
            return {
                tableData: [], //当前分页数据
                allTableData:[], //所有表格数据，下载时候回加载
                //表头（主要是下载excel时候使用）
                columns:[
                           {label:'秘钥主键',field:'id'},
                           {label:'密码值',field:'secret'},
                           {label:'客户端名称',field:'clientName'},
                           {label:'状态(0 正常，1 禁用)',field:'status'},
                           {label:'创建时间',field:'createTime'},
                           {label:'排序值',field:'sort'},
                ],
                dataLoading:false,
                total: 0,
                listQuery: { //搜索条件
                    pageIndex: 1,
                    pageSize: 10,
                id: undefined,
                secret: undefined,
                clientName: undefined,
                createTime: undefined,
                sort: undefined,
                },
                downloadLoading: false,
                textMap: {
                    update: '编辑',
                    create: '新增'
                },
                dialogFormVisible: false,
                dialogStatus: '',
                temp: {
                    "id": null,
                    "secret": null,
                    "clientName": null,
                    "status": null,
                    "createTime": null,
                    "sort": null,
                },
                rules: { //校验功能
                    clientName: [
                      { required:  true , message: '必填客户端名称', trigger: ['blur', 'change'] },
                    ],
                    status: [
                      { required:  true , message: '必填状态(0 正常，1 禁用)', trigger: ['blur', 'change'] },
                    ],
                    sort: [
                      { required:  false , message: '必填排序值', trigger: ['blur', 'change'] },
                    ],
                },
                noRotate:false,
                checkAll: false,
                isIndeterminate: false,
            }
        },
        created() {
            //加载分页数据
            this.loadPageData();
        },
        mounted() {
        },
        methods: {
            //删除单行
            deleteRow(index, rows) {
                this.$confirm('你确定要删除?', '系统警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let res= await deleteSysSecret(rows[index].id)
                if(res.code=="success"){
                    rows.splice(index, 1);
                }
                this.$message({
                    type: 'success',
                    message: res.msg
                })
            }).catch(err => {
                    this.errorMsg()
                })
            },
            //分页查询
            loadPageData(){
                this.dataLoading=true;
                getPageSysSecret(this.listQuery).then(res=>{
                    if(res.code=="success"){
                    this.tableData=res.data.records;
                    this.total=res.data.total;
                }
                this.dataLoading=false;
            }).catch(err=>{
                    console.log(JSON.stringify(err))
                    this.dataLoading=false;
            })
            },
            //搜索
            handleFilter() {
                this.listQuery.pageIndex = 1
                this.loadPageData()
            },
            //下载Excel表格
            handleDownload() {
                this.downloadLoading = true
                let self=this;
                getAllSysSecret().then(res=>{
                    if(res.code=="success"){
                    this.allTableData=res.data;
                    import('@/vendor/Export2Excel').then(excel => {
                        const tHeader = []
                        const filterVal = []
                        for(let column of self.columns){
                        tHeader.push(column.label)
                        filterVal.push(column.field)
                    }
                    const data = this.formatJson(filterVal)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '客户端密匙列表'
                    })
                    this.downloadLoading = false
                })
                }else{
                    this.errorMsg("下载数据失败")
                }
            }).catch(err=>{
                    this.errorMsg()
                })
            },
            formatJson(filterVal) {
                return this.allTableData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                    return parseTime(v[j])
                }else if (j === 'timestamp') {
                    return parseTime(v[j])
                }else {
                    return v[j]
                }
            }))
            },
            //重置临时变量值
            resetTemp(){
                let that=this;
                this.temp={
                      "id": null,
                      "secret": null,
                      "clientName": null,
                      "status": null,
                      "createTime": null,
                      "sort": null,
                }
            },
            //增加窗口弹出之前恢复默认值
            handleCreate() {
                this.resetTemp()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            //增加
            createData(){
               this.$refs['dataForm'].validate((valid) => {
                    console.log(valid)
          if (valid) {
            console.log(this.temp)
            let param=JSON.parse( JSON.stringify(this.temp));
            param.status=param.status?1:0;
            addSysSecret(param).then(response=>{
              if(response.code=="success"){
                this.dialogFormVisible = false
                this.loadPageData()
              }
              this.$notify({
                title: '操作提示',
                message: response.msg,
                type: response.code,
                duration: 2000
              })
            }).catch(err=>{
              console.log(err)
              this.errorMsg()
            })
          }
        })
            },
            //修改
            updateData(){
               this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let param=JSON.parse( JSON.stringify(this.temp));
            param.status=param.status?1:0;
            updateSysSecret(param).then(response=>{
              if(response.code=="success"){
                this.dialogFormVisible = false
                this.loadPageData()
              }
              this.$notify({
                title: '操作提示',
                message: response.msg,
                type: response.code,
                duration: 2000
              })
            })
          }
        })
            },
            //弹出修改窗口之前，填充值
            handleEdit(scope) {
                this.dialogType = 'edit'
                this.dialogStatus = 'update'
                this.temp = deepClone(scope.row)
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            close() {
                this.imagecropperShow = false
            },
            //错误提示
            errorMsg(msg){
                if(!msg) msg="服务器异常,稍后再试试";
                this.$notify({
                    title: '操作提示',
                    message: msg,
                    type: "error",
                    duration: 2000
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .el-pagination {
        margin-top: 20px;
    }
    .filter-container {
        padding-bottom: 10px;
    .filter-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
    }
    }
    .el-icon-male{
        color: #42b983;
        font-size: 20px;
        font-weight: bold;
    }
    .el-icon-female{
        color: palevioletred;
        font-size: 20px;
        font-weight: bold;
    }
    .el-icon-question{
        color: rebeccapurple;
        font-size: 20px;
        font-weight: bold;
    }
</style>

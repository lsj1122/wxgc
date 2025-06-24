<template>
    <div class="app-container">
        <!--搜索框-->
        <div class="filter-container">
             <el-input v-model="listQuery.type" placeholder="字典分类" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
             <el-input v-model="listQuery.dictionaryKey" placeholder="字典的键" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
             <el-input v-model="listQuery.dictionaryValue" placeholder="字典的值" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
             <el-input v-model="listQuery.sort" placeholder="排序" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
             <el-input v-model="listQuery.icon" placeholder="图标样式" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
             <el-input v-model="listQuery.description" placeholder="值描述" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

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
                   prop="type"
                   label="字典分类"
                   align="center"
           >
           </el-table-column>

           <el-table-column
                   fixed
                   prop="dictionaryKey"
                   label="字典的键"
                   align="center"
           >
           </el-table-column>

           <el-table-column
                   fixed
                   prop="dictionaryValue"
                   label="字典的值"
                   align="center"
           >
           </el-table-column>

           <el-table-column
                   fixed
                   prop="sort"
                   label="排序"
                   align="center"
           >
           </el-table-column>

           <el-table-column
                   fixed
                   prop="icon"
                   label="图标样式"
                   align="center"
           >
           </el-table-column>

           <el-table-column
                   fixed
                   prop="description"
                   label="值描述"
                   align="center"
           >
           </el-table-column>

            <!--图片显示 示例如下 -->
            <!-- <el-table-column
               prop="avatar"
               label="头像"
               align="center"
             >
               <template slot-scope="scope">
                 <el-avatar :size="40" :src="scope.row.avatar"  @error="errorHandler"  >
                   <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                 </el-avatar>
               </template>
             </el-table-column>-->

            <!--字段判断 示例如下 -->
            <!--<el-table-column
              prop="sex"
              label="性别"
              align="center"
            >
              <template slot-scope="scope">
                <span  v-if="scope.row.sex==''"><i class="el-icon-question"></i>未知</span>
                <span  v-if="scope.row.sex==1"><i class="el-icon-male" ></i>男</span>
                <span  v-if="scope.row.sex==2"><i class="el-icon-female"></i>女</span>
              </template>
            </el-table-column>-->

            <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
                    width="160"
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

                        <el-form-item label="字典分类" prop="type">
                            <el-input v-model="temp.type" placeholder="字典分类" />
                        </el-form-item>
                        <el-form-item label="字典的键" prop="dictionaryKey">
                            <el-input v-model="temp.dictionaryKey" placeholder="字典的键" />
                        </el-form-item>
                        <el-form-item label="字典的值" prop="dictionaryValue">
                            <el-input v-model="temp.dictionaryValue" placeholder="字典的值" />
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input v-model="temp.sort" placeholder="排序" />
                        </el-form-item>
                        <el-form-item label="图标样式" prop="icon">
                            <el-input v-model="temp.icon" placeholder="图标样式" />
                        </el-form-item>
                        <el-form-item label="值描述" prop="description">
                            <el-input v-model="temp.description" placeholder="值描述" />
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

    import {getPageSysDictionary,getAllSysDictionary,addSysDictionary,updateSysDictionary,deleteSysDictionary}  from './api/sysdictionary.js'
    import {deepClone, parseTime} from '@/utils';
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    export default {
        name: 'SysDictionary',
        components: { Pagination },
        data() {
            return {
                tableData: [], //当前分页数据
                allTableData:[], //所有表格数据，下载时候回加载
                //表头（主要是下载excel时候使用）
                columns:[
                           {label:'字典表主键',field:'id'},
                           {label:'字典分类',field:'type'},
                           {label:'字典的键',field:'dictionaryKey'},
                           {label:'字典的值',field:'dictionaryValue'},
                           {label:'排序',field:'sort'},
                           {label:'图标样式',field:'icon'},
                           {label:'值描述',field:'description'},
                ],
                dataLoading:false,
                total: 0,
                listQuery: { //搜索条件
                    pageIndex: 1,
                    pageSize: 10,
                type: undefined,
                dictionaryKey: undefined,
                dictionaryValue: undefined,
                sort: undefined,
                icon: undefined,
                description: undefined,
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
                    "type": null,
                    "dictionaryKey": null,
                    "dictionaryValue": null,
                    "sort": null,
                    "icon": null,
                    "description": null,
                },
                rules: { //校验功能
                    type: [
                      { required: true, message: '必填字典分类', trigger: ['blur', 'change'] },
                    ],
                    dictionaryKey: [
                      { required: true, message: '必填字典的键', trigger: ['blur', 'change'] },
                    ],
                    dictionaryValue: [
                      { required: true, message: '必填字典的值', trigger: ['blur', 'change'] },
                    ],
                    sort: [
                      { required: false, message: '必填排序', trigger: ['blur', 'change'] },
                    ],
                    icon: [
                      { required: false, message: '必填图标样式', trigger: ['blur', 'change'] },
                    ],
                    description: [
                      { required: false, message: '必填值描述', trigger: ['blur', 'change'] },
                    ],

                    /* //如需正则表达式验证 示例如下
                    born: [{ required: true, message: '必填', trigger: ['blur', 'change'] },
                        //额外添加正则的示例如下:
                        { pattern:/^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/ , message: '请输入有效的日期格式', trigger: ['blur', 'change'] }
                    ],
                    */
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
                    let res= await deleteSysDictionary(rows[index].id)
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
                getPageSysDictionary(this.listQuery).then(res=>{
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
              let self = this;
              this.allTableData = this.tableData;
              import('@/vendor/Export2Excel').then(excel => {
                const tHeader = []
                const filterVal = []
                for (let column of self.columns) {
                  tHeader.push(column.label)
                  filterVal.push(column.field)
                }
                const data = this.formatJson(filterVal)
                excel.export_json_to_excel({
                  header: tHeader,
                  data,
                  filename: '数据字典'
                })
                this.downloadLoading = false
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
                      "type": null,
                      "dictionaryKey": null,
                      "dictionaryValue": null,
                      "sort": null,
                      "icon": null,
                      "description": null,
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
          if (valid) {
            let param=JSON.parse( JSON.stringify(this.temp));
            addSysDictionary(param).then(response=>{
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
            updateSysDictionary(param).then(response=>{
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

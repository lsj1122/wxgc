<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input v-model="listQuery.createBy" placeholder="上传人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <!--显示列表-->
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      fit
      highlight-current-row
    >

      <el-table-column
        fixed
        prop="otherFilePath"
        label="上传地址"
        align="center"
      >
      </el-table-column>

      <el-table-column
        fixed
        prop="createTime"
        label="上传时间"
        align="center"
      >
      </el-table-column>

      <el-table-column
        fixed
        prop="createBy"
        label="上传人"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
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
    <el-dialog v-loading="loading"
               element-loading-text="上传中,请勿刷新页面" :title="textMap[dialogStatus]" :before-close="cancel" :visible.sync="dialogFormVisible" width="50%":close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="margin-left:5px;">

        <!-- 单文件上传,无multiple -->
        <upload-file file-type="*" ref="clearData" list-type="*" accept="*" max-size="100M" file-leng="10485760000"   @change="getFile"/>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="createData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import uploadFile from '@/components/Upload/uploadFile'
  import {getPageTtUploadFile,addTtUploadFile,deleteTtUploadFile}  from '../../sysproject/api/ttuploadfile.js'
  import {simpleUploads}  from '../../sysproject/api/ttfile.js'
  import Pagination from '@/components/Pagination'
  export default {
    name: 'dataFile',
    components: { Pagination,uploadFile },
    data() {
      return {
        loading: false,
        tableData: [], //当前分页数据
        allTableData:[], //所有表格数据，下载时候回加载
        dataLoading:false,
        dialogFormVisible: false,
        temp: {
          id: null,
          otherFilePath: null,
          type: 15
        },
        fileList: [],
        rules: {},
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        total: 0,
        listQuery: { //搜索条件
          pageIndex: 1,
          pageSize: 10,
          createBy: undefined,
          type: 15
        },
      }
    },
    created() {
      //加载分页数据
      this.loadPageData();
    },
    mounted() {
    },
    methods: {
      cancel(){
        this.fileList = []
        this.$refs.clearData.clearData()
        this.resetTemp();
        this.dialogFormVisible = false
      },
      getFile(file,fileList){
        this.fileList = []
        let fd = new FormData()
        for (let i = 0; i <fileList.length ; i++) {
          fd.append('fileList',fileList[i].raw)
        }
        this.fileList = fd
      },
      //单击添加选择文件
      handleCreate(){
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      //删除单行
      deleteRow(index, rows) {
        this.$confirm('你确定要删除?', '系统警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let res= await deleteTtUploadFile(rows[index].id)
          if(res.code=="success"){
            rows.splice(index, 1);
          }
          this.$message({
            type: 'success',
            message: res.msg
          })
        }).catch(err => {
          // this.errorMsg()
        })
      },
      //分页查询
      loadPageData(){
        this.dataLoading=true;
        getPageTtUploadFile(this.listQuery).then(res=>{
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
      //增加
      createData(){
        this.loading=true
        if(this.fileList.length==0){
          this.$message.error("请选择图片")
          this.loading=false
          return
        }
        simpleUploads(this.fileList).then(res=>{
          this.temp.otherFilePath = res[0]
          let param = this.temp;
          addTtUploadFile(param).then(response=>{
            this.loading=false
            if(response.code=="success"){
              this.$refs.clearData.clearData()
              this.cancel()
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
        })
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
      //重置临时变量值
      resetTemp(){
        this.temp={
          id: null,
          otherFilePath: null,
          type: 15
        }
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

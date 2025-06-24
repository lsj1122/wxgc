<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="姓名/名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select
        v-model="listQuery.type"
        clearable
        filterable
        placeholder="请选择类型"
      >
        <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value"></el-option>
      </el-select>
      <el-input v-model="listQuery.orders" placeholder="排序" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <!--            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--                {{ $t('table.export') }}-->
      <!--            </el-button>-->
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
        prop="name"
        label="姓名/名称"
        align="center"
      >
      </el-table-column>

      <el-table-column
        fixed
        prop="type"
        label="数据类型"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.type==0"><i></i>人员</span>
          <span v-if="scope.row.type==1"><i></i>单位</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed
        prop="orders"
        label="排序"
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
            @click.native.prevent="handleEdit(scope)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.$index, tableData)">删除
          </el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%"
               :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px"
               style="margin-left:5px;">

        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="姓名/名称" prop="name">
                <el-input v-model="temp.name" placeholder="姓名/名称"/>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select
                  v-model="temp.type"
                  clearable
                  filterable
                  placeholder="请选择类型"
                >
                  <el-option v-for="item in options" :key="item.value" :label="item.name"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序" prop="orders">
                <el-input v-model="temp.orders" placeholder="排序"/>
              </el-form-item>

            </div>
          </el-col>
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

import {
  getPageTtSafeStar,
  getAllTtSafeStar,
  addTtSafeStar,
  updateTtSafeStar,
  deleteTtSafeStar
} from './api/ttsafestar.js'
import {deepClone, parseTime} from '@/utils';
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'TtSafeStar',
  components: {Pagination},
  data() {
    return {
      options: [{name: '人员', value: 0}, {name: '单位', value: 1}],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        {label: '姓名/名称', field: 'name'},
        {label: '0人员1单位', field: 'type'},
        {label: '排序', field: 'orders'},
      ],
      dataLoading: false,
      total: 0,
      listQuery: { //搜索条件
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        type: undefined,
        orders: undefined,
        projectId: undefined,
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
        "name": null,
        "type": null,
        "orders": null,
        "projectId": null,
      },
      rules: { //校验功能
        name: [
          {required: true, message: '必填姓名/名称', trigger: ['blur', 'change']},
        ],
        type: [
          {required: true, message: '必填0人员1单位', trigger: ['blur', 'change']},
        ],
        orders: [
          {required: true, message: '必填排序', trigger: ['blur', 'change']},
        ],
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
    //删除单行
    deleteRow(index, rows) {
      this.$confirm('你确定要删除此信息?', '系统警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await deleteTtSafeStar(rows[index].id)
        if (res.code == "success") {
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
    loadPageData() {
      this.dataLoading = true;
      getPageTtSafeStar(this.listQuery).then(res => {
        if (res.code == "success") {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
        this.dataLoading = false;
      }).catch(err => {
        console.log(JSON.stringify(err))
        this.dataLoading = false;
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
      getAllTtSafeStar().then(res => {
        if (res.code == "success") {
          this.allTableData = res.data;
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
              filename: '列表'
            })
            this.downloadLoading = false
          })
        } else {
          this.errorMsg("下载数据失败")
        }
      }).catch(err => {
        this.errorMsg()
      })
    },
    formatJson(filterVal) {
      return this.allTableData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    //充值临时变量值
    resetTemp() {
      let that = this;
      this.temp = {
        "id": null,
        "name": null,
        "type": null,
        "orders": null,
        "projectId": null,
      }
    },
    //增加窗口弹出之前恢复默认值
    handleCreate() {
       if (
        !this.$store.getters.projectId ||
        this.$store.getters.projectChildrenIds.length > 0
      ) {
        this.$message({
          message: "请先选择具体项目再添加数据",
          type: "warning",
        });
        return;
      }
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //增加
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createBy = this.$store.getters.name
          let param = JSON.parse(JSON.stringify(this.temp));
          addTtSafeStar(param).then(response => {
            if (response.code == "success") {
              this.dialogFormVisible = false
              this.loadPageData()
            }
            this.$notify({
              title: '操作提示',
              message: response.msg,
              type: response.code,
              duration: 2000
            })
          }).catch(err => {
            console.log(err)
            this.errorMsg()
          })
        }
      })
    },
    //修改
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.updateBy = this.$store.getters.name
          let param = JSON.parse(JSON.stringify(this.temp));
          updateTtSafeStar(param).then(response => {
            if (response.code == "success") {
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
    errorMsg(msg) {
      if (!msg) msg = "服务器异常,稍后再试试";
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

.el-icon-male {
  color: #42b983;
  font-size: 20px;
  font-weight: bold;
}

.el-icon-female {
  color: palevioletred;
  font-size: 20px;
  font-weight: bold;
}

.el-icon-question {
  color: rebeccapurple;
  font-size: 20px;
  font-weight: bold;
}
</style>

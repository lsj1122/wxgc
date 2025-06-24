<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.grantDate"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择发放日期"
      >
      </el-date-picker>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
    </div>
    <!--显示列表-->
    <el-table
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      border
      fit
      highlight-current-row
    >

      <!-- <el-table-column
        prop="id"
        label="id"
        align="center"
      >
      </el-table-column> -->

      <el-table-column

        prop="wages"
        label="工资"
        align="center"
      >
      </el-table-column>

      <el-table-column

        prop="people"
        label="发放人数"
        align="center"
      >
      </el-table-column>

      <el-table-column

        prop="grantDate"
        label="发放日期"
        align="center"
      >
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="180"
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
              <el-form-item label="工资" prop="wages">
                <el-input type="number" v-model="temp.wages" placeholder="工资"/>
              </el-form-item>
              <el-form-item label="发放人数" prop="people">
                <el-input v-model="temp.people" placeholder="发放人数"/>
              </el-form-item>
              <el-form-item label="发放日期" prop="born">
                <el-date-picker
                  v-model="temp.grantDate"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="发放日期"
                >
                </el-date-picker>
              </el-form-item>


              <!--字段单选 示例如下 -->
              <!--<el-form-item label="性别" prop="sex">
                <el-radio-group v-model="sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                  <el-radio :label="0">未知</el-radio>
                </el-radio-group>
              </el-form-item>-->

              <!--字段开关 示例如下 -->
              <!-- <el-form-item label="状态" prop="status">
                       <el-switch
                         v-model="temp.status"
                         active-text="可用"
                         inactive-text="禁止"
                         active-color="#13ce66"
                         inactive-color="#ff4949">
                       </el-switch>
                     </el-form-item>-->

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
  getPageTtPersonWages,
  getAllTtPersonWages,
  addTtPersonWages,
  updateTtPersonWages,
  deleteTtPersonWages
} from './api/ttpersonwages.js'
import {deepClone, parseTime} from '@/utils';
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'TtPersonWages',
  components: {Pagination},
  data() {
    return {
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        // {label: 'id', field: 'id'},
        {label: '工资', field: 'wages'},
        {label: '发放人数', field: 'people'},
        {label: '发放日期', field: 'grantDate'},
      ],
      dataLoading: false,
      total: 0,
      listQuery: { //搜索条件
        pageIndex: 1,
        pageSize: 10,
        id: undefined,
        projectId: undefined,
        wages: undefined,
        people: undefined,
        grantDate: undefined,
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
        "projectId": null,
        "wages": null,
        "people": null,
        "grantDate": null,
      },
      rules: { //校验功能
        wages: [
          {required: true, message: '必填工资', trigger: ['blur', 'change']},
        ],
        people: [
          {required: true, message: '必填发放人数', trigger: ['blur', 'change']},
        ],
        grantDate: [
          {required: true, message: '必填发放日期', trigger: ['blur', 'change']},
        ],

        /* //如需正则表达式验证 示例如下
        born: [{ required: true, message: '必填', trigger: ['blur', 'change'] },
            //额外添加正则的示例如下:
            { pattern:/^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/ , message: '请输入有效的日期格式', trigger: ['blur', 'change'] }
        ],
        */
      },
      noRotate: false,
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
      this.$confirm('你确定要删除此信息?', '系统警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await deleteTtPersonWages(rows[index].id)
        if (res.code == "success") {
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
    loadPageData() {
      this.dataLoading = true;
      getPageTtPersonWages(this.listQuery).then(res => {
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
      getPageTtPersonWages(this.listQuery).then(res => {
        if (res.code == "success") {
          this.allTableData = res.data.records;
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
              filename: '工资管理'
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
        "projectId": null,
        "wages": null,
        "people": null,
        "grantDate": null,
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
          let param = JSON.parse(JSON.stringify(this.temp));
          addTtPersonWages(param).then(response => {
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
          let param = JSON.parse(JSON.stringify(this.temp));
          updateTtPersonWages(param).then(response => {
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

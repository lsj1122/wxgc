<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="账号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.realname"
        placeholder="姓名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="手机"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-checkbox
        v-model="status"
        style="float: left"
        label="2"
        border
        @change="changeStatus"
        >待审核账号(被禁用)</el-checkbox
      > -->
      <el-select v-model="listQuery.status" placeholder="请选择状态" style="float: left" @change="changeStatus">
        <el-option label="禁用" :value="2"></el-option>
        <el-option label="正常" :value="1"></el-option>
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button>

      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload(true)"
      >
        {{ $t("table.exportAll") }}
      </el-button>
    </div>
    <!--显示用户的列表-->
    <div class="tablebox">
      <el-table
        :data="tableData"
        v-loading="dataLoading"
        row-key="id"
        height="100%"
        stripe
        fit
        highlight-current-row
      >
        <el-table-column fixed prop="username" label="账号" align="center">
        </el-table-column>
        <el-table-column prop="avatar" label="头像" align="center">
          <template slot-scope="scope">
            <el-avatar :size="40" :src="scope.row.avatar" @error="errorHandler">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="realname" label="姓名" align="center">
        </el-table-column>

        <el-table-column prop="sex" label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == ''"
              ><i class="el-icon-question"></i>未知</span
            >
            <span v-if="scope.row.sex == 1"
              ><i class="el-icon-male"></i>男</span
            >
            <span v-if="scope.row.sex == 2"
              ><i class="el-icon-female"></i>女</span
            >
          </template>
        </el-table-column>

        <el-table-column prop="email" label="所属公司" align="center">
        </el-table-column>
        <el-table-column prop="rolesStr" label="角色" align="center">
        </el-table-column>

        <el-table-column prop="phone" label="手机" align="center">
        </el-table-column>

        <el-table-column prop="createTime" label="创建日期" align="center">
        </el-table-column>

        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status == 1 ? "正常" : "禁用" }}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              v-if="!isSuperAdmin(scope.row.rolesIds)"
              @click.native.prevent="handleEdit(scope)"
              >编辑</el-button
            >
            <el-button
              v-if="!isSuperAdmin(scope.row.rolesIds)"
              size="mini"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页组件-->
    <el-pagination
      class="el-pagination"
      v-show="total > 0"
      background
      layout="prev, pager, next"
      :current-page.sync="listQuery.pageIndex"
      :page-size.sync="listQuery.pageSize"
      @current-change="loadPageUsers"
      :total="total"
    >
    </el-pagination>

    <!--增加或修改弹出层-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="12"
            ><div class="grid-content bg-purple">
              <p style="text-align: center; color: orange">账号请谨慎修改</p>
              <el-form-item label="账号" prop="username">
                <el-input v-model="temp.username" />
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="temp.password" />
              </el-form-item>
              <el-form-item label="姓名" prop="realname">
                <el-input v-model="temp.realname" />
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                  <el-radio :label="0">未知</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="所属公司" prop="email">
                <el-input v-model="temp.email" />
              </el-form-item>
              <el-form-item label="手机" prop="phone">
                <el-input v-model="temp.phone" />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-switch
                  v-model="temp.status"
                  active-text="可用"
                  inactive-text="禁止"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item></div
          ></el-col>

          <el-col :span="12">
            <el-form-item label="头像" prop="avatar">
              <el-input v-model="temp.avatar" style="display: none" />
              <img :src="temp.avatar" class="avatar" />
              <el-button
                type="primary"
                icon="el-icon-upload"
                style="position: absolute; bottom: 15px; margin-left: 40px"
                @click="imagecropperShow = true"
              >
                上传头像
              </el-button>
            </el-form-item>
            <el-form-item label="组织机构" prop="rolesIds">
              <el-tree
                class="tree-role"
                ref="roleTree"
                :data="rolesTree"
                :props="{ label: 'cnName', children: 'sysSubRoles' }"
                :check-strictly="true"
                node-key="id"
                show-checkbox
                default-expand-all
                @check="handleNodeCheck"
              ></el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      :noRotate="noRotate"
      :url="uploadUrl"
      lang-type="zh"
      @close="close"
      @crop-success="cropSuccess"
    />
  </div>
</template>

<script>
import {
  getPageUsers,
  addUser,
  updateUser,
  deleteUser,
  getExcelData,
} from "@/api/user.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
import { getRoles } from "@/api/role.js";
import waves from "@/directive/waves";
export default {
  name: "test",
  components: { Pagination, ImageCropper, PanThumb, waves },
  data() {
    return {
      tableData: [],
      excelTable: [], ///导出
      rolesTree: [], //所有的角色
      checkedRoles: [], //选中的角色
      status: false,
      columns: [
        {
          label: "账号",
          field: "username",
          align: "center",
          prop: "username",
          fixed: true,
        },
        {
          label: "头像",
          field: "avatar",
          align: "center",
          prop: "avatar",
          fixed: false,
        },
        {
          label: "姓名",
          field: "realname",
          align: "center",
          prop: "realname",
          fixed: false,
        },
        {
          label: "性别",
          field: "sex",
          align: "center",
          prop: "sex",
          fixed: false,
        },
        {
          label: "邮箱",
          field: "email",
          align: "center",
          prop: "email",
          fixed: false,
        },
        {
          label: "手机",
          field: "phone",
          align: "center",
          prop: "phone",
          fixed: false,
        },
        {
          label: "角色",
          field: "rolesStr",
          align: "center",
          prop: "rolesStr",
          fixed: false,
        },
        {
          label: "创建日期",
          field: "createTime",
          align: "center",
          prop: "createTime",
          fixed: false,
        },
      ],
      dataLoading: false,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        username: undefined,
        realname: undefined,
        phone: undefined,
        status: undefined,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑用户",
        create: "新增用户",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      sex: 1,
      temp: {
        id: null,
        username: null,
        realname: null,
        password: null,
        avatar:
          "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
        birthday: null,
        sex: 1,
        email: null,
        phone: null,
        status: null,
        createBy: null,
        updateBy: null,
        roles: null,
      },
      rules: {
        //校验功能
        username: [
          {
            required: true,
            message: "必填,账号名只能是2-15位字母或数字！",
            trigger: "blur",
          },
          {
            pattern: /^[A-Za-z0-9]{2,15}$/,
            message: "账号名只能是2-15位字母或数字！",
            trigger: ["blur", "change"],
          },
        ],
        realname: [
          {
            required: true,
            message: "必填,字母、数字、下划线、中文组成,2-20字符！",
            trigger: "blur",
          },
          {
            pattern: /^[\u4e00-\u9fa5A-Za-z0-9-_]{2,20}$/,
            message: "昵称由字母、数字、下划线、中文组成,2-20字符！",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "必填，6-18位任意字符", trigger: "blur" },
          {
            pattern: /^([a-z0-9]{32})|(.{6,18})$/,
            message: "密码必须是6-18位任意字符！",
            trigger: ["blur", "change"],
          },
        ],
        email: [
          // {
          //   type: "email",
          //   message: "请输入正确的邮箱地址",
          //   trigger: ["blur", "change"],
          // },
        ],
        phone: [
          {
            required: true,
            message: "必填手机号",
            trigger: ["blur", "change"],
          },
          // {
          //   pattern: /^1(3([0-35-9]\d|4[1-8])|4[14-9]\d|5([0125689]\d|7[1-79])|66\d|7[2-35-8]\d|8\d{2}|9[13589]\d)\d{7}$/,
          //   message: "请输入正确的手机号码",
          //   trigger: ["blur", "change"],
          // },
          { validator: this.validatePhone, trigger: ["blur", "change"] },
        ],
        rolesIds: [
          {
            required: true,
            validator: this.ckRolesIds,
            trigger: ["blur", "change"],
          },
        ],
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      noRotate: false,
      uploadUrl: null, //(设置null主要为了阻止自定上传)process.env.VUE_APP_BASE_API+"/wxgc/plus/gblFile/upload/avatar",
      checkAll: false,
      isIndeterminate: false,
    };
  },
  created() {
    //创建组件
    this.loadPageUsers();
  },
  mounted() {
    this.getRoles(); //查询所有角色
  },
  methods: {
    validatePhone(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    },
    ckRolesIds(rule, value, callback) {
      let ckValue = this.$refs.roleTree.getCheckedKeys();
      if (ckValue == "" || ckValue == null || value.length == 0) {
        callback(new Error("请指定用户组织结构"));
      }
      callback();
    },
    //判断是否是超级管理账号
    isSuperAdmin(roleIds) {
      if (roleIds != null && roleIds.length > 0) {
        for (let id of roleIds) {
          if (id == 1) {
            return true;
          }
        }
      }
      return false;
    },
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteUser(rows[index].id);
          if (res.code == "success") {
            rows.splice(index, 1);
          }
          this.$message({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //分页查询用户
    loadPageUsers() {
      //分页查询用户
      this.dataLoading = true;
      getPageUsers(this.listQuery)
        .then((res) => {
          this.tableData = res.data;
          this.total = res.count;
          this.dataLoading = false;
        })
        .catch((err) => {
          this.dataLoading = false;
        });
    },
    changeStatus(value) {
      this.listQuery.status = value || null;
      this.handleFilter();
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.loadPageUsers();
    },
    errorHandler() {
      //头像加载错误
      return true;
    },
    //下载Excel表格
    handleDownload(all) {
      this.downloadLoading = true;
      let self = this;
      //查询导出数据
      getExcelData(all != "" && all == true ? "" : self.listQuery)
        .then((res) => {
          if ((res.code = "success")) {
            self.excelTable = res.data;
            import("@/vendor/Export2Excel").then((excel) => {
              const tHeader = [];
              const filterVal = [];
              for (let column of self.columns) {
                tHeader.push(column.label);
                filterVal.push(column.field);
              }
              const data = this.formatJson(filterVal);
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: "用户列表",
              });
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
          this.downloadLoading = false;
        })
        .catch((err) => {
          this.downloadLoading = false;
        });
    },
    formatJson(filterVal) {
      return this.excelTable.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    resetTemp() {
      let that = this;
      this.checkedRoles = [];
      if (this.$refs.roleTree) {
        this.$refs.roleTree.setCheckedKeys(this.checkedRoles, true);
      }
      this.temp = {
        id: null,
        username: null,
        realname: null,
        password: null,
        avatar:
          "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
        birthday: null,
        sex: null,
        email: null,
        phone: null,
        status: true,
        createBy: that.$store.state.user.name,
        updateBy: null,
        rolesIds: null,
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      //增加用户
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.temp));
          param.sex = this.sex;
          param.status = this.temp.status ? 1 : 2;
          param.rolesIds = this.checkedRoles;
          addUser(param).then((response) => {
            if (response.code == "success") {
              this.dialogFormVisible = false;
              this.loadPageUsers();
            }
            this.$notify({
              title: "操作提示",
              message: response.msg,
              type: response.code,
              duration: 2000,
            });
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.temp));
          param.sex = this.sex;
          param.status = this.temp.status ? 1 : 2;
          //这列判断主要是想后面换成是多选框的时候兼容
          param.roles = [];
          param.rolesIds = this.checkedRoles;
          updateUser(param).then((response) => {
            if (response.code == "success") {
              this.dialogFormVisible = false;
              this.loadPageUsers();
            }
            this.$notify({
              title: "操作提示",
              message: response.msg,
              type: response.code,
              duration: 2000,
            });
          });
        }
      });
    },
    cropSuccess(createImgUrl) {
      //头像裁剪成功之后
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.temp.avatar = createImgUrl;
    },
    handleEdit(scope) {
      this.dialogStatus = "update";
      this.dialogType = "edit";
      this.temp = deepClone(scope.row);
      this.sex = this.temp.sex;
      this.temp.status = this.temp.status == 1 ? true : false;
      this.checkedRoles = this.temp.rolesIds;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
        this.$refs.roleTree.setCheckedKeys(this.checkedRoles, true);
      });
    },
    close() {
      this.imagecropperShow = false;
    },
    async getRoles() {
      this.rolesTree = await (await getRoles()).data;
    },
    handleNodeCheck(data, node) {
      this.$refs.roleTree.setCheckedKeys(
        [data.id],
        node.checkedKeys.length > 0
      );
      this.checkedRoles = node.checkedKeys.length > 0 ? [data.id] : [];
      this.temp.rolesIds = this.checkedRoles;
      console.log("handleNodeCheck", data, node, this.checkedRoles);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  overflow-x: auto;
}
.tablebox {
  height: calc(100% - 100px);
}
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
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 3px solid #e3e3e3;
  vertical-align: middle;
}
.avatar:hover {
  border: 3px solid #3b91b6;
}
// 添加/编辑用户弹窗中的组织结构可滚动
.el-tree {
  max-height: 350px;
  overflow: auto;
}

.el-tree::-webkit-scrollbar {
  width: 10px;
}
.el-tree::-webkit-scrollbar-track {
  background-color: #e3e3e3;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
.el-tree::-webkit-scrollbar-thumb {
  background-color: #1890ff;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
</style>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.path"
        placeholder="路径"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="组件名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.redirect"
        placeholder="重定向地址"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
    </div>

    <!--显示的表格-->
    <div class="tablebox">
      <el-table
        current-row-key="id"
        v-loading="listLoading"
        :data="list"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        height="100%"
        stripe
        fit
        highlight-current-row
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          v-for="(item, i) in columns"
          stripe="true"
          :label="item.label"
          :prop="item.prop"
          :sortable="item.sortable"
          :align="item.align"
          :width="item.width"
          :class-name="item.className"
          :key="i"
        >
          <template slot-scope="{ row }">
            <span v-if="item.formatter == null && item.field != 'more'">{{
                row[item.field]
              }}</span>
            <el-popover
              v-else-if="item.field == 'more'"
              trigger="hover"
              placement="top"
            >
              <p>可访问的角色: <span v-text="row[item.prop].roles"></span></p>
              <p>
                显示图标:
                <i
                  v-if="hasElIcon(row[item.prop].icon)"
                  :class="row[item.prop].icon"
                ></i>
                <svg-icon v-else :icon-class="row[item.prop].icon"/>
              </p>
              <p>缓存页面: {{ row[item.prop].nocache }}</p>
              <p>固定显示Tab中: {{ row[item.prop].affix }}</p>
              <p>隐藏在面包屑中: {{ row[item.prop].breadcrumb }}</p>
              <p>突出显示路径: {{ row[item.prop].activemenu }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">查看</el-tag>
              </div>
            </el-popover>
            <span v-else v-html="item.formatter(row)"></span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          stripe="true"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              {{ $t("table.edit") }}
            </el-button>
            <el-button
              v-if="row.status != 'deleted'"
              size="mini"
              type="danger"
              @click="handleDelete(row, $index)"
            >
              {{ $t("table.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页组件-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <p style="color: orange">
      温馨提示：增加成功后，已经默认添加admin角色，其他角色需要到权限管理中给对应角色授权后,刷新显示菜单。
    </p>
    <!--增加或修改弹出层-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="80%"
      :close-on-click-modal="closeOnClickModal"
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
          >
            <div class="grid-content bg-purple">
              <el-form-item label="路径" prop="path">
                <el-input
                  v-model="temp.path"
                  placeholder="view目录.vue组件的路径"
                />
              </el-form-item>
              <el-form-item label="Vue组件" prop="component">
                <el-input v-model="temp.component"/>
              </el-form-item>
              <el-form-item label="重定向地址" prop="redirect">
                <el-input v-model="temp.redirect"/>
              </el-form-item>
              <el-form-item label="组件名称" prop="name">
                <el-input v-model="temp.name"/>
              </el-form-item>
              <el-form-item label="父级菜单" prop="parentid">
                <el-select
                  v-model="temp.parentid"
                  class="filter-item" filterable
                  placeholder="非一级菜单选择"
                >
                  <el-option
                    v-for="item in parentRules"
                    :key="item.id"
                    :label="formatter(item.meta.title)"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="显示根菜单" prop="alwaysshow">
                <el-switch
                  v-model="temp.alwaysshow"
                  active-text="是"
                  inactive-text="否"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
              <el-form-item label="隐藏在侧边栏" prop="hidden">
                <el-switch
                  v-model="temp.hidden"
                  active-text="是"
                  inactive-text="否"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
            </div
            >
          </el-col>
          <el-col :span="12">
            <div
              class="grid-content bg-purple-light"
              style="padding-left: 15px"
            >
              <el-form-item label="显示名称" prop="title">
                <el-input
                  v-model="meta.title"
                  placeholder="国际化文件lang/zh.js中route的key，或者直接写中文"
                />
              </el-form-item>

              <el-form-item label="突出显示路径" prop="activemenu">
                <el-input v-model="meta.activemenu"/>
              </el-form-item>

              <el-form-item label="排序" prop="sort">
                <el-input-number v-model="temp.sort" controls-position="right" :min="1" ></el-input-number>
              </el-form-item>

              <el-form-item label="图标" prop="icon">
                <i v-if="hasElIcon(meta.icon)" :class="meta.icon"></i>
                <svg-icon v-else :icon-class="meta.icon"/>

                <el-button
                  style="margin-left: 10px"
                  type="primary"
                  size="mini"
                  @click="drawer = true"
                >选择图标
                </el-button
                >
                <el-button
                  style="margin-left: 10px"
                  type="warning"
                  size="mini"
                  @click="meta.icon = ''"
                >清除图标
                </el-button
                >
              </el-form-item>

              <el-form-item label="是否缓存页面" prop="nocache">
                <el-switch
                  v-model="meta.nocache"
                  active-text="是"
                  inactive-text="否"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>

              <el-form-item label="固定显示Tab中" prop="affix">
                <el-switch
                  v-model="affix"
                  active-text="是"
                  inactive-text="否"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>

              <el-form-item label="面包屑中隐藏" prop="breadcrumb">
                <el-switch
                  active-text="是"
                  inactive-text="否"
                  v-model="meta.breadcrumb"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
            </div>
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{
            $t("table.confirm")
          }}</el-button>
      </span>
    </el-dialog>

    <!--抽屉弹窗选择图标-->
    <el-drawer
      size="50%"
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
      :before-close="handleClose"
    >
      <div class="icons-container">
        <el-tabs type="border-card">
          <el-tab-pane label="svg图标">
            <div class="grid">
              <div
                v-for="item of svgIcons"
                :key="item"
                @click="setIconCode(item)"
              >
                <el-tooltip placement="top">
                  <div slot="content">
                    {{ generateIconCode(item) }}
                  </div>
                  <div class="icon-item" :class="selectIcon(item)">
                    <svg-icon :icon-class="item" class-name="disabled"/>
                    <span>{{ item }}</span>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Element-UI 图标">
            <div class="grid">
              <div
                v-for="item of elementIcons"
                :key="item"
                @click="setElementIconCode(item)"
              >
                <el-tooltip placement="top">
                  <div slot="content">
                    {{ generateElementIconCode(item) }}
                  </div>
                  <div class="icon-item" :class="selectIcon(item)">
                    <i :class="'el-icon-' + item"/>
                    <span>{{ item }}</span>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  fetchRouterMenus,
  fetchAllLevelRouterMenu,
  addRouterMenu,
  updateRouterMenu,
  deleteRouterMenu,
} from "@/api/sysRouterMenu";
import waves from "@/directive/waves"; // waves directive
import {parseTime} from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import svgIcons from "../icons/svg-icons";
import elementIcons from "../icons/element-icons";
import zh from "../../lang/zh";

export default {
  name: "PagePermission",
  components: {Pagination},
  directives: {waves},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      closeOnClickModal: false,
      svgIcons,
      elementIcons,
      drawer: false,
      direction: "rtl",
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        redirect: undefined,
        path: undefined,
        name: undefined,
      },
      columns: [
        {
          label: "DB编号",
          field: "id",
          prop: "id",
          align: "center",
          width: "80",
          className: "",
          sortable: true,
        },
        {
          label: "路径",
          field: "path",
          prop: "path",
          align: "center",
          width: "230",
          className: "",
          sortable: false,
        },
        {
          label: "显示名称",
          field: "meta",
          prop: "meta",
          align: "center",
          width: "",
          className: "",
          sortable: false,
          formatter: function (row, column) {
            let zhVaue = zh.route[row.meta.title];
            if (zhVaue != null && zhVaue != "") {
              return zhVaue;
            }
            return row.meta.title;
          },
        },
        {
          label: "Vue组件",
          field: "component",
          prop: "component",
          align: "center",
          width: "",
          className: "",
          sortable: false,
        },
        {
          label: "重定向地址",
          field: "redirect",
          prop: "redirect",
          align: "center",
          width: "",
          className: "",
          sortable: false,
        },
        {
          label: "组件名称",
          field: "name",
          prop: "name",
          align: "center",
          width: "",
          className: "",
          sortable: false,
        },
        {
          label: "排序值",
          field: "sort",
          prop: "sort",
          align: "center",
          width: "",
          className: "",
          sortable: false,
        },
        {
          label: "显示根菜单",
          field: "alwaysshow",
          prop: "alwaysshow",
          align: "center",
          width: "",
          className: "",
          sortable: false,
        },
        {
          label: "隐藏在边栏中",
          field: "hidden",
          prop: "hidden",
          align: "center",
          width: "",
          className: "",
          sortable: false,
        },
        {
          label: "更多属性",
          field: "more",
          prop: "meta",
          align: "center",
          width: "",
          className: "",
          sortable: false,
          formatter: function (row, column) {
            return "";
          },
        },
      ],
      parentRules: [],
      changeParentRules: [],
      importanceOptions: [1, 2, 3],
      sortOptions: [
        {label: "ID Ascending", key: "+id"},
        {label: "ID Descending", key: "-id"},
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        path: undefined,
        component: "Layout",
        redirect: undefined,
        name: undefined,
        alwaysshow: true,
        hidden: false,
        parentid: undefined,
      },
      meta: {
        title: "",
        icon: "",
        nocache: true,
        affix: true,
        breadcrumb: false,
        activemenu: "",
      },
      affix: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑修改",
        create: "新增菜单",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        //校验功能
        path: [
          {required: true, message: "必填,例如:/permission", trigger: "blur"},
        ],
        component: [
          {
            required: false,
            message: "布局目前只有Layout，你可以自定义布局样式,或者不填",
            trigger: "change",
          },
        ],
        redirect: [
          {
            required: false,
            message: "必填，例如:/permission/page,要和访问路径对应",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "组件名称，一般都是字母",
            trigger: "blur",
          },
        ],
        parentid: [
          {
            required: false,
            message: "一级菜单不用填，二级菜单一定要填父级",
            trigger: "click",
          },
        ],
        title: [
          {
            required: false,
            message: "显示名,可以是国际化文件中的key,或者直接填写文字",
            trigger: "click",
          },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList(); //分页查询路由菜单
    this.getAllLevelRouterMenu(); //查询所有路由菜单
  },
  methods: {
    formatter(key) {
      let zhVaue = zh.route[key];
      if (zhVaue != null && zhVaue != "") {
        return zhVaue;
      }
      return key;
    },
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`;
      this.meta.icon = symbol;
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`;
      this.meta.icon = "el-icon-" + symbol;
    },
    setIconCode(symbol) {
      this.meta.icon = symbol;
    },
    setElementIconCode(symbol) {
      this.meta.icon = "el-icon-" + symbol;
    },
    selectIcon(symbol) {
      if (this.meta.icon == symbol || this.meta.icon == "el-icon-" + symbol) {
        return {active: true};
      }
      return {active: false};
    },
    handleClose(done) {
      done();
    },
    getList() {
      this.listLoading = true;
      fetchRouterMenus(this.listQuery).then((response) => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getAllLevelRouterMenu() {
      fetchAllLevelRouterMenu().then((response) => {
        this.parentRules = response.data;
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const {prop, order} = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    //重置表单路由数据
    resetTemp() {
      this.temp = {
        path: undefined,
        component: "Layout",
        redirect: undefined,
        name: undefined,
        alwaysshow: true,
        hidden: false,
        parentid: undefined,
      };
      this.resetMeta();
    },
    //重置路由属性对象
    resetMeta() {
      //重置表单内容2
      this.meta = {
        title: "",
        icon: "",
        nocache: false,
        affix: true,
        breadcrumb: true,
        activemenu: "",
      };
      this.affix = false;
    },
    //增加前获得数据
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //增加路由菜单
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        this.meta.affix = this.affix;
        this.temp.meta = this.meta;
        if (valid) {
          addRouterMenu(this.temp).then((response) => {
            if (response.code == "success") {
              //添加下下拉组件中
              this.parentRules.push(response.data);
              //this.list.unshift(response.data) //直接添加标签（无法收缩父级）
              this.handleFilter(); //重新检索
              this.dialogFormVisible = false;
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
    //修改前获取数据
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      if (this.temp.meta == null) {
        this.resetMeta();
      } else {
        this.meta = this.temp.meta;
        this.affix = this.meta.affix;
      }
      // 修改下拉菜单中的值
      console.log(753,row)

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //修改路由菜单
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.meta.affix = this.affix;
          const tempData = Object.assign({}, this.temp);
          updateRouterMenu(tempData).then((response) => {
            if (response.code == "success") {
              for (let i = 0; i < this.parentRules; i++) {
                if (this.parentRules[i] == tempData.id) {
                  this.parentRules.splice(i, 1);
                  this.parentRules.push(response.data);
                }
              }
              // const index = this.list.findIndex(v => v.id === this.temp.id)
              // this.list.splice(index, 1, this.temp)
              this.handleFilter(); //重新检索
              this.dialogFormVisible = false;
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
    //删除
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该路由, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRouterMenu(row.id).then((response) => {
          if (response.code === "success") {
            this.handleFilter(); //重新检索
            for (let i = 0; i < this.parentRules; i++) {
              if (this.parentRules[i] === row.id) {
                this.parentRules.splice(i, 1);
              }
            }
          }

        });
      }).catch(() => {
        this.$notify({
          title: "操作提示",
          message: "删除失败！",
          type: "error"
        });
      });
    },
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
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
          filename: "菜单权限",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    hasElIcon(value) {
      if (value == null || value == "") return false;
      return value.toString().indexOf("el-icon") != -1;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
}

.tablebox {
  height: calc(100% - 200px);
}

.el-drawer {
  background-color: #2ac06d;
}

::v-deep .icons-container {
  background-color: #1f2d3d;

  ::v-deep .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    max-height: 800px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .icon-item {
    margin: 5px;
    height: 55px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 16px;
    color: #24292e;
    cursor: pointer;
  }

  .active {
    background-color: #4ab7bd;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>

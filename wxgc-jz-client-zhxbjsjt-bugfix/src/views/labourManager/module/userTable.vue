<template>
  <div>
    <div class="user-table-head">
      <el-input
        placeholder="请输入内容"
        v-model="listQuery.name"
        size="small"
        class="input-with-select"
      >
        <el-button
          type="primary"
          @click="handleSearch"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>

      <el-radio-group
        v-model="workStatus"
        size="small"
        @change="handleWorkStatus"
        style="display: flex"
      >
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="在岗"></el-radio-button>
        <el-radio-button label="已退场"></el-radio-button>
      </el-radio-group>
      <el-select
        v-model="listQuery.personType"
        clearable
        filterable
        placeholder="请选择人员类别"
        @change="handleTypeChange"
      >
        <el-option
          v-for="item in options"
          :key="item"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-checkbox-group v-model="checkList">
        <el-checkbox label="特殊工种" @change="handleGongz"></el-checkbox>
        <el-checkbox label="班组长" @change="handleBanzuz"></el-checkbox>
      </el-checkbox-group>

      <el-button type="primary" size="small" @click="add(null)">添加</el-button>
      <!--      <el-button type="success" size="small">导出</el-button>-->
    </div>
    <div class="user-table-content">
      <wx-table
        :columns="columns"
        :pageOptions="listQuery"
        :total="total"
        :tableData="tableData"
        @onCurrentChange="handleChangePage"
      >
        <template slot="name" slot-scope="row">
          <el-link type="primary" @click="add(row)">{{ row.row.name }}</el-link>
        </template>
        <template slot="workStatus" slot-scope="row">
          <span v-if="row.row.workStatus === '1'">在岗</span>
          <span v-else>已退场</span>
        </template>
        <template slot="action" slot-scope="row">
          <el-link type="primary" @click="add(row)">编辑</el-link>
          <!--          <el-link type="danger" style="margin-left:10px">退场</el-link>-->
        </template>
      </wx-table>
    </div>
    <uesr-msg-dialog ref="user" @reload="handleSearch" />
  </div>
</template>

<script>
import uesrMsgDialog from "./uesrMsgDialog.vue";
import { getPageTtPerson } from "../api/ttperson";

export default {
  components: { uesrMsgDialog },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: "name", label: "姓名", render: "name" },
        { prop: "idCard", label: "身份证", width: 200 },
        { prop: "age", label: "年龄" },
        { prop: "teamName", label: "班组" },
        { prop: "jobs", label: "工种" },
        { prop: "workStatus", label: "在岗状态", render: "workStatus" },
        { prop: "entryDate", label: "进场日期" },
        { prop: "exitDate", label: "退场日期" },
        { prop: "action", label: "操作", render: "action" },
      ],
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        personType: undefined,
        isSpecial: false,
        teamLeader: false,
        name: undefined,
        workStatus: "",
      },
      workStatus: "全部",
      total: 1,
      options: [
        { label: "施工人员", value: "0" },
        { label: "管理人员", value: "1" },
      ],
      checkList: [],
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    handleSearch() {
      this.listQuery.pageIndex = 1;
      this.listQuery.pageSize = 15;
      this.loadPageData();
    },
    loadPageData() {
      getPageTtPerson(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    add(row) {
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
      this.$refs.user.open(row);
    },
    handleChangePage(page) {
      this.listQuery.pageIndex = page;
      this.listQuery.pageSize = 15;
      this.loadPageData();
    },
    handleWorkStatus(label) {
      let value = "";
      if (label === "已退场") {
        value = "0";
      }
      if (label === "在岗") {
        value = "1";
      }
      this.listQuery.workStatus = value;
      this.loadPageData();
    },
    treeNodeClick(data) {
      this.listQuery.buildId = data.buildId;
      this.listQuery.teamId = data.teamId == 0 ? "" : data.teamId;
      this.loadPageData();
    },
    handleTypeChange(personTypeValue) {
      this.listQuery.personType = personTypeValue;
      this.loadPageData();
    },
    handleGongz(value) {
      this.listQuery.isSpecial = value;
      this.loadPageData();
    },
    handleBanzuz(value) {
      this.listQuery.teamLeader = value;
      this.loadPageData();
    },
  },
};
</script>

<style lang="scss" scoped>
.user-table-head {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  > * {
    margin-right: 10px;
  }
}

.input-with-select {
  width: 300px;
}

.user-table-content {
  margin-top: 15px;
}
</style>

<template>
  <div class="class-r-center-con">
    <div class="top-btn-class-r">
      <el-button-group>
        <!--        <el-button>队伍(0)</el-button>-->
        <el-button type="primary">共<span style="font-size: 16px">{{ listQuery.total }}</span>个班组</el-button>
      </el-button-group>

      <el-button type="primary" @click="handldAdd">添加</el-button>
    </div>

    <div class="bot-class-r">
      <el-table
        :data="data"
        row-key="id"
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#fafafa' }"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="teamName" label="班组名称" align="center">
        </el-table-column>

        <el-table-column prop="ranksId" label="所属队伍" align="center">
        </el-table-column>

        <el-table-column prop="teamType" label="班组类型" align="center">
          <span slot-scope="text">
            <!--                        <a style="color:#18a6ff" >{{text.row.teamType ==='0'?'施工班组':'管理部门'}}</a>-->
            <a>{{ text.row.teamType === "0" ? "施工班组" : "管理部门" }}</a>
          </span>
        </el-table-column>

        <el-table-column prop="teamLeader" label="班组长" align="center">
        </el-table-column>

        <el-table-column prop="telephone" label="手机号" align="center">
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right">
          <span slot-scope="scope">
            <a @click="edit(scope.row)" style="color: #d6b200">修改</a>
            <el-divider direction="vertical"/>
            <el-popconfirm
              title="确认删除该条信息?"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @onConfirm="del(scope.row.id)"
              @onCancel="cancel"
            >
              <a slot="reference" style="color: red">删除</a>
            </el-popconfirm>
          </span>
        </el-table-column>
      </el-table>
      <el-pagination
        class="el-pagination"
        v-show="listQuery.total > 0"
        background
        layout="prev, pager, next"
        :current-page="listQuery.pageIndex"
        :page-size="listQuery.pageSize"
        @current-change="handleCurrentChange"
        :total="listQuery.total"
      >
      </el-pagination>
      <!-- <el-pagination
                style="text-align:right;margin-top:10px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="paginations.current"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="paginations.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="paginations.total">
            </el-pagination> -->
    </div>
    <addDialog ref="add" @success="query" :currentBuild="build"/>
  </div>
</template>

<script>
import addDialog from "./addDialog.vue";
import {deleteTtTeam, getPageTtTeam} from "@/views/labourManager/api/ttteam";

export default {
  components: {
    addDialog,
  },
  props: ["build"],
  data() {
    return {
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        buildId: null,
      },
      data: [],
    };
  },
  watch: {
    build: function () {
      this.query();
    },
  },
  computed: {},
  methods: {
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.query();
    },
    query() {
      (this.listQuery.buildId = this.build.id),
        getPageTtTeam(this.listQuery).then((res) => {
          if (res.code == "success") {
            this.data = res.data.records;
            this.listQuery.total = res.data.total;
          }
        });
    },
    cancel() {
    },
    del(id) {
      deleteTtTeam(id).then((res) => {
        if (res.code == "success") {
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.query();
        } else {
          this.errorMsg();
        }
      });
    },
    handldAdd() {
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
      this.$refs.add.open();
    },
    edit(row) {
      this.$refs.add.open(row);
    },
  },
};
</script>

<style lang="scss" scoped>
.class-r-center-con {
  padding: 20px 0;

  .top-btn-class-r {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    padding-bottom: 15px;
  }
}

.el-pagination {
  margin-top: 20px;
}
</style>

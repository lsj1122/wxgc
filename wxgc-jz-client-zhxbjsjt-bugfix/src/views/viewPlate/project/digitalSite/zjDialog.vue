<template>
  <!-- 人数识别 -->
  <el-dialog
    :close-on-click-modal="false"
    title="人数识别"
    :visible.sync="zjVisible"
    width="800"
    :before-close="handleClose"
    :modal-append-to-body="false"
  >
    <div>
      <el-table
        :data="tableData"
        v-loading="dataLoading"
        height="50vh"
        row-key="id"
        fit
      >
          <el-table-column type="index" label="序号" align="center" width="80">
          <template slot-scope="scope">
            {{
              scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
            }}
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center" prop="machineNum" />
        <el-table-column label="打卡时间" align="center" prop="uploadTime" />
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证" align="center">
        </el-table-column>


        <el-table-column prop="gender" label="性别" align="center">
             <template slot-scope="scope">
           {{scope.row.gender ==0?'男':scope.row.gender ==1?'女':''}}
          </template>
        </el-table-column>
        <el-table-column prop="cz" label="操作证号" align="center">
          <template slot-scope="scope">
           {{scope.row.cz ==null?'-':'-'}}
          </template>
        </el-table-column>

        <el-table-column prop="identityType" label="身份类型" align="center">
          <template slot-scope="scope">
            {{ handIdentityType(scope.row.identityType) }}
          </template>
        </el-table-column>

        <el-table-column prop="pictureUrl" label="考勤照片" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.pictureUrl"
              :preview-src-list="[scope.row.pictureUrl]"
            >
            </el-image>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        class="el-pagination"
        v-show="total > 0"
        background
        layout="prev, pager, next"
        :current-page.sync="listQuery.pageIndex"
        :page-size.sync="listQuery.pageSize"
        @current-change="pageChange"
        :total="total"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getPagePeopleMHistory } from "@/views/digitalConstructionSite/peopleIdentification/api/comment";

export default {
  components: { Pagination },
  props: {
    zjVisible: Boolean,
    deviceObj: Object,
  },
  data() {
    return {
      items: [],
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  watch: {
    zjVisible: function (val) {
      if (val) {
        this.$nextTick(() => {
          this.loadZjData();
        });
      }
    },
  },
  methods: {
    loadZjData() {
      getPagePeopleMHistory({
        machineNum: this.deviceObj.deviceNumber,
        ...this.listQuery,
      })
        .then((res) => {
          if (res.code == "success") {
            this.items = res.data.records;
            this.total = res.data.total;
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    handleClose() {
      this.$emit("update:zjVisible", false);
    },
     handIdentityType(identityType) {
      let name = "";
      if (identityType == 0) {
        name = "未知人员";
      }
      if (identityType == 1) {
        name = "塔机司机";
      }
      if (identityType == 2) {
        name = "检测人员";
      }
      if (identityType == 3) {
        name = "安拆人员";
      }
      if (identityType == 4) {
        name = "维保人员";
      }
      if (identityType == 5) {
        name = "塔机信号工";
      }
      if (identityType == 6) {
        name = "监理人员";
      }
      if (identityType == 7) {
        name = "项目经理";
      }
      if (identityType == 8) {
        name = "安全员";
      }
      return name;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table--border {
  border: none;
}
</style>

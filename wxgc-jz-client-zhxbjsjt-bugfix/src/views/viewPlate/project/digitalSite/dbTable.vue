<template>
  <el-dialog

    title="地磅"
    :visible.sync="dbTableShow"
    width="900"
    :before-close="handleClose"
    :modal-append-to-body="false"
  >
    <div>
      <el-table :data="items" height="500" border style="width: 100%" v-loading='loading'>
        <el-table-column prop="deviceNumber" label="地磅设备编号"  align="center"> </el-table-column>
        <el-table-column prop="poundRecordId" label="地磅记录ID" align="center"></el-table-column>
        <el-table-column prop="poundTime" label="过磅时间" align="center"></el-table-column>
        <el-table-column prop="weight" label="过磅总量" align="center"></el-table-column>
        <el-table-column prop="vehicleLicense" label="车辆信息" align="center"></el-table-column>



        <el-table-column prop="photoFront" label="车前过磅图片" align="center">
          <template slot-scope="scope">
            <el-image
             v-if="scope.row.photoFront"
              style="height:50px;width:50px"
              :src="scope.row.photoFront.split('?')[0]"
              :preview-src-list="[scope.row.photoFront.split('?')[0]]">
            </el-image>
              <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="photoAir" label="空中过磅图片" align="center">
          <template slot-scope="scope">
            <el-image
            v-if="scope.row.photoAir"
              style="height:50px;width:50px"
              :src="scope.row.photoAir.split('?')[0]"
              :preview-src-list="[scope.row.photoAir.split('?')[0]]">
            </el-image>
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="photoBehind" label="车后过磅图片" align="center">
          <template slot-scope="scope">
            <el-image
            v-if="scope.row.photoBehind"
              style="height:50px;width:50px"
              :src="scope.row.photoBehind.split('?')[0]"
              :preview-src-list="[scope.row.photoBehind.split('?')[0]]">
            </el-image>
              <span v-else>暂无图片</span>
          </template>
        </el-table-column>
          <el-table-column prop="videoUrl" label="过磅视频" align="center">
          <template slot-scope="scope">
             <a size="mini" v-if="scope.row.videoUrl" @click="huiFuLook(scope.$index, scope.row)"
                  >预览</a
                >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="el-pagination"
                     v-show="total>0"
                     background
                     layout="prev, pager, next"
                     :current-page.sync="listQuery.pageIndex" :page-size.sync="listQuery.pageSize"
                     @current-change="pageChange"
                     :total="total">
      </el-pagination>
    </div>
     <fileView ref="fileView" title="文件预览"></fileView>
  </el-dialog>
</template>

<script>
import moment from "moment";
import Pagination from '@/components/Pagination'
import {pageDB  } from "@/views/labourManager/api/ttattendance";
import fileView from "@/components/filePreview/filePreview.vue";

export default {
  components: { Pagination,fileView },
  props: {
    dbTableShow: Boolean,
      deviceItem: Object,
  },
  data() {
    return {
      loading:false,
      items: [],
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        // date: moment().format('yyyy-MM-DD')
      },
      total:0
    };
  },
  watch: {
    dbTableShow: function (val) {
      if (val) {
        this.$nextTick(() => {
          console.log('=================',this.deviceItem)
         this.listQuery.machineNumber = this.deviceItem.deviceNumber
        
          this.loadZjData();
        });
      }
    },
  },
  methods: {
    pageChange(page){
      this.listQuery.pageIndex = page
      this.loadZjData()
    },
    loadZjData() {
      this.loading =true
       console.log('1111111111,',this.listQuery)
      pageDB(this.listQuery).then(res=>{
        if(res.code=="success"){
          this.loading =false
          this.items=res.data.records;
          this.total=res.data.total;
        }
      }).catch(err=>{
            this.loading =false
        console.log(JSON.stringify(err))
      })
    },
    handleClose() {
      this.$emit("update:dbTableShow", false);
    },
      huiFuLook(index, row) {
        let type =row.videoUrl.split('?')[0]
      type = type.substring(row.videoUrl.lastIndexOf(".") + 1);
      this.$refs.fileView.show(row.videoUrl.split('?')[0], type); //(文件地址,文件类型)
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table--border {
  border: none;
}
/deep/ .v-modal{
  display: none !important;
}
</style>

 
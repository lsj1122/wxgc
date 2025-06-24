<template>
  <el-dialog
    title="在册总人数"
    :visible.sync="controlDisplay"
    width="60%"
  >
    <el-row>
      <el-cel style="margin-right: 20px">
        <span>班组：</span>
        <el-select v-model="listQuery.teamName" filterable clearable placeholder="请选择班组" @change='selectInfo'>
          <el-option
            v-for="(item,index) in optionsBanZu"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-cel>
      <el-cel style="margin-right: 20px">
        <span>工种：</span>
        <el-select v-model="listQuery.jobs" filterable clearable placeholder="请选择工种" @change='selectInfo'>
          <el-option
            v-for="(item,index) in optionsGongZhong"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-cel>
    </el-row>
    <!-- table 表格 -->
     <el-table
        :data="tableData"
        v-loading="dataLoading"
        row-key="id"
        height="500"
        fit
        @selection-change="changeCheckBoxValue"
        style="margin-top:10px"
      >
        <!-- <el-table-column min-width="140" type="selection"></el-table-column> -->
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>

        <el-table-column
          prop="teamName"
          label="班组"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="jobs" label="工种" align="center">
        </el-table-column>
         <el-table-column prop="idCard" label="身份证号" align="center">
        </el-table-column>


        <el-table-column prop="telephone" label="手机号" align="center">
        </el-table-column>

      </el-table>

      <!--分页  -->
       <el-pagination
      class="el-pagination"
      v-show="total > 0"
      background
      layout="prev, pager, next"
      :current-page.sync="listQuery.pageIndex"
      :page-size.sync="listQuery.pageSize"
      @current-change="loadPageData"
      :total="total"
    >
    </el-pagination>

    <span slot="footer" class="dialog-footer">
      <el-button @click="controlDisplay = false">取 消</el-button>
      <!-- <el-button type="primary" @click="controlDisplay = false"
        >确 定</el-button
      > -->
    </span>
  </el-dialog>
</template>

<script>
import data from '@/views/pdf/content.js';
import {getTableChuQing,getBanZuSelect,getDanWeiSelect,getGongZhongSelect} from '../api/gzmapi.js'
export default {
  props: {
    detdata: {
      type: Object,
    },
    detialData: {
      type: Object,
    },
  },
  data() {
    return {
      controlDisplay: false,
       total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
         buildName: '',//参建单位name
       teamName:'',// 所属班组name
         jobs: '',//工种

      },
      tableData:[],
      optionsDanWei: [],
      optionsBanZu:[],
      optionsGongZhong:[],
      value: "",
    };
  },
  mounted(){

  },
  methods: {
    selectInfo(){
      this.listQuery.pageIndex =1
      this.loadPageData()
    },
    showBox() {
      this.controlDisplay = !this.controlDisplay;
      if(this.controlDisplay){
          //加载分页数据
         this.listQuery  ={
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
         buildName: '',//参建单位id
       teamName:'',//teamId 所属班组id
         jobs: '',//工种

      }

       this.loadPageData();
       // 三个下拉的数据
       this.getSelect();

      }
    },
    getSelect(){

      //企业单位
      getDanWeiSelect().then(res=>{
        // console.log('单位',res)
        this.optionsDanWei =res
      })
      // 班组
      getBanZuSelect().then(res=>{
        console.log('班组',res)
        this.optionsBanZu =res
      })
      // 工种
      getGongZhongSelect( {
        //搜索条件
        pageIndex: 1,
        pageSize: -1,

      }).then(res=>{
        // console.log('工种',res)
        this.optionsGongZhong =res
      })


    },
    loadPageData(){
       getTableChuQing(this.listQuery).then(res=>{
        //  console.log(res)
         this.tableData =res.data.records
          this.total = res.data.total;
       })
    }
  },
};
</script>

<style>
</style>

<template>

  <div class="hikvision-ui">
    <el-card class="box-card">

      <el-row :gutter="20" style="height: 100%;">
        <el-col :span="6"  style="height: 100%;">
          <div class="grid-content bg-purple"
               @contextmenu.prevent.stop="()=>{return false;}"
          >
            <div class="title">区域信息(右键操作)</div>
            <el-tree
              :props="props"
              :load="loadNode"
              lazy
              show-checkbox
              @check-change="handleCheckChange"
              @node-contextmenu="openMenu"
            >
            </el-tree>
          </div>
        </el-col>
        <el-col :span="18" style="height: 100%;"
                v-loading="dataLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.4)"
        >
          <div class="grid-content bg-purple">
            <!--搜索框-->
            <el-form :inline="true"  class="demo-form-inline">
              <el-form-item label="搜索区域">
                    {{rightData?rightData.name:'未指定'}}
              </el-form-item>
              <el-form-item label="资源名称">
                <el-input v-model="listQuery.name" placeholder="不限" ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                  {{ $t('table.search') }}
                </el-button>
              </el-form-item>

            </el-form>
            <div  style="width: 100%; height: 89%; overflow: auto">
              <el-table
                :data="tableData"
                style="width: 100%;"
                row-key="indexCode"
                fit
                highlight-current-row
              >
                <!--  后台返回实时地址时候采用预览          -->
                <el-table-column type="expand" >
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item :label="o.protocol+'(永久地址)'" v-for="o in props.row.videoUrls" >
                        <div v-for="l in o.links" >协议:【{{l.protocol}}】
                          URL:<span style="color: #1890ff">{{l.url}}
                        <el-button  v-if="isView(o.protocol,l.protocol)" size="mini" type="primary" plain @click="openLive(props.row.name,l.url,props.row.indexCode)" >实时预览</el-button>
                      </span>
                        </div>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>


                <el-table-column
                  fixed
                  prop="id"
                  label="序号"
                  align="center"
                  width="80"
                >
                  <template slot-scope="scope">
                    <!--     循环次数+(当前页码-1) * 每页显示数据条数 +1         -->
                    {{scope.$index+(listQuery.pageIndex - 1) * listQuery.pageSize + 1}}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="name"
                  label="资源名称"
                  width="180">
                </el-table-column>

                <el-table-column
                  prop="indexCode"
                  label="资源唯一标识"
                  width="180">
                </el-table-column>

                <el-table-column
                  prop="regionPathName"
                  label="所属区域"
                >
                </el-table-column>

                <el-table-column
                  prop="createTime"
                  label="对接日期"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="updateTime"
                  width="180"
                  label="最后修改日期">
                </el-table-column>

                <el-table-column
                  prop="status"
                  width="80"
                  label="状态">
                </el-table-column>

                <el-table-column label="预览(临时获取)">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      plain
                      type="primary"
                      @click="openLive(scope.row.name,scope.row.indexCode,scope.row.indexCode)"
                    >在线预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!--分页组件-->
            <el-pagination class="el-pagination"
                           v-show="total>0"
                           background
                           layout="total,sizes,prev, pager, next"
                           :current-page.sync="listQuery.pageIndex" :page-size.sync="listQuery.pageSize"
                           @current-change="loadPageData"
                           @size-change="loadPageData"
                           :total="total">
            </el-pagination>

          </div>
        </el-col>
      </el-row>

    </el-card>

    <!-- 右键菜单 -->
    <rightMenu ref="rightMenu" :menuData="menuData" @click="menuClick"></rightMenu>



    <el-dialog
      :title="viewTitle"
      :visible.sync="dialogVisible"
      width="50%"
      >
        <viewPaly v-if="dialogVisible" :url="playUrl" :showCtr="true" :cameraIndexCode="cameraIndexCode"></viewPaly>

      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
  </span>
    </el-dialog>

  </div>

</template>

<script>
import  rightMenu  from '@components/JGRightMenu'
import  viewPaly  from '@components/JGHikvision'
import {getResources, getRootRegion, getSubRegions} from "@components/JGHikvision/api/hikvision";

export default {
  name: "index",
  components:{rightMenu,viewPaly},
  data() {
    return {
      props: {
        label: 'name',
        children: 'children'
      },
      menuData:[
        { text: "查看监控资源", customEvent: "look",icon: 'el-icon-circle-plus'},
        { text: "关闭菜单", customEvent: "close",icon: 'el-icon-circle-close'}
      ],
      rightData:null,
      tableData: [],
      total: 0,
      listQuery: { //搜索条件
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        regionIndexCodes:[],
      },
      dataLoading:false,
      viewTitle:'',
      playUrl:'',
      cameraIndexCode:'',
      dialogVisible:false,
    };
  }, methods: {
    isView(protocol,type){
      if(protocol=='TCP'){
        let loc=window.location+"";
        if(type.includes('hls')&&loc.includes("http://")){
           return true;
        }else if(type.includes('hlss')&&loc.includes("https://")){
          return true;
        }
      }
     return  false
    },
    getUrlStr(cameraIndexCode){
          return location.protocol+"//"+location.host+process.env.VUE_APP_BASE_API+"/system/wxgc/hikvision/video/select/url/"+cameraIndexCode+"?X-Wxgc-Token="+this.$store.getters.token;
    },
    openLive(name,url,cameraIndexCode){
        this.viewTitle="正在实时预览【"+name+"】";
        this.playUrl=url;
        this.cameraIndexCode=cameraIndexCode;
        this.dialogVisible=true
    },
    //搜索
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.loadPageData()
    },
    //分页查询
    loadPageData(){
      this.dataLoading=true;
      this.listQuery.regionIndexCodes=[this.rightData.indexCode];
      getResources(this.listQuery).then(res=>{
        if(res.code=="success"){
          this.tableData=res.data.list;
          this.total=res.data.total;
        }
        this.dataLoading=false;
      }).catch(err=>{
        this.dataLoading=false;
      })
    },
    menuClick(item){
      this.editEvent=item.customEvent;
      if(item.customEvent=="look"){ //查
        this.loadPageData()
      }
    },
    openMenu(event,data){
      this.rightData=data;
      this.$refs.rightMenu.open(event)
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    //动态加载
    loadNode(node, resolve) {
      if (node.level === 0) { //根节点加载
        getRootRegion().then(res=>{
          return resolve([res.data]);
        }).catch(err=>{
          return resolve [{ name: '暂无区域(智慧工地小组创建)' }];
        })
      }else{
        getSubRegions({parentIndexCode:node.data.indexCode}).then(res=>{
          if(res.code=="success"){
            return resolve(res.data.list);
          }
        }).catch(err=>{
          return resolve ([]);
        })
      }
    }
  }
}
</script>

<style scoped  lang="scss">

.hikvision-ui{
  padding: 10px;
  /*实现容器铺满*/
  position: absolute;
  height:100%;width:100%;
  .el-card{
    height: 100%;
    ::v-deep .el-card__body{
      height: 100%;

    }
  }
  ::v-deep .el-tree{
    background-color: transparent;
  }

  .bg-purple {
    background: #d3dce6;

  }
  .grid-content {
    border-radius: 4px;
    padding: 5px;
    overflow: auto;
    height:100%;
  }
  .title{
    background-color: #1890ff;
    line-height: 30px;
    color: white;
    padding-left: 5px;
    border-radius: 5px;
  }

  ::v-deep .el-dialog__body{
    height: 50vh;
    padding: 0px;
  }
}
</style>

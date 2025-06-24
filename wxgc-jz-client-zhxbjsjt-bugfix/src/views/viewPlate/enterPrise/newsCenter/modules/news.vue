<template>
  <div class="newsBox">
    <div class="ul">
      <!-- <div
        class="li"
        v-for="(item, index) in arr"
        :key="index"
        :class="{ active: isActive == index }"
        @click="choose(index)"
      >
        <div><img :src="item.imgurl" alt="" /></div>
        <span class="itemname">{{ item.name }}</span>
      </div> -->

      <el-carousel class="lunbo" :interval="5000" arrow="always">
        <el-carousel-item>
          <div
            class="li"
            v-for="(item, index) in arr"
            :key="index"
            :class="{ active: isActive == item.value }"
            @click="choose(item.value)"
          >
            <div><img :src="item.imgurl" alt="" /></div>
            <span class="itemname">{{ item.name }}</span>
          </div>
        </el-carousel-item>

        <el-carousel-item>
          <div
            class="li"
            v-for="(item, index) in arr2"
            :key="index"
            :class="{ active: isActive == item.value}"
            @click="choose(item.value)"
          >
            <div><img :src="item.imgurl" alt="" /></div>
            <span class="itemname">{{ item.name }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div
        class="li"
        style="
          width: 200px;
          height: 50px;
          position: absolute;
          top: 30%;
          right: 5%;
        "
        @click="dialogVisible = true"
      >
        上传文件
      </div>
    </div>

    <!-- 上传添加 新闻中心 -->
    <el-dialog
      title="编辑新闻中心"
      :visible.sync="dialogVisible"
      width="45%"
      :modal-append-to-body="false"
      :before-close="closeDialog"
    >
      <div class="addContent">
        <p>
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">选择上传类型</span>
        </p>
        <p>
          <el-select v-model="fOutvalue" placeholder="请选择类型">
            <el-option
              v-for="item in options2"
              :key="item"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">填写标题</span>
        </p>
        <p>
          <el-input
            type="text"
            :rows="8"
            placeholder="请输入内容"
            v-model="form.title"
          >
          </el-input>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">填写内容</p>
        <p>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="form.textarea"
          >
          </el-input>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">选择文件</p>
        <div>
          <!--                        <uploadcom title="上传文件" @uploading="upfile" style="display:inline-block" ref="up"/>-->
          <upload-file
            file-type="*"
            ref="clearData"
            multiple
            list-type="*"
            accept="*"
            max-size="100"
            @change="getFile"
          />
        </div>
      </div>

      <div class="newcenter-right">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          @click="submit('添加')"
          v-loading="loading"
          element-loading-text="拼命加载中"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 表格  -->
    <div class="alarm_Box-table">
      <el-table
        :data="tableData"
        stripe
        :header-cell-style="{ background: 'rgba(164, 229, 225, 0.05)' }"
        style="width: 100%"
      >
        <el-table-column prop="sort" label="序号" align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          align="center"
          :formatter="stateFormat"
        >
        </el-table-column>
        <el-table-column prop="createBy" align="center" label="创建人">
        </el-table-column>
        <el-table-column prop="projectName" align="center" label="项目名称">
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              style="border: 0"
              >查看</el-button
            >
            <el-button
              size="mini"
              @click="handleEditBianJi(scope.$index, scope.row)"
              style="border: 0"
              >编辑</el-button
            >
            <el-button
              size="mini"
              @click="handleEditJianCha(scope.$index, scope.row)"
              style="border: 0"
              >检查</el-button
            >
            <el-button
              size="mini"
              @click="deleteEditJianCha(scope.$index, scope.row)"
              style="border: 0"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 查看的内容 -->
    <el-dialog
      title="查看具体信息"
      :visible.sync="dialogVisible2"
      width="45%"
      :modal-append-to-body="false"
    >
      <!-- 查看 -->
      <div class="addContent" v-if="dialogVisible2Show == 0">
        <p style="color: rgba(255, 255, 255, 0.5)">
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">序号</span>
        </p>
        <p>
          <el-input
            type="text"
            :rows="8"
            placeholder="暂无"
            v-model="form2.sort"
            :disabled="disabledType"
          >
          </el-input>
        </p>

        <p>
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">上传类型</span>
        </p>
        <p>
          <el-input
            placeholder="暂无"
            v-model="form2.input"
            :disabled="disabledType"
          ></el-input>
        </p>

        <p style="color: rgba(255, 255, 255, 0.5)">
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">填写标题</span>
        </p>
        <p>
          <el-input
            type="text"
            :rows="8"
            placeholder="暂无"
            v-model="form2.title"
            :disabled="disabledType"
          >
          </el-input>
        </p>

        <p style="color: rgba(255, 255, 255, 0.5)">填写文字内容</p>
        <p>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="暂无"
            v-model="form2.textarea"
            :disabled="disabledType"
          >
          </el-input>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">文件下载</p>
        <p style="color: rgba(255, 255, 255, 0.5)">
          <el-button @click="onDown()" v-if="form2.fileUrl ? true : false"
            >点击下载相应文件</el-button
          >
          <el-button v-else disabled>暂无下载文件</el-button>
        </p>
      </div>
      <!-- 编辑 -->
      <div class="addContent" v-if="dialogVisible2Show == 1">
        <p style="color: rgba(255, 255, 255, 0.5)">
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">序号</span>
        </p>
        <p>
          <el-input
            type="text"
            :rows="8"
            placeholder="请输入序号"
            v-model="form.sort"
          >
          </el-input>
        </p>

        <p>
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">选择上传类型</span>
        </p>
        <p>
          <el-select v-model="fOutvalue" placeholder="请选择类型">
            <el-option
              v-for="item in options2"
              :key="item"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">填写标题</span>
        </p>
        <p>
          <el-input
            type="text"
            :rows="8"
            placeholder="请输入内容"
            v-model="form.title"
          >
          </el-input>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">填写内容</p>
        <p>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="form.textarea"
          >
          </el-input>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">选择文件</p>
        <div>
          <!--                        <uploadcom title="上传文件" @uploading="upfile" style="display:inline-block" ref="up"/>-->
          <upload-file
            file-type="*"
            ref="clearData"
            multiple
            list-type="*"
            accept="*"
            max-size="100"
            @change="getFile"
          />
        </div>
      </div>
      <!-- 检查 -->
      <div class="addContent" v-if="dialogVisible2Show == 2">
        <el-table
          :data="huiFuitableData"
          v-loading="dataLoading"
          row-key="id"
          height="450px"
        >
          <el-table-column prop="id" label="序号" align="center">
          </el-table-column>

          <el-table-column prop="projectId" label="所属项目" align="center">
          </el-table-column>
          <el-table-column prop="fileName" label="文件" align="center">
          </el-table-column>

          <el-table-column prop="remake" label="备注" align="center">
          </el-table-column>

          <el-table-column prop="uploadName" label="上传人" align="center">
          </el-table-column>

          <el-table-column prop="uploadTime" label="上传时间" align="center">
          </el-table-column>

          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="huiFuLook(scope.$index, scope.row)"
                style="border: 0; color: #1990fc"
                >查看</el-button
              >
              <el-button
                size="mini"
                @click="huiFuUpload(scope.$index, scope.row)"
                style="border: 0; color: #1990fc"
                >下载</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!--分页组件-->
        <el-pagination
          class="el-pagination"
          v-show="total > 0"
          background
          layout="prev, pager, next"
          :current-page.sync="listQuery.pageIndex"
          :page-size.sync="listQuery.pageSize"
          @current-change="loadPageData($event)"
          :total="total"
        >
        </el-pagination>
      </div>
      <div class="newcenter-right">
        <el-button @click="dialogVisible2 = false">返回</el-button>
        <el-button
          @click="submit('编辑')"
          v-loading="loading"
          element-loading-text="拼命加载中"
          v-if="!disabledType"
          >编辑</el-button
        >
      </div>
    </el-dialog>
    <fileView ref="fileView" title="文件预览"></fileView>
  </div>
</template>

<script>
import { simpleUploadsReturnTtFile } from "@/views/sysproject/api/ttfile";
import uploadFile from "@/components/Upload/uploadFile";
import { handleBatchDownload } from "@/utils/zipDownFile";

import {
  newsList,
  addTtNewsCenter,
  editNewsCenter,
  getPageHuiFui,
  deletePageHuiFui,
} from "@/views/viewPlate/enterPrise/api/newsCenter";
import fileView from "@/components/filePreview/filePreview.vue";
export default {
  props: {},
  components: {
    uploadFile,
    fileView,
  },
  data() {
    return {
      /// 检查模块
      total: 1, // 默认总数0
      dataLoading: false,
      listQuery: {
        // 查看回复的 分页,
        pageIndex: 1,
        pageSize: 5,
        CId: "",
      },
      huiFuitableData: [],
      fuiFuTitle: "查看具体信息",
      clickRow: {},
      ///
      files: [],
      dialogVisible: false, // 上传文件
      dialogVisible2: false, // 查看
      dialogVisible2Show: 0,
      fileList:[],
      disabledType: true, //默认是查看不能点击
      // options2: [
      //   "政策法规",
      //   "典型案例",
      //   "会议通知",
      //   "管理制度",
      //   "培训文件",
      // ],
      options2: [
        { name: "政策法规", value: 0 },
        { name: "典型案例", value: 1 },
        { name: "会议通知", value: 2 },
        // { name: "管理制度", value: 3 },
        { name: "培训文件", value: 4 },

        { name: "隐患整改", value: 5 },
        { name: "周报", value: 6 },
        { name: "制度性文件", value: 7 },
        { name: "月度分析报告", value: 8 },
        { name: "新闻稿", value: 9 },
      ],
       optionsOld: [
       { name: "政策法规", value: 0 },
        { name: "典型案例", value: 1 },
        { name: "会议通知", value: 2 },
        { name: "管理制度", value: 3 },
        { name: "培训文件", value: 4 },
        { name: "隐患整改", value: 5 },
        { name: "周报", value: 6 },
        { name: "制度性文件", value: 7 },
        { name: "月度分析报告", value: 8 },
        { name: "新闻稿", value: 9 },
      ],
      fOutvalue: "", //选择得到的
      tableData: [],
      isActive: 0, // 默认0,
      arr: [
        {
          name: "政策法规",
          imgurl: require("../../../../../assets/compent/news1.png"),
          value: 0
        },
        {
          name: "典型案例",
          imgurl: require("../../../../../assets/compent/news2.png"),
          value: 1
        },
        {
          name: "会议通知",
          imgurl: require("../../../../../assets/compent/news3.png"),
          value: 2
        },
        // {
        //   name: "管理制度",
        //   imgurl: require("../../../../../assets/compent/news4.png"),
        //   value: 3
        // },
        {
          name: "培训文件",
          imgurl: require("../../../../../assets/compent/news5.png"),
           value: 4
        },
      ],
      arr2: [
        {
          name: "隐患整改",
          imgurl: require("../../../../../assets/compent/news6.png"),
          value: 5
        },
        {
          name: "周报",
          imgurl: require("../../../../../assets/compent/news7.png"),
          value: 6
        },
        {
          name: "制度性文件",
          imgurl: require("../../../../../assets/compent/news8.png"),
          value: 7
        },
        {
          name: "月度分析报告",
          imgurl: require("../../../../../assets/compent/news9.png"),
          value: 8
        },
        {
          name: "新闻稿",
          imgurl: require("../../../../../assets/compent/news10.png"),
          value: 9
        },
      ],
      form: {
        // 上传文件
        title: "",
        textarea: "",
        filePath: "",
        sort: "",
        fileUrl: "",
        id: "",
      },
      form2: {
        // 查看
        title: "",
        input: "",
        textarea: "",
        fileUrl: "",
        sort: "",
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    stateFormat(row, column, cellValue) {
      if (!cellValue) return "";
      if (cellValue.length > 30) {
        //最长固定显示10个字符
        return cellValue.slice(0, 30) + "...";
      }
      return cellValue;
    },
    getList() {
      newsList({ type: this.isActive }).then((res) => {
        if (res.code == "success") {
          this.tableData = res.data;
        }
      });
    },
    choose(index) {
     
      this.isActive = index;
      this.getList();
    },
    // 查看的方法
    handleEdit(index, row) {
      this.disabledType = true;
      this.dialogVisible2Show = 0;
      this.fuiFuTitle = "查看具体内容";
      this.switch()
      this.form2.textarea = row.text;
      this.form2.title = row.title;
      this.form2.fileUrl = row.fileUrl;
      this.form2.sort = row.sort;

      this.dialogVisible2 = true;
    },
    switch(){
       switch (this.isActive) {
        case 0:
           this.fOutvalue = this.optionsOld[0].name;
           this.form2.input = this.optionsOld[0].name;
          break;
        case 1:
           this.fOutvalue = this.optionsOld[1].name;
           this.form2.input = this.optionsOld[1].name;
          break;
         case 2:
           this.fOutvalue = this.optionsOld[2].name;
           this.form2.input = this.optionsOld[2].name;
          break;
         case 3:
           this.fOutvalue = this.optionsOld[3].name;
           this.form2.input = this.optionsOld[3].name;
          break;
         case 4:
           this.fOutvalue = this.optionsOld[4].name;
           this.form2.input = this.optionsOld[4].name;
          break;
           case 5:
           this.fOutvalue = this.optionsOld[5].name;
           this.form2.input = this.optionsOld[5].name;
          break;
           case 6:
           this.fOutvalue = this.optionsOld[6].name;
           this.form2.input = this.optionsOld[6].name;
          break;
           case 7:
           this.fOutvalue = this.optionsOld[7].name;
           this.form2.input = this.optionsOld[7].name;
          break;
           case 8:
           this.fOutvalue = this.optionsOld[8].name;
           this.form2.input = this.optionsOld[8].name;
          break;
           case 9:
           this.fOutvalue = this.optionsOld[9].name;
           this.form2.input = this.optionsOld[9].name;
          break;
      }
    },
    switch2(){
       switch (this.fOutvalue) {
        case '政策法规':
           this.fOutvalue = 0;
          break;
        case '典型案例':
           this.fOutvalue = 1;
          break;
         case '会议通知':
           this.fOutvalue = 2;
          break;
         case '管理制度':
           this.fOutvalue = 3;
          break;
         case '培训文件':
           this.fOutvalue = 4;
          break;
           case '隐患整改':
           this.fOutvalue = 5;
          break;
           case '周报':
           this.fOutvalue = 6;
          break;
           case '制度性文件':
           this.fOutvalue = 7;
          break;
           case '月度分析报告':
           this.fOutvalue = 8;
          break;
           case '新闻稿':
           this.fOutvalue = 9;
          break;
      }
    },
    //编辑的方法
    handleEditBianJi(index, row) {
      this.disabledType = false;
      this.dialogVisible2Show = 1;
      this.fuiFuTitle = "查看具体内容";
      this.switch()
     

     
      this.form.title = row.title;
      this.form.textarea = row.text;
      this.form.sort = row.sort;
      this.form.fileUrl = row.fileUrl;
      this.form.id = row.id;
      this.dialogVisible2 = true;
    },
    handleEditJianCha(index, row) {
      this.dialogVisible2Show = 2;
      this.dialogVisible2 = true;
      this.fuiFuTitle = "查看检查内容";

      //
      this.clickRow = row;
      // 查看分页的回复
      this.loadPageData();
    },
    deleteEditJianCha(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePageHuiFui(row.id).then((res) => {
            if (res.code == "success") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message.error("删除失败");
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    loadPageData() {
      this.listQuery.CId = this.clickRow.id;
      this.dataLoading = true;
      // alert(index)
      getPageHuiFui(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.huiFuitableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    // 检查 ，预览
    huiFuLook(index, row) {
      let type = row.fileUrl.substring(row.fileUrl.lastIndexOf(".") + 1);
      this.$refs.fileView.show(row.fileUrl, type); //(文件地址,文件类型)
    },
    // 检查的下载
    huiFuUpload(index, row) {
      console.log(row.fileUrl);
      if (row.fileUrl.length > 0) {
        var arr = [];
        arr.push(row.fileUrl);
        handleBatchDownload(arr);
      } else {
        alert("暂无上传文件");
      }
    },

    getFile(file, fileList) {
      this.fileList = [];
      // console.log(178, fileList);
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
        //   console.log(fileList[i].raw)
      }
      this.fileList = fd;
      console.log(this.fileList);
      for (var [a, b] of fd.entries()) {
        // console.log(a, b);
      }
      // this.form.filePath =''
      // simpleUploadsReturnTtFile(this.fileList).then(res=>{
      //   console.log(res)
      //   // TODO 返回文件格式有问题
      //     if(res[0].filePath){
      //       this.form.filePath =   res[0].filePath
      //     }
      //   })
    },
    onDown() {
      // 压缩下载接口
      if (this.form2.fileUrl.length > 0) {
        var arr = [];
        arr.push(this.form2.fileUrl);
        handleBatchDownload(arr);
      } else {
        alert("暂无上传文件");
      }
    },
    submit(typeS) {
      // alert(this.$store.state.user.name)
      // alert(this.fOutvalue)
      if (this.fOutvalue.length <= 0) {
        this.$message({
          message: "请选择上传类型",
          type: "warning",
        });
        return;
      }else{
        this.switch2()
      }
      
      // console.log(this.fOutvalue)
      if (!this.form.title) {
        this.$message({
          message: "请填写标题",
          type: "warning",
        });
        return;
      }

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      var obj = {
        title: this.form.title,
        text: this.form.textarea,
        type: this.fOutvalue,
        create_by: this.$store.state.user.name,
        file_url: "",  // 上传需要的地址字段
        fileUrl:this.form.fileUrl  // 编辑需要的地址字段
      };
     
     
      if (this.fileList) {
        simpleUploadsReturnTtFile(this.fileList).then((res) => {
          console.log(res);
          // TODO 返回文件格式有问题
          if (res) {
            obj.file_url = res[0].filePath;
             obj.fileUrl = res[0].filePath;
            // console.log(obj);
          }
          if (typeS == "添加") {
            console.log(obj)
            
            addTtNewsCenter(obj).then((res) => {
              loading.close();
              this.clearDialogData();
              this.dialogVisible = false;
              // 重新请求数据
              this.getList();
            });
          } else if (typeS == "编辑") {
            obj.sort = this.form.sort;
          obj.id = this.form.id;
           obj.type = this.fOutvalue ;
            editNewsCenter(obj).then((res) => {
              loading.close();
              this.clearDialogData();
              this.dialogVisible2 = false;
              // 重新请求数据
              this.getList();
            });
          }
        });
      } 

     
    },
    // 清空弹框数据
    clearDialogData() {
      this.form = {
         title: "",
        textarea: "",
        filePath: "",
        sort: "",
        fileUrl: "",
        id: "",
      };
      // 清空存放 文件的字段
       this.fileList = [];
      this.fOutvalue = "";
      this.$nextTick(() => {
        this.$refs.clearData.clearData();
      });
    },
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false;
      this.clearDialogData();
    },
  },
};
</script>

<style lang="less" scoped>
.newsBox .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: transparent;
}
.newsBox .el-table {
  /deep/.el-table__row--striped td {
    background-color: rgba(164, 229, 225, 0.05);
  }
}
</style>

<style lang="less" scoped>
.newcenter-right {
  float: right;
}
.newsBox {
  width: 100%;
  height: 100%;
  // min-height: 600px;
}
.ul {
  position: relative;
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: left;
  align-items: center;

  .li {
    width: 240px;
    height: 100px;
    background: #040923;
    border-radius: 10px;
    border: 1px solid #0f5b91;
    cursor: pointer;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    img {
      width: 65px;
      height: 65px;
      border-radius: 10px;
    }
  }
  .li:nth-child(4),
  .li:nth-child(5) {
    div {
      width: 65px;
      height: 65px;
      border-radius: 20px;
      background-color: rgba(176, 135, 172, 0.25);
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
  li:nth-child(5) {
    div {
      background-color: rgba(168, 137, 134, 0.25);
    }
  }
  .active {
    border: 1px solid #0096ff;
    box-shadow: 0px 0px 8px 1px #0096ff;
  }
}

.alarm_Box-table {
  height: calc(73.8vh - 120px);
  margin-top: 24px;
  overflow: auto;
  // background-color: #fff;
}

// 新闻中心添加
/deep/.el-dialog {
  background: #00081f;
  padding: 0 10px;
  width: 45%;

  border: 1px solid #0096ff;

  .el-dialog__header {
    padding: 0;
    .el-dialog__title {
      display: inline-block;
      width: 100%;
      text-align: center;
      margin-top: 20px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .el-dialog__body {
    .addContent {
      .el-select {
        width: 100%;
      }
    }
  }
  .selectCondition {
    padding: 0;
    li {
      display: flex;
      justify-content: left;
      height: 40px;
      margin: 20px 0;
      span {
        width: 80px;
        line-height: 40px;
      }
      input {
        outline-style: none;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 13px 14px;
        padding: 5px 10px;
        font-size: 14px;
        flex: 1;
      }
      input:focus {
        border-color: #66afe9;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
          0 0 8px rgba(102, 175, 233, 0.6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
          0 0 8px rgba(102, 175, 233, 0.6);
      }
    }
  }
}

.fujian-clarifi {
  height: 29px;
  a {
    color: deepskyblue;
    cursor: pointer;
  }
  span {
    color: rgb(179, 179, 179);
    margin-left: 10px;
  }
}
.itemname {
  font-size: 16px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
}
.el-pagination {
  text-align: center;
}

.lunbo {
  width: 80%;
  height: 150px;
  /deep/.el-carousel__container {
    height: 100%;
  }
  /deep/.el-carousel__item {
    width: 100%;
    padding: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  /deep/.el-carousel__arrow {
    background-color: rgba(31, 45, 61, 0.8);
  }
  /deep/.el-carousel__indicators--horizontal {
    display: none;
  }
}
</style>
<template>
  <div>
    <el-card class="box-card">
      <div class="shuliang">
        项目已完成危险源上传数 <span class="span1">16</span
        ><span class="span3">|</span> 项目未完成危险源上传数
        <span class="span2">100</span>
      </div>
      <div class="project">
        <ul>
          <li @click="showTble(1)"><i class="yuandian"></i>基坑工程</li>
          <li @click="showTble(2)"><i class="yuandian"></i>钢筋工程</li>
          <li @click="showTble(3)"><i class="yuandian huangse"></i>模板工程</li>
          <li><i class="yuandian"></i>脚手架工程</li>
          <li><i class="yuandian"></i>砌体工程</li>
          <li><i class="yuandian"></i>装饰装修工程</li>
          <li><i class="yuandian"></i>电气工程</li>
          <li><i class="yuandian"></i>集排水及采暖工程</li>
          <li><i class="yuandian"></i>有限空间作业</li>
          <li><i class="yuandian"></i>动火作业</li>
          <li><i class="yuandian"></i>装配式建筑工程</li>
          <li><i class="yuandian"></i>钢结构工程</li>
          <li><i class="yuandian"></i>网架工程</li>
          <li><i class="yuandian"></i>起重机设备使用</li>
          <li><i class="yuandian"></i>施工升降机</li>
          <li><i class="yuandian"></i>塔式启动机</li>
        </ul>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="workname" label="作业活动名称">
        </el-table-column>
        <el-table-column prop="content" label="作业活动内容"> </el-table-column>
        <el-table-column prop="area" label="区域/部位"> </el-table-column>
        <el-table-column prop="hz" label="活动频率"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- slot-scope="scope" -->
            <el-button type="text" @click.native.prevent="redactDialog = true"
              >编辑
            </el-button>
            <el-button
              type="text"
              @click.native.prevent="uploadingDialog = true"
              >上传
            </el-button>
            <el-button type="text" @click.native.prevent="manageDialog = true"
              >处理
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="项目已完成危险源" align="center">
           <template slot-scope="scope">
             <div class="fangkuai" v-if="scope.row.content!='机械挖土'"></div>
             <div class="fangkuai2" v-if="scope.row.content=='机械挖土'"></div>
           </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="编辑进度计划"
      :visible.sync="redactDialog"
      width="30%"
      center
    >
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="redactDialog = false">取 消</el-button>
        <el-button type="primary" @click="redactDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="资料上传"
      :visible.sync="uploadingDialog"
      width="30%"
      center
    >
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          请选择上传的文件，且不超过20MB
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadingDialog = false">取 消</el-button>
        <el-button type="primary" @click="uploadingDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="处理危险源"
      :visible.sync="manageDialog"
      width="30%"
      center
    >
      <div class="box12">
        <div class="lleft">
          <div>处理状态</div>
          <div>未处理</div>
        </div>
        <div class="switch">
          <div>操作</div>
          <el-switch
            v-model="switchValue"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="manageDialog = false">取 消</el-button>
        <el-button type="primary" @click="manageDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import data from "./mock.json";
export default {
  mounted() {
    console.log(data.jkgc);
    this.tableData = data.jkgc;
  },
  data() {
    return {
      switchValue: true,
      manageDialog: false,
      redactDialog: false,
      uploadingDialog: false,
      tableData: [],
      date: "",
    };
  },
  methods: {
    showTble(index) {
      if (index == 1) {
        this.tableData = data.jkgc;
      }
      if (index == 2) {
        this.tableData = data.gjgc;
      }
      if (index == 3) {
        this.tableData = data.mbgc;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.box-card {
  width: 100%;
  height: 100%;
  .shuliang {
    margin-left: 30px;
    .span1 {
      font-size: 30px;
      color: #3effa0;
    }
    .span2 {
      font-size: 30px;
      color: #ffd53f;
    }
    .span3 {
      margin: 0 20px;
    }
  }
}
.project {
  ul {
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    li {
      display: flex;
      flex-wrap: wrap;
      width: 12%;
      height: 100px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      cursor: pointer;
      i {
        margin-bottom: 10px;
      }
    }
  }
  .yuandian {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background-color: #0cd013;
    border-radius: 100%;
    border: 3px solid #dcd6d9;
  }

}
.fangkuai {
  width: 20px;
  height: 20px;
  background-color: #10fd03;
  border: 1px solid #797979;
  margin: 0 auto;
  padding: 3px;
}
.fangkuai2 {
  width: 20px;
  height: 20px;
  background-color: #FDC403;
  border: 1px solid #797979;
  margin: 0 auto;
  padding: 3px;
}
.huangse {
  background-color: #ff9418 !important;
}
.box12 {
  margin: 0 auto;
  width: 50%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lleft,
.switch {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 10%;
  align-items: center;
  height: 50px;
}
.lleft div:nth-child(2) {
  color: red;
}
</style>
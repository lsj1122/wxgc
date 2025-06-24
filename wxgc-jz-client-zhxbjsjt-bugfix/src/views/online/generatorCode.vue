<template>
    <div class="main">

      <el-row :gutter="12">
        <el-col :span="12" >

          <el-card class="box-card" shadow="hover" >
            <div slot="header" class="clearfix">
              <span><i class="el-icon-edit" /> 代码生成选项</span>

              <el-button style="float: right;" type="success" @click="submitForm('ruleForm')">生成代码</el-button>
            </div>

            <el-form ref="ruleForm" :model="ruleForm"  :rules="rules" label-width="80px">
              <el-form-item label="工程模块" prop="module">
                <el-select v-model="ruleForm.module" placeholder="请选择后台模块"  style="width: 100%"  >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生成的包" prop="package" >
                <el-input v-model="ruleForm.package" placeholder="包名称必须com.wxgc开头"></el-input>
              </el-form-item>
              <el-form-item label="选择分层" prop="checkedLayers">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="ruleForm.checkedLayers" @change="handleCheckedTableChange">
                  <el-checkbox v-for="layer in layers" :label="layer.value" :key="layer.value">{{layer.showStr}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="选择表" prop="checkedDbTables">

                <el-collapse v-model="activeNames" @change="handleChange">
                  <el-collapse-item :title="title" name="table" >
                    <el-checkbox :indeterminate="isDbIndeterminate" v-model="checkTableAll" @change="handleCheckDBAllChange">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="ruleForm.checkedDbTables" @change="handleCheckedDBChange">
                      <el-checkbox v-for="name in dbTables" :label="name" :key="name">{{name}}</el-checkbox>
                    </el-checkbox-group>
                  </el-collapse-item>
                </el-collapse>
              </el-form-item>

            </el-form>

          </el-card>


        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
            <svg-icon icon-class="list" /> 数据库表列相关选择(可选)  <span style="color: orange">提示:勾选表之后才会显示</span>
            </div>

            <el-collapse v-model="activeName" accordion v-for="(item,i) in tableData" :key="i">
              <el-collapse-item :title="formartName(item.tableName)" :name="(i+1)+''" >
                <el-table
                  @select="selectColumn"
                  @select-all="selectColumn"
                  row-key="columnName"
                  :data="item.tableColumns"
                  stripe
                  style="width: 100%"
                  :row-class-name="tableRowClassName">

                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="columnName"
                    label="列名"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="columnType"
                    label="类型"
                    width="120"  >
                  </el-table-column>
                  <el-table-column
                    prop="isShow"
                    label="前端中显示"
                    width="120"  >
                    <template slot-scope="{row}">
                      <el-switch
                        :disabled="isDisable(row.columnName)"
                        v-model="row.isShow"
                        active-text="是"
                        inactive-text="否">
                      </el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="eqOrLike"
                    label="等值查询"
                    width="100"  >
                    <template slot-scope="{row}">
                      <el-radio :disabled="isDisable(row.columnName)"  v-model="row.eqOrLike" label="eq">等值</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="eqOrLike"
                    label="模糊查询"
                    width="100">
                    <template slot-scope="{row}">
                      <el-radio :disabled="isDisable(row.columnName)" v-model="row.eqOrLike" label="like">模糊</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="columnComment"
                    label="备注">
                  </el-table-column>
                </el-table>
              </el-collapse-item>

            </el-collapse>
          </el-card>



        </el-col>
      </el-row>

    </div>
</template>

<script>

  import {generator,allConnTableInfo,allModuleName} from '@/api/online'

  export default {
    name: 'generatorCode',
    data(){
      return {
        ruleForm:{
          package:'',
          module: '',
          checkedLayers: [],
          checkedDbTables: [],
        },
        options: [],
        checkAll: false,
        layers: [
          {showStr:'前端页面-UI',value:'vueUi'},
          {showStr:'实体类-Entity',value:'entity'},
          {showStr:'控制层-Controller',value:'controller'},
          {showStr:'业务层接口-Service',value:'service'},
          {showStr:'业务层实现-ServiceImpl',value:'serviceImpl'},
          {showStr:'Dao接口-Mapper',value:'mapper'},
          {showStr:'Dao映射文件-XML',value:'mapperXml'},
        ],
        isIndeterminate: true,
        checkTableAll: false,
        dbTables:[],
        dbTableInfos:[],
        isDbIndeterminate: true,
        rules:{
          module:[{ required: true, message: '请选择工程模板', trigger: 'change'}],
          package: [
            { required: true, message: '请输入包名', trigger: ['blur', 'change'] },
            { pattern:/^com\.wxgc(\.[a-z0-9]{1,}){1,}[a-z0-9]{1}$/, message: '包名必须com.wxgc开头,字母数字组成,不能以点结束', trigger: ['blur', 'change'] }
          ],
          checkedLayers:[{ type: 'array', required: true, message: '请至少选择一个分层模块', trigger: 'change' }],
          checkedDbTables:[{ type: 'array', required: true, message: '请至少选择一个表', trigger: 'change' }]
        },
        activeNames: ["table"],
        title:'隐藏所有的表',
        activeName:"1",
        tableData: [],
        selectionColumns:[],

      }
    },
    created() {
      let  that=this;
      allConnTableInfo().then(res=>{
        if(res.code=="success"){
         for(let item of res.data){
           that.dbTables.push(item.tableName);
           for(let  cl of item.tableColumns){
             cl.tableName=item.tableName;
           }
           that.dbTableInfos.push(item);
         }
        }
      }).catch(err=>{
          that.errorMsg()
      })
      allModuleName().then(res=>{
        if(res.code=="success"){
          for(let item of res.data){
            that.options.push({
              value: item,
              label: item
            });
          }
        }
      }).catch(err=>{
        that.errorMsg()
      })
    },
    watch:{
      'ruleForm.checkedDbTables'(n,o){
          let temp=[];
          for(let tabel of this.dbTableInfos){
            for(let ck  of this.ruleForm.checkedDbTables){
              if(tabel.tableName==ck){
                temp.push(tabel)
              }
            }
          }
        this.tableData=temp;
          if(temp==null||temp.length==0) {
            this.selectionColumns=[];
          }
        console.log(JSON.stringify(this.tableData))
      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.ruleForm.checkedLayers = val ? ['vueUi','entity','controller','service','serviceImpl','mapper','mapperXml'] : [];
        this.isIndeterminate = false;
      },
      handleCheckedTableChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.layers.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.layers.length;
      },
      handleCheckDBAllChange(val) {
        this.ruleForm.checkedDbTables = val ? this.dbTables : [];
        this.isDbIndeterminate = false;
      },
      handleCheckedDBChange(value) {
        let checkedCount = value.length;
        this.checkTableAll = checkedCount === this.dbTables.length;
        this.isDbIndeterminate = checkedCount > 0 && checkedCount < this.dbTables.length;
      },
      submitForm(formName) {
        let  that=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let  data={
              moduleName:that.ruleForm.module,
              layerModule:that.ruleForm.checkedLayers,
              packageName:that.ruleForm.package,
              tableNames:that.ruleForm.checkedDbTables,
              tables:that.selectionColumns
            };
            generator(data).then(res=>{
              if(res.code=="success"){
                that.$refs[formName].resetFields();
                that.selectionColumns=[];
                that.$message({
                  type: 'success',
                  message: res.msg
                });
              }
            }).catch(err=>{
              that.errorMsg();
            })

          } else {
            that.errorMsg('请填写正确的信息数据')
            return false;
          }
        });
      },
      handleChange(val) {
        if(val==""){
          this.title="展开所有的表";
        }else{
          this.title="隐藏所有的表";
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      selectColumn(selection, row){
        if(selection.length==0){
          this.selectionColumns=this.selectionColumns.filter(cl=> cl.tableColumns.length>1&&cl.tableName!=row.row)
          console.log(JSON.stringify(this.selectionColumns))
          return
        }
        let tableInfo={tableName:null,tableColumns:[]};
        for(let cl of selection){
          tableInfo.tableName=cl.tableName;
          tableInfo.tableColumns.push(cl)
        }
         for(let i=0;i<this.selectionColumns.length;i++){
           if(selection.length==0||this.selectionColumns[i].tableColumns.length==1){
             this.selectionColumns.splice(i,1)
             continue;
           }
           if(this.selectionColumns[i].tableName==tableInfo.tableName){
             this.selectionColumns.splice(i,1)
           }
        }
        this.selectionColumns.push(tableInfo);
      },
      isShow(str){
        return str=="yes";
      },
      isDisable(columnName){

        for(let table of this.selectionColumns){
          for(let cl of table.tableColumns){
            if(cl.columnName==columnName){
              return  false;
            }
          }
        }
        return  true;
      },
      formartName(name){
        return '表名：【'+name+'】'
      },
      //错误提示
      errorMsg(msg){
        if(!msg) msg="服务器异常,稍后再试试";
        this.$message({
          title: '操作提示',
          message: msg,
          type: "error",
          duration: 2000
        })
      },
    }
  }
</script>

<style scoped>
    .main{
      padding: 20px;
    }

  /deep/.el-collapse-item__header{
    color: #20a0ff;
    padding-left: 30%;
  }
  /deep/.el-collapse-item__header:hover{
      color: orange;
  }
    .el-table .warning-row {
      background: oldlace;
    }

    .el-table .success-row {
      background: #f0f9eb;
    }
    .ui{
      display: inline-block;
      padding: 0px 3px;
      margin: 0px 10px;
      border: 1px #e3e3e3 solid;
      border-radius: 5px;
    }
</style>

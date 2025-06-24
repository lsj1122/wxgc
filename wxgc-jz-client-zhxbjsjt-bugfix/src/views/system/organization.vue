<template>
  <div class="app-container" v-loading="loading"  element-loading-text="加载中..."  element-loading-background="rgba(0, 0, 0, 0.2)">
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content">
          <div class="list-title">
            <svg-icon icon-class="table" />
            组织机构列表
            <svg-icon icon-class="table" />
          </div>
          <div class="edit-btn-ct">
            <el-button
              :disabled="disabledBtn"
              @click="handleAddRole"
              type="success"
              size="small"
              icon="el-icon-plus"
              circle
            ></el-button>
            <el-button
              :disabled="disabledBtn"
              @click="handleEdit"
              type="warning"
              size="small"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="getAllTreeRoles"
              type="primary"
              size="small"
              icon="el-icon-refresh"
              circle
            ></el-button>
            <el-button
              :disabled="disabledBtn"
              @click="handleDelete"
              type="danger"
              size="small"
              icon="el-icon-delete"
              circle
            ></el-button>
          </div>
          <el-input
            class="search-input"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          >
          </el-input>
          <div  style=" height: 70vh; overflow: auto">
          <el-tree
            class="filter-tree"
            :data="dataRoles"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @current-change="treeChange"
            ref="tree"
          >
          </el-tree>
          </div>
        </div>
      </el-col>

      <el-col :span="19">
        <div class="grid-content" style="padding: 0px 10px">
          <div class="select-list">
            <span>当前选择组织机构:</span
            ><el-button v-text="treeSelectRole.cnName">asd</el-button>
          </div>

          <el-tabs type="border-card" v-model="activeTab" @tab-click="tabClick">
            <el-tab-pane name="menu">
              <span slot="label">
                <svg-icon icon-class="list" />&nbsp;&nbsp;菜单权限
              </span>
              <div  style="height: 70vh; overflow-y: auto">
                <el-tree
                  ref="menuTree"
                  :default-expanded-keys="defaultCheckedKeys"
                  :default-checked-keys="defaultCheckedKeys"
                  :check-strictly="checkStrictly"
                  :data="routesData"
                  :props="defaultMenuProps"
                  :show-checkbox="showCheckbox"
                  node-key="id"
                  @check="changeMeuPower"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane  name="second">
              <span slot="label">
                <svg-icon icon-class="component" />&nbsp;&nbsp;项目权限
              </span>
              <div  style="height: 70vh; overflow-y: auto">
                <el-tree
                  ref="projectTree"
                  :default-expanded-keys="checkedProjectKeys"
                  :default-checked-keys="checkedProjectKeys"
                  :check-strictly="checkStrictly"
                  :data="allProjectData"
                  :props="defaultProjectProps"
                  :show-checkbox="showCheckbox"
                  node-key="proId"
                  @check="changeProjectPower"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>

    <!--增加或修改-->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑组织机构' : '新增组织机构'"
      v-loading="editLoading"
      element-loading-text="执行中..."  element-loading-background="rgba(0, 0, 0, 0.2)"
    >
      <el-form
        ref="dataForm"
        :model="role"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="英文名称" prop="name">
          <el-input
            v-model="role.oldName"
            placeholder="olad角色名称"
            style="display: none"
          />
          <el-input v-model="role.name" placeholder="英文名称(用于系统判断)" />
        </el-form-item>
        <el-form-item label="中文名称" prop="cnName">
          <el-input v-model="role.cnName" placeholder="中文名称(组织名称最好和项目名称区别，防止混淆)" />
        </el-form-item>
        <el-form-item label="上级组织">
          <div style="height: 23vh; overflow-y: auto">
          <el-tree
            ref="rolesTree"
            :data="dataRoles"
            :props="{ label: 'cnName', children: 'sysSubRoles' }"
            :check-strictly="true"
            node-key="id"
            show-checkbox
            :default-expanded-keys="expandedKeys"
            @check="handleNodeCheck"
          ></el-tree>
          </div>
          <span style="color: red;">注意：这里选择的是<strong> [上级组织] </strong>，不选择则为根组织！</span>
        </el-form-item>

        <el-form-item label="组织类型" prop="roleType">

          <el-radio v-model="roleType" label="0" >项目组织</el-radio>
          <el-radio v-model="roleType" label="1" >公司组织</el-radio>
        </el-form-item>

        <el-form-item label="机构描述" prop="description">
          <el-input
            type="textarea"
            v-model="role.description"
            placeholder="机构描述50个字符以内或者不填"
          ></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible = false">
          {{ $t("permission.cancel") }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t("permission.confirm") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import { getSysDictionaryByType } from "@/views/sysdictionary/api/sysdictionary.js";
import { getAllSysProject ,resetProjectRole} from "@/views/sysproject/api/sysproject";
import {
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole,
} from "@/api/role";

import i18n from "@/lang";
import store from "@/store";

const defaultRole = {
  name: "",
  oldName: "",
  cnName: "",
  hasMenuIds: [],
  createUser: "",
  parentId: undefined,
  description: "",
};
const defaultSelectTree = { id: 0, cnName: "未选择" };

export default {
  name: "organization",
  data() {
    return {
      loading:true,
      editLoading:false,
      roleType:'0',
      filterText: "",
      disabledBtn: false,
      dataRoles: [], //属性结构角色数据
      allRoles: [], //分组下拉列表数据
      showCheckbox: true,
      allProjectData:[], //所有项目
      checkedProjectKeys: [],
      defaultProps: {
        children: "sysSubRoles",
        label: "cnName",
      },
      defaultMenuProps: {
        children: "children",
        label: "title",
      },
      defaultProjectProps: {
        children: "children",
        label: "proName",
      },
      expandedKeys:[], //默认展开节点id
      treeSelectRole: defaultSelectTree, //选择的tree数据
      defaultCheckedKeys: [],
      checkStrictly: false,
      routes: [],
      activeTab: "menu",
      dialogType: "new",
      dialogVisible: false,
      role: Object.assign({}, defaultRole),
      rules: {
        //校验功能
        name: [
          {
            required: true,
            message: "英文名称，一般都是字母",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^[A-Za-z]{1,50}$/,
            message: "英文名称,1-50个字母组成",
            trigger: ["blur", "change"],
          },
        ],
        cnName: [
          {
            required: true,
            message: "请填写中文名称",
            trigger: ["blur", "change"],
          },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50个字符内",
            trigger: ["blur", "change"],
          },
        ],
        description: [
          {
            min: 0,
            max: 50,
            message: "机构描述50个字符以内或者不填",
            trigger: ["blur", "change"],
          },
        ]
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getAllTreeRoles(); //查询所有角色
    this.getRoutes();
    this.loadAllProject(); //查询所有项目数据(当前用户可见)
    console.log('菜单的路由',this.routesData)
  },
  computed: {
    routesData() {
      return this.routes;
    },
  },
  methods: {
    tabClick(d) {
      this.activeTab = d.name; //激活选项卡
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.cnName.indexOf(value) !== -1;
    },
    // 单选部门
    handleNodeCheck(data, node) {
      this.role.parentId = data.id;
      this.$refs.rolesTree.setCheckedKeys([this.role.parentId]);
    },
    async getAllTreeRoles() {
      this.loading=true;
      const res = await getRoles();
      this.dataRoles = res.data;
      this.changeDataRoles(this.dataRoles);
      this.loading=false;
    },
    //加载当前用户可以看见的所有项目数(节点)
    loadAllProject(){
      getAllSysProject({isNode:true}).then(res=>{
        if(res.code=="success") {
          this.allProjectData=res.data;
        }
      }).catch(err=>{
      })
    },
    changeDataRoles(data){
      if(data!=null){
        data.forEach((role)=>{
          if(role.type==0){
            role.cnName=role.cnName+' 【项目】'
          }else if(role.type==1){
            role.cnName=role.cnName+' (公司)'
          }
          if(role.sysSubRoles){
            this.changeDataRoles(role.sysSubRoles)
          }
        })
      }


    },
    treeChange(data, node) {
      //选中的事件
      //禁用 修改删除按钮
      this.disabledBtn = data.name == "admin" || data.name == "user";
      this.treeSelectRole = data;
      console.log(348,'data',data)
      //超级管理员不可以更改
      this.showCheckbox=data.name=='admin'?false:true
      this.$refs.menuTree.setCheckedKeys(data.hasMenuIds, false);
      this.$refs.projectTree.setCheckedKeys(data.hasProjectIds, false);

      if(data.hasMenuIds==null||data.hasMenuIds.length==0){
        this.defaultCheckedKeys=[];
      }else{
        this.defaultCheckedKeys=data.hasMenuIds;
      }
      if(data.hasProjectIds==null||data.hasProjectIds.length==0){
        this.checkedProjectKeys=[];
      }else{
        this.checkedProjectKeys=data.hasProjectIds;
      }

    },
    async getRoutes() {
      //const res = await getRoutes();
      //不在从数据库拿数据登陆时候已经获取或一次了，直接从store中拿取出来
      let myDbRouter=this.$store.getters.myDbroutes
      const routes = this.generateRoutes(myDbRouter);

      //console.log(JSON.stringify(routes))
      this.routes = this.i18n(routes);
    },
    generateRoutes(routes, basePath = "/") {
      const res = [];

      for (let route of routes) {
        for (let key in route) {
          if (route[key] == null || typeof route[key] == "undefined") {
            delete route[key];
          }
        }
        if(this.$store.getters.roles){
          // skip some route
          if(route.meta&&route.meta.roles){ //路由的数据
            let has=false;
            for(let role of this.$store.getters.roles){ //遍历我的角色
              has=route.meta.roles.includes(role) //此路由包含我的角色
              if(has) break;
            }
            if(!has){
              // continue;
              }
          }
        }else{ continue; }
        const data = {
          id: route.id,
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
        };

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path);
        }
        res.push(data);
      }
      return res;
    },
    i18n(routes) {
      const app = routes.map((route) => {
        route.title = i18n.t(`route.${route.title}`);
        if (route.children) {
          route.children = this.i18n(route.children);
        }
        return route;
      });
      return app;
    },
    //提交
    async confirmRole() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.commitDb();
        }
      });
    },
    handleAddRole() {
      //点击增加弹出
      this.role = Object.assign({}, defaultRole);
      this.dialogType = "new";
      this.dialogVisible = true;
      this.$refs.rolesTree.setCheckedKeys([]);
      this.expandedKeys=[]
      this.roleType='0';
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleEdit() {
      if (this.treeSelectRole.id == 0) {
        this.$message({
          message: "请选择一个要修改的组织",
          type: "warning",
        });
        return;
      }
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      console.log('this.treeSelectRole',this.treeSelectRole)
      this.role = deepClone(this.treeSelectRole);
      //剔除分类字符
      let index=this.role.cnName.indexOf(" ");
      if(index!=-1) this.role.cnName=this.role.cnName.substring(0,index)
      this.roleType= this.role.type+'';
      let pid=this.role.parentId;
      let keyIds=pid!=null?[this.role.parentId]:[];
      this.expandedKeys=keyIds
      this.$nextTick(() => {
        this.checkStrictly = true;
        this.$refs.rolesTree.setCheckedKeys(keyIds);
      });
    },
    handleDelete() {
      if (this.treeSelectRole.id == 0) {
        this.$message({
          message: "请选择一个要删除的组织",
          type: "warning",
        });
        return;
      }
      this.$confirm("你确定要删除此组织结构?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let roleId=this.treeSelectRole.id;
          let res = await deleteRole(roleId);
          if (res.code == "success") {
            this.getAllTreeRoles(); //查询所有角色
          }
          if(roleId==this.treeSelectRole.id){ //删除的是选中的清楚恢复默认
            this.treeSelectRole=defaultSelectTree;
          }
          this.$message({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async commitDb(isPower) {
      this.editLoading=true;
      const isEdit = this.dialogType === "edit";
      let msg = "操作成功";
      let type = "success";
      let res = null;
      if(!isPower)
      this.role.type=this.roleType;
      //剔除分类特殊字符
      let index=this.role.cnName.indexOf(" ");
      if(index!=-1) this.role.cnName=this.role.cnName.substring(0,index)
      //修改
      if (isEdit) {
        try{
          res = await updateRole(this.role);
        }catch (e){
          this.dialogVisible = false;
          this.editLoading=false;
        }
        if (res.code == "success") {
          this.treeSelectRole = res.data;
          this.getAllTreeRoles();
        }
        //添加
      } else {
        try{
          res = await addRole(this.role);
        }catch (e){
          this.dialogVisible = false;
          this.editLoading=false;
        }
        if (type == "success") {
          this.getAllTreeRoles();
        }
      }
      msg = res.msg;
      type = res.code;
      this.dialogVisible = false;
      this.editLoading=false;
      this.$notify({
        title: "系统提示",
        dangerouslyUseHTMLString: true,
        message: msg,
        type: type,
      });
    },
    changeMeuPower(data,data1) {
      if (this.treeSelectRole.id == 0) {
        this.$refs.menuTree.setCheckedKeys([], false);
        this.$message({
          message: "请选择一个要修改的组织",
          type: "warning",
        });
        return;
      }
      //获取选中的属性id
      this.role = deepClone(this.treeSelectRole);
      let checkedKeys = this.$refs.menuTree.getCheckedKeys();
      this.role.hasMenuIds = checkedKeys;
      this.dialogType = "edit";
      this.commitDb(true);
    },
    changeProjectPower(data,data1){
      //没有选中组织给出提示
      if (this.treeSelectRole.id == 0) {
        this.$refs.projectTree.setCheckedKeys([], false);
        this.$message({
          message: "请选择一个要修改的组织",
          type: "warning",
        });
        return;
      }
      this.loading=true;
      //获得选中的项目ids
      let checkedKeys = this.$refs.projectTree.getCheckedKeys();
       let params= {roleId:this.treeSelectRole.id,projectIds:checkedKeys};
        resetProjectRole(params).then(res=>{
          if (res.code == "success") {
            this.getAllTreeRoles(); //查询所有角色
          }else{this.loading=false;}
          this.$message({
            type: "success",
            message: res.msg,
          });
        }).catch(err=>{
          this.loading=false;
        })
    }

  },
};
</script>

<style lang="scss" scoped >
.app-container {
  //background: #0a76a4;

  .edit-btn-ct {
    text-align: center;
    padding: 5px;
  }

  .select-list {
    padding-left: 10px;
    line-height: 50px;
  }

  .el-col {
    border-radius: 4px;
    .list-title {
      text-align: center;
      line-height: 50px;
      background-color: #304156;
      color: white;
      svg {
        color: #20a0ff;
      }
    }
    .search-input {
      width: 90%;
      margin: 5px 5%;
    }
    .el-tree {
      background-color: transparent;
      width: 90%;
      margin: 0 auto;
      ::v-deep .is-current {
        background-color: #11a983 !important;
        color: white;
        border-radius: 4px;
      }
      ::v-deep .el-tree-node:focus > .el-tree-node__content {
        background: none;
      }
      ::v-deep .el-tree-node__content:hover {
        background-color: #1f2d3d;
        color: white;
        border-radius: 4px;
      }
    }
  }
  .grid-content {
    display: block;
    border-radius: 4px;
    background-color: #fafafa;
    min-height: calc(100vh - 124px);
  }
}
</style>

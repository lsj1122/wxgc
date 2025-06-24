<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t('permission.addRole') }}
    </el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" stripe>
      <el-table-column align="center" label="名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="中文名" width="220">
        <template slot-scope="scope">
          {{ scope.row.cnName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createtime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form ref="dataForm"  :model="role" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.oldName" placeholder="olad角色名称"  style="display: none" />
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="中文名称" prop="cnName">
          <el-input v-model="role.cnName" placeholder="中文名称" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree ref="tree"
                   default-expand-all
                   check-on-click-node
                   :default-expanded-keys="defaultCheckedKeys"
                   :default-checked-keys="defaultCheckedKeys"
                   :check-strictly="checkStrictly"
                   :data="routesData" :props="defaultProps"
                   show-checkbox
                   node-key="id"
                   class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import i18n from '@/lang'

const defaultRole = {
  name: '',
  oldName:'',
  cnName: '',
  hasMenuIds: [],
  createUser:'',
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      defaultCheckedKeys:[],
      rules: { //校验功能
        name: [{ required: true, message: '角色名称，一般都是字母', trigger: 'blur' }],
        cnName: [{ required: true, message: '请填写中文名称', trigger: 'blur' }],
      },
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
        }]
      }]
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  mounted(){
    defaultRole.createUser=this.$store.state.user.name;
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data;
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        for(let key in route){
          if(route[key]==null|| typeof(route[key])=='undefined'){
            delete route[key];
          }
        }

        // skip some route
        if (route.hidden) { continue }

        //如果只有一个子菜单仅仅显示子菜单
        // const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        //
        // if (route.children && onlyOneShowingChild && !route.alwaysShow) {
        //   route = onlyOneShowingChild
        // }

        const data = {
          id: route.id,
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {

      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)

      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(scope.row.hasMenuIds,true)
        this.checkStrictly = true
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('你确定要删除此角色?', '系统警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          let res= await deleteRole(row.id)
          if(res.code=="success"){
            this.rolesList.splice($index, 1)
          }
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
        .catch(err => { console.error(err) })
    },
    //提交
    async confirmRole() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.commitDb()
        }
      })
    },
    async commitDb(){
      const isEdit = this.dialogType === 'edit'
      //获取选中的属性id
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      alert(JSON.stringify(checkedKeys))
      this.role.hasMenuIds=checkedKeys;
      let msg='操作成功';
      let type="success";
      //修改
      if (isEdit) {
        let res=await updateRole(this.role)
        msg=res.msg;
        type=res.code;
        if(type=="success") {
          for (let index = 0; index < this.rolesList.length; index++) {
            if (this.rolesList[index].id === this.role.id) {
              this.rolesList.splice(index, 1, Object.assign({}, this.role))
              break
            }
          }
        }
        //添加
      } else {
        let res = await addRole(this.role)
        msg=res.msg;
        type=res.code;
        if(type=="success"){
          this.role = res.data
          this.rolesList.push(this.role)
        }
      }

      this.dialogVisible = false
      this.$notify({
        title: '系统提示',
        dangerouslyUseHTMLString: true,
        message: msg,
        type: type
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>

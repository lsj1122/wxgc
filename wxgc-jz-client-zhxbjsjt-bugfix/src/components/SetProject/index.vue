<template>
  <div class="setProject">
    <span>当前选择项目：</span>
    <el-popover placement="bottom" title="请选择项目" trigger="click" v-model="popoverVisible">
      <el-tree
        ref="projectTree"
        node-key="proId"
        :props="defaultProps"
        :data="pro_options"
        show-checkbox
        check-strictly
        default-expand-all
        @check="handleCheckChange"
        @check-change="popoverVisible = false"
      >
      </el-tree>
      <el-button slot="reference"  
      >{{ projectName }} <i class="el-icon-arrow-down"></i
      ></el-button>
    </el-popover>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'SetProject',
  data() {
    return {
      pro_options: [],
      projectId: this.getProId() || '',
      projectName: '不限制',
      projectChildrenIds: this.getProjectChildrenId() || '', //选中节点的所有子节点ID
      checkedKeys: [],
      parentId: this.getParentId(),
      defaultProps: {
        children: 'children',
        label: 'proName'
      }
    }
  },
  watch: {
    '$store.getters.projectData': {
      handler(val, oldval) {
        if (val.length > 0) {
          this.pro_options = []
          this.pro_options = val
          if (val.length === 1 && this.projectId === '') {
            //只有一个项目时，默认选中。
            this.projectId = val[0].proId
            this.projectName = val[0].proName
            this.checkedKeys = [val[0].proId]
          }
          this.initProjectChildrenIds(1)
          this.changeProName(this.pro_options)
          this.commitProId()
        }
      },
      immediate: true
    },
    checkedKeys: {
      handler(val, oldVal) {
        this.$refs.projectTree.setCheckedKeys(this.checkedKeys)
        this.initProjectChildrenIds(2)
        this.changeProName(this.pro_options)
      }
    }
  },
  created() {
    //加载项目数据
    this.$store.dispatch('project/loadProjectData')
    this.checkedKeys = [this.projectId]
  },
  methods: {
    handleCheckChange: function(nodeData, isCheck) {
     
      let ckids = this.$refs.projectTree.getCheckedKeys()
      if (ckids == null || ckids.length == 0) {
        this.projectId = ''
        this.projectName = '请重新选择项目'
        this.checkedKeys = []
        this.parentId = ''
        this.changeProId()
      }
      if (isCheck) {
        this.projectId = nodeData.proId
        this.projectName = nodeData.proName
        this.checkedKeys = [nodeData.proId]
        this.parentId = nodeData.parentId
        this.changeProId()
      }
    },
    
    changeProId() {
      this.initProjectChildrenIds(3)
      this.changeProName(this.pro_options)
      this.commitProId()
    
      Message({
        message: '项目已切换为【' + this.projectName + '】!',
        type: 'success',
        duration: 2 * 1000
      })
    },
    commitProId() {
      this.$store.dispatch('project/setProjectId', this.projectId)
      this.$store.dispatch('project/setProjectName', this.projectName)
      this.$store.dispatch('project/setProjectChildrenIds', this.projectChildrenIds)
      this.$store.dispatch('project/setParentId', this.parentId)
    },
    // 根据 proId 递归项目名字
    changeProName(data) {
      for (let p of data) {
        if (p.proId == this.projectId) {
          this.projectName = p.proName
          return
        } else if (p.children && p.children.length > 0) {
          this.changeProName(p.children)
        }
      }
    },
    // 获取cookie中选中的projectId
    getProId() {
      return this.$store.getters.projectId
    },
    // 获取cookie中选中的parentId
    getParentId() {
      return this.$store.getters.parentId
    },
    // 获取cookie中选中的projectChildrenIds
    getProjectChildrenId() {
      return this.$store.getters.projectChildrenIds
    },
    // 初始化ProjectChildrenIds
    initProjectChildrenIds(i) {
      this.projectChildrenIds = []
      for (let p of this.pro_options) {
        if (p.proId == this.projectId) {
          this.loadData(p.children, this.projectChildrenIds)
        }
      }
    },
    // 递归ProjectChildrenIds
    loadData(childrens, ids) {
      if (childrens && childrens.length > 0) {
        for (let p of childrens) {
          ids.push(p.proId)
          if (p.children && p.children.length > 0) {
            this.loadData(p.children, ids)
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.setProject {
  height: 100%;
  text-align: center;
  float: left;
  display: inline-block;
  vertical-align: middle;
  padding-top: 6px;
  font-size: 14px;
  color: #b3b3b3;
  padding-left: 30px;
}

.projectCt {
  display: inline-block;
  background-color: #42b983;
  position: absolute;
  z-index: 9999;
}
</style>

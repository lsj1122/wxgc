<template>
  <div class="class-danw-box">
    <div :class="{'dwactive':index===active}" class="class-danw-item" v-for="(item,index) in sdata" :key="index"
         @click="clickDw(item,index)">
      <div>
        <span>{{ item.buildType }}</span>
        <el-dropdown @command="deleteBanzu">
                    <span class="el-dropdown-link">
                        <i class="el-icon-more banzucd"/>
                    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type:'del',item:item}">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
      <div>
        <p>{{ item.buildName }}</p>
      </div>
    </div>

  </div>
</template>

<script>
import {selectTtBuildUnitByPro, deleteTtBuildUnit} from "@/views/labourManager/api/ttbuildunit";

export default {
  data() {
    return {
      active: 0,
      sdata: []
    }
  },
  created() {
    this.query()
  },
  methods: {
    clickDw(item, i) {
      this.active = i
      this.updateMs(this.sdata[i])
    },
    query(value) {
      selectTtBuildUnitByPro({
        buildName: value
      }).then(res => {
        if (res.code == "success") {
          this.sdata = res.data
          this.$emit('buildCount', this.sdata.length)
          this.updateMs(this.sdata[0])
        }
      })
    },
    updateMs(data) {
      this.$emit('clickRow', data)
    },
    deleteBanzu(comn) {

      if (comn.type === 'del') {  //判断是否删除按钮
        deleteTtBuildUnit(comn.item.id).then(res => {
          if (res.code === 'success') {
            this.$message.success('删除成功！')
            this.query()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.class-danw-box {
  border-top: 1px solid #ededed;
  // background-color: pink;
  overflow: auto;
  height: calc(100% - 190px);
}

.class-danw-item {
  padding: 7px 15px 7px 25px;
  border-bottom: 1px solid #ededed;

  > div {
    display: flex;
    justify-content: space-between;
  }

  > div:last-child {
    color: rgb(0, 154, 243);
    margin-top: 10px;

    p {
      margin: 0;
    }

    a {
      color: rgb(0, 154, 243);
    }
  }
}

.dwactive {
  background: #fcfcfc;
  border-left: 2px solid rgb(0, 164, 240)
}

.banzucd {
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: rgb(128, 128, 128);
  }
}
</style>

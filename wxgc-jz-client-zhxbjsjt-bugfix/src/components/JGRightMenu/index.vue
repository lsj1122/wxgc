<template>

  <!-- 右键菜单 -->
  <ul
    class="blk-dialogmenu"
    v-if="dialogMenu.visible"
    :style="{ left: dialogMenu.left + 'px', top: dialogMenu.top + 'px' }"
  >
    <li
      v-for="(item, index) in dialogMenu.currentMenu"
      :key="index"
      :style="item.style"
      @click="triggerMenu(item)"
    >
      <i v-if="item.icon" :class="item.icon"></i>
      {{ item.text }}
    </li>
  </ul>

</template>

<script>

export default {
  name: "JGRightMenu",
  props:{
    menuData:{ type:Array,default:()=>{ return [{ text: "默认菜单", customEvent: "default",icon: 'el-icon-search'}] } }
  },
  data(){
    return {
      dialogMenu: {
        visible: false,
        top: 0,
        left: 0,
        currentMenu:this.menuData,
      },
    }
  },
  methods:{
    triggerMenu(item){ //点击菜单
      this.$emit("click",item)
      this.close();
    },
    //  打开菜单
    open(event) {
      this.dialogMenu.visible = false;
      Object.assign(this.dialogMenu, {
        visible: true,
        top: event.pageY-20,
        left: event.pageX+10,
      });
      document.body.addEventListener("click", ()=>{
        this.dialogMenu.visible = false;
        document.body.removeEventListener("click", this.closeMenu);
      });
    },
    // 关闭菜单
    close() {
      this.dialogMenu.visible = false;
      document.body.removeEventListener("click", this.closeMenu);
    },
  }
}
</script>

<style scoped  lang="scss">
  // 右键菜单
  .blk-dialogmenu {
    min-width: 80px;
    max-width: 200px;
    max-height: 300px;
    padding: 5px;
    font-size: 14px;
    overflow: auto;
    text-align: left;
    border-radius: 5px;
    border: 1px solid lightgrey;
    background: white;
    color: #606266;
    z-index: 999;
    position: fixed;
    li {
      cursor: pointer;
      padding: 5px 0;
      font-size: 14px;
      &:last-child {
        border: none;
      }
      &:hover {
        background: #e7f9ff;
      }
    }
  }
</style>

<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!--  切换项目  -->
    <SetProject></SetProject>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />


    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <div class="to-view-btns">
          <el-button type="primary" v-if="$store.getters.projectChildrenIds.length != 0" size="mini" @click="goToView('/enterPrise','企业级')">企业级</el-button>
          <el-button type="success" v-if="$store.getters.projectChildrenIds.length == 0 " size="mini" @click="goToView(getXmViewRoutes().children[0].path,'项目级')">项目级</el-button>
        </div>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <top-message id="screenfull" class="right-menu-item hover-effect" />

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <lang-select class="right-menu-item hover-effect" /> -->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span class="realName">{{realName}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import TopMessage from '@/components/TopMessage'
// import SizeSelect from '@/components/SizeSelect'
// import LangSelect from '@/components/LangSelect'
// import Search from '@/components/HeaderSearch'
import SetProject from '@/components/SetProject'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    TopMessage,
    // ErrorLog,
    Screenfull,
    // SizeSelect,
    //LangSelect,
    // Search,
    SetProject
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'permission_routes',
      'realName',
      'projectId',
      'projectChildrenIds',
    ])
  },
  methods: {
    getQyViewRoutes(){
      return this.permission_routes.find(item=>{
        return item.path === '/enterPrise'
      })
    },
    getXmViewRoutes(){
      return this.permission_routes.find(item=>{
        return item.path === '/viewPlate'
      })
    },
    goToView(path, type) {
      this.children = [];
      console.log(11111111,path,type);
      this.handleProjectData();
      if (type == "企业级") {
        if (this.children.length > 0) {
          this.$router.push(path);
        } else {
          this.$message({
            message: "请选择企业级",
            type: "warning",
          });
        }
      }
      if (type == "项目级") {
          if (this.children.length == 0) {
          this.$router.push(path);
          console.log("11111",path);
        } else {
          this.$message({
            message: "请选择项目级项目",
            type: "warning",
          });
        }
      }
      // this.$router.push(path);
    },

    handleProjectData(data) {
      let projectData = data ? data : this.$store.getters.projectData;
      for (let i = 0; i < projectData.length; i++) {
        if (projectData[i].proId == this.projectId) {
          this.children = projectData[i].children;
          return;
        }
        if (projectData[i].children > 0) {
          this.handleProjectData(projectData[i].children);
        }
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {

      /*let objs=this.$store.state.websocket.socketClients;
      // 关闭缓存的websocket 清除
      for(let obj of objs){
        obj.exit=true;
        if(obj.client.readyState==1){
          obj.client.close();
        }
      }*/
      await this.$store.dispatch("websocket/clearWebsocketClient")
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      await location. reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .to-view-btns{
    display: inline-block;
    vertical-align: text-bottom;
    margin-right: 10px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.realName{
  font-size: 15px;
}
</style>



<template>
  <div class="dashboard-container">
    <div class="welcome-index-content">
      <div>
        <span></span>
        <el-button type="primary" v-if="$store.getters.projectChildrenIds.length != 0" plain @click="goToView2()">企业级面板 </el-button>
      </div>
      <div>
        <span class="xmjmb-wel"></span>
        <el-button type="primary" v-if="$store.getters.projectChildrenIds.length == 0" plain @click="goToView()">项目级面板</el-button>
      </div>
    </div>

    <!-- <div class="welcome-bottom-banquan" v-if="userType == 0">
      <img src="../../assets/zcLogo.png" alt="" srcset="" />
      <div class="wel-bot-textcon">
        <p>技术支持：武汉筑创科技有限公司</p>
        <p>联系电话：15156056950</p>
        <p>版权所有© 武汉筑创科技有限公司 保留一切权利</p>
        <p>皖ICP备19012543号-2</p>
      </div>
    </div> -->
    <!-- <div class="welcome-bottom-banquan" v-else>
      <img src="../../assets/wxLogo.png" alt="" srcset="" />
      <div class="wel-bot-textcon">
        <p>技术支持：合肥万像建设工程技术有限责任公司</p>
        <p>联系电话：0551-6347 5158</p>
        <p>版权所有© 合肥万像建设工程技术有限责任公司 保留一切权利</p>
        <p>皖ICP备19012543号-2</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      currentRole: "adminDashboard",
      websocket: null,
      userType: this.$store.getters.userType,
    };
  },
  computed: {
    ...mapGetters(["roles", 'permission_routes']),
  },
  created() {
    this.currentRole = "editorDashboard";
    /*if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }*/
  },
  methods: {
    getQyViewRoutes() {
      return this.permission_routes.find(item => {
        return item.path === '/enterPrise'
      })
    },
    getXmViewRoutes() {
      return this.permission_routes.find(item => {
        return item.path === '/viewPlate'
      })
    },
    goToView() {

      if (this.getXmViewRoutes()) {
        this.$router.push(this.getXmViewRoutes().children[0].path)
      } else {
        this.$message({
          message: '此模块，暂无',

        });
      }
    },
    goToView2() {
      if (this.getQyViewRoutes()) {
        this.$router.push('/enterPrise')
      } else {
        this.$message({
          message: '此模块，暂无',
        });
      }
    }
  },
};
</script>
<style scoped lang="less">
.dashboard-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .welcome-index-content {
    display: flex;
    justify-content: space-around;
    flex: 1;
    align-items: center;

    > div {
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        display: block;
        width: 500px;
        height: 380px;
        background: url("../../assets/index-img.png") no-repeat;
        box-shadow: 0 0 30px #aaa;
        border-radius: 10px;
      }

      span.xmjmb-wel {
        background-image: url("../../assets/index-img2.png");
      }

      /deep/ .el-button {
        margin-top: 52px;
        width: 170px;
      }
    }
  }

  .welcome-bottom-banquan {
    display: flex;
    justify-content: flex-start;
    padding: 45px 45px;
    border-top: 1px solid #ddd;
    margin: 0 40px;

    img {
      width: 107px;
      height: 47px;
    }

    div.wel-bot-textcon {
      margin-left: 30px;

      p {
        color: #aaa;
        font-size: 14px;
        padding: 0 0 3px 0;
        margin: 0;
      }
    }
  }
}

@media screen and (max-width: 1366px) {
  .welcome-index-content {
    transform: scale(0.9);

    div {
      transform: scale(0.9);
    }
  }
}

@media screen and (max-width: 1024px) {
  .welcome-index-content {
    transform: scale(0.8);

    div {
      transform: scale(0.9);
    }
  }
}
</style>

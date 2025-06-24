<template>

  <div class="boot" style="height:100%">
     <timeButton @zongLanChoose="zongLanChoose($event)"></timeButton>
  <div class="digital-site">
    <combox :route="true" style="height: 94%" id="comboxoff">
      <template #route>
        <div class="shuzigd-route-link">
          <router-link
            v-for="item in viewRouter"
            :key="item.path"
            :to="item.path"
            >{{ zh.route[item.meta.title] }}</router-link
          >
        </div>
      </template>

      <router-view></router-view>
    </combox>
  </div>
  </div>
</template>

<script>
import zh from "@/lang/zh";
import timeButton from "../aModules/timeButton";
export default {
  name: "digitalSite",
   components: {timeButton }, //uploadMd
  data() {
    return {
      zh,
    };
  },
  computed: {
    viewRouter() {
      return this.$store.getters.permission_routes
        .find((item) => {
          return item.path === "/viewPlate";
        })
        .children.find((rou) => {
          return rou.path === "/viewPlate/digitalSite/digitalSite";
        }).children;
    },
  },
  methods: {
    getTabs() {},
  },
};
</script>

<style lang="less" scoped>
.digital-site {
  height: 100%;
}
.shuzigd-route-link {
  > a {
    margin-right: 10px;
    font-size: 15px;
    color: rgb(226, 242, 243);
  }
  > a.router-link-active {
    color: rgb(41, 211, 241);
  }
}

@media screen and (max-width: 1024px) {
  .shuzigd-route-link {
    transform: scaleY(0.85);
  }
}
</style>

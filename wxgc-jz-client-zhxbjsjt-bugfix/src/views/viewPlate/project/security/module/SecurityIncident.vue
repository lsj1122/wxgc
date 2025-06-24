<template>
  <div class="security-incident" @click="go">
    <div>
      <span>最近30日培训次数</span>
      <a>{{ num1 }}</a>
    </div>
    <div>
      <span>累计培训次数</span>
      <a>{{ num2 }}</a>
    </div>
    <div>
      <span>最近30日培训人次</span>
      <a>{{ num3 }}</a>
    </div>
    <div>
      <span>累计培训人数</span>
      <a>{{ num4 }}</a>
    </div>
    <div>
      <span>最近30日安全交底个数</span>
      <a>{{ num5 }}</a>
    </div>
    <div>
      <span>累计安全交底个数</span>
      <a>{{ num6 }}</a>
    </div>
  </div>
</template>

<script>
import { selectSafeDisclosureCount } from "@/views/safeManager/api/ttsafetydisclosure";

export default {
  data() {
    return {
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0,
      num5: 0,
      num6: 0,
      projectId: this.$store.getters.projectId,
    };
  },
  mounted() {
    let that = this;
    selectSafeDisclosureCount().then((res) => {
      // 萝岗数据要求 替换假数据
      if (this.$store.getters.projectId == "4d28a604aa03a3a0008bf578ce976749") {
        res.data = {
          num1: 53,
          num2: 1843,
          num3: 34,
          num4: 1843,
          num5: 3,
          num6: 94,
          num7: null,
          num8: null,
        };
      }
      that.num5 = res.data.num1;
      that.num6 = res.data.num2;
      that.num3 = res.data.num3;
      that.num4 = res.data.num4;
      that.num1 = res.data.num5;
      that.num2 = res.data.num6;
    });
  },
  methods: {
    go() {
      this.$router.push("/safeManager/safeDisclose");
    },
  },
};
</script>

<style lang="less" scoped>
.security-incident {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  > div {
    width: 48%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    span {
      color: @scolor;
      font-size: 14px;
      margin-bottom: 2px;
    }
    a {
      color: rgb(0, 181, 236);
      font-size: 28px;
      font-family: "dzfont";
    }
  }
}
</style>

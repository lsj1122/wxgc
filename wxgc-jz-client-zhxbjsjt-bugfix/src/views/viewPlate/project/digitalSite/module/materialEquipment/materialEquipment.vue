<template>
  <div class="materialEquipment">
    <div class="left box">
      <slgk/>
    </div>

    <div class="middle">
      <slqkfx/>
      <ghpc/>
    </div>

    <div class="right box">
      <zxdt/>
    </div>
  </div>
</template>

<script>
import slgk from "./slgk.vue"
import slqkfx from "./slqkfx.vue"
import ghpc from "./ghpc.vue"
import zxdt from "./zxdt.vue"

export default {
  components: {
    slgk,
    slqkfx,
    ghpc,
    zxdt
  }
};
</script>

<style lang="less" scoped>
@import "./MQBaseStyle.less";

.materialEquipment {
  height: 106%;
  width: 100%;
  display: flex;

  .left {
    height: 100%;
    width: 20%;
  }

  .middle {
    height: 100%;
    width: 60%;
    margin: 0 20px;
  }

  .right {
    height: 100%;
    width: 20%;
  }
}
</style>
<template>
  <div class="ueload">
    <div id="player">
    </div>
  </div>
</template>

<script>
import player from './app'
import { mapGetters } from 'vuex'
export default {
  name: 'RTCPlayer',
  data: () => {
    return {
    }
  },
  computed: {
    ...mapGetters('connectStatus', {
      getSendMSG: 'getSendMSG'
    })
  },
  watch: {
    getSendMSG (n) {
      console.log(n)
      console.log('我是getSendMsg======')
      this.sendCMD(n)
    }
  },
  mounted () {
  },
  methods: {
    startConnect () {
      player.setConnectionChangeListener(this.connectionChangedListener)
      player.setPlayReadyListener(this.playReadyListener)
      player.setAFKListener(this.afkListener)
      player.loaded()
    },
    updateMousePosition (e) {
      player.updatePosition(e)
    },
    afkListener () {
      this.$emit('afkStart')
    },
    sendCMD (msg) {
      console.log('msg')
      console.log(msg)
      switch (msg.type) {
        case 'msg':
          player.sendMSG(msg.msg)
          break
        case 'cmd':
          player.sendCMD(msg.msg)
          break
      }
    },
    connectionChangedListener (status) {
      this.$store.commit('connectStatus/setConnectState', status)
    },
    playReadyListener () {
      let that = this
      // this.initUEResolution()
      setTimeout(function () {
        that.$emit('playReady')
      }, 2000)
    }
  }
}
</script>

<style scoped>
  .ueload{
    background: url('../../assets/ue4load.gif') no-repeat center;
    background-color: #333!important;
  }
  video{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
</style>

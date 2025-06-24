<template>
  <combox title="组织成员" class="zuzhicy">
    <div class="content">
      <div style="margin: auto;" v-for="(item, index) in members" :key="index">
        <div class="image-box">
          <img class="img-head"  :src="item.imgUrl" alt />
        </div>
        <div style="text-align: center;font-size: 10px">{{item.role + ' ' + item.name}}</div>
      </div>

    </div>
  </combox>

</template>

<script>
  import { getAllTtPartyMemberByPro} from "@/views/party/api/ttpartymember";
  export default {
    name: "organizationMembers",
    data() {
      return {
        filedata:null,
        role:'',
        personName:'',
        members: [],
        projectId:'1'
      }
    },
    created(){
      this.getPersonList()
    },
    components:{},
    methods:{
      getPersonList(){
        getAllTtPartyMemberByPro().then(res => {
          this.members = res.data
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 4px;
    font-size: 14px;
    /*color: #cecece*/
  }
  .image-box {
    height: 100px;
    width: 115px;
    display: flex;
    align-items: center
  }
  .image-box img {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }
  .zuzhicy{
    /deep/.cb-content{
        overflow: hidden;
        overflow-y: auto;
    }
  }
</style>

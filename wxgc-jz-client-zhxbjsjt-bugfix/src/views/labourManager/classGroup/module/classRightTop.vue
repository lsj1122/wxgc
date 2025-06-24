<template>
    <div class="class-right-top-cen">
        <h3>参建单位名称：<span>{{build.buildName}}</span></h3>
        <h3>参建单位类型：<span>{{build.buildType}}</span></h3>
        <h3>统一社会信用代码：<span>{{build.creditCode}}</span></h3>
        <h3>联系人：<span>{{build.contractPerson}}</span></h3>
        <h3>联系电话：<span>{{build.contractPhone}}</span></h3>
        <div style="text-align:right">
            <el-button type="primary" @click="view">
                查看
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        props:['build'],
        data(){
            return{

            }
        },
        methods:{
            view(){
                this.$emit('handView',this.build)
            }
        }
    }
</script>

<style lang="scss" scoped>
.class-right-top-cen{
    padding: 20px;
    display: flex;
    flex-wrap:wrap;
    align-content: space-around;
    >*{
        width: 31%;
    }
    >h3{
        color: #999;
        font-size: 14px;
        span{
            color: #333;
        }
    }
}
</style>
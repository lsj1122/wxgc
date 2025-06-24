<template>
    <el-dialog
        title="详情"
        :visible.sync="dialogVb"
        :before-close="handleClose"
        :modal-append-to-body='false'
        width="800px">
            <div class="present">
                <div class="present-left">
                    <el-image :src="data.attendancePicture" ></el-image>
                </div>
                <div class="present-right">
                    <ul>
                        <li><span>姓名:</span> {{data.name}}</li>
                        <!-- <li><span>班组:</span> {{data.teamName}}</li> -->
                        <li><span>管理:</span> {{data.buildName}}</li>
                        <li><span>时间:</span> {{data.time}}</li>
                    </ul>
                    <div style="margin-top:44px;">状态： <span :class="[data.attendanceType==='进入施工现场' ? 'green' : 'red']">{{data.attendanceType}}</span></div>
                </div>
            </div>
    </el-dialog>
</template>

<script>
    export default {
        data(){
            return {
                dialogVb:false,
                data:{}
            }
        },
        methods:{
            view(item){
                this.data = item
                this.dialogVb = true
            },
            handleClose(){
                this.dialogVb = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .present{
        width:100%;
        height:100%;
        display:flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .present-left{
        width:43%;
        height:100%;
        overflow:hidden;
    }
    .present-right{
        width:55%;
        height:100%;
    }
    .present-right ul li{
        line-height: 35px;
        color: aliceblue;
        text-align: left;
        span{
            color: rgb(170, 179, 179);
        }
    }
    .red{

        color:red;
    }
    .green{
        font-size: 16px;
        color:rgba(5, 255, 30, 1);
    }
</style>

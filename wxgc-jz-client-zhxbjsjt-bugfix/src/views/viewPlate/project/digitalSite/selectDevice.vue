<template>
  <el-dialog title="关联设备" :visible.sync="selectDevVisible" :close-on-click-modal="false" width="350px" :before-close="handleClose"  :modal-append-to-body='false'>
    <div class="selectDevice-box">
       <el-select v-model="selctvalue" filterable placeholder="请关联设备">
            <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.deviceName"
            :value="item.deviceNo">
            </el-option>
        </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose" type="info">取 消</el-button>
            <el-button type="primary" @click="selectSubmit" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {BoardDigitVo} from "@/views/viewPlate/project/digitalSite/api/ttdigitlocation";
    export default {
        props:{
            selectDevVisible:Boolean,
            type:String,
            siteData:Array
        },
        data(){
            return {
                selctvalue:'',
                options:[]
            }
        },
        watch:{
            selectDevVisible(val){
                if(val){
                    this.getOptions()
                }
            }
        },
        methods:{
            selectSubmit(){

                if(this.selctvalue){
                    let obj = this.options.find(item => {
                        return item.deviceNo === this.selctvalue;
                    })
                    this.$emit('selsubmit',obj)
                }else{
                    this.$message.error('请选择设备!')
                }
            },
            handleClose(){
                this.$emit('cancelSelct')
                this.$emit('update:selectDevVisible',false)
            },
            getOptions(){
                this.options = []
                this.selctvalue = ''
                console.log(this.type)
                BoardDigitVo(this.type).then(res => {
                    console.log(61,res)
                    if (res.length>0) {
                        this.options = res
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.selectDevice-box{
}
</style>

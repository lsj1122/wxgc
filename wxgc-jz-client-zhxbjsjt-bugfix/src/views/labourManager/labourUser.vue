<template>
    <div-layout>
        <template #left>
            <class-compon @handleTreeClick="onTreeClick" />
        </template>

        <user-table ref="user"/>
    </div-layout>
</template> 

<script>
    import classCompon from './module/classCompon.vue';
    import UserTable from './module/userTable.vue';
    export default {
        components: { classCompon, UserTable },
        name: "labourUser",
        data() {
            return {
                
            }
        }, 
        methods: {
            onTreeClick(nodeData){
                this.$refs.user.treeNodeClick(nodeData)
            }
        }
    }
</script>

<style scoped lang="scss">

</style>

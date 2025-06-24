import uploadFile from '@/components/Upload/uploadFile'
import {simpleUploads}  from '@/views/sysproject/api/ttfile.js'

export default {
    components:{
        uploadFile
    },
    methods: {
        getFile(file,fileList){
            this.fileList = []
            let fd = new FormData()
            for (let i = 0; i <fileList.length ; i++) {
              fd.append('fileList',fileList[i].raw)
            }
            this.fileList = fd
        },
        clearFileList(){
            this.fileList = []
            if(this.$refs.clea){
                this.$refs.clea.clearData()
            }
        },
        uploadFile(){
            return new Promise((resolve,reject)=>{
                if(this.fileList.length === 0){
                    return resolve('')
                }
                simpleUploads(this.fileList).then(res=>{
                    resolve(res[0])
                })
            })
        },
        jiexiFileList(){
            let path = this.form.filePath
            if(path){
                let name = path.split('/').pop()
                this.fileList = [{name:name,url:path}]
            }
        }
    }
}

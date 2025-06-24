import OSS from 'ali-oss'
import moment from "moment";

let ossConfig = {
  // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。 oss-cn-hangzhou.aliyuncs.com
  region: 'oss-cn-hangzhou',
  // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
  accessKeyId: 'LTAI4GKpzVjLoHp8rrrpTLFK',
  accessKeySecret: 'sQHHfIvEr981dLIMUPwlSxJsx7cQcB',
  bucket: 'newzhuochuang'
}

let client = new OSS(ossConfig);

let tempCheckpoint;

// 定义上传方法。
export async function multipartUpload (fileName,file) {
  try {
    // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
    let result = await client.multipartUpload(moment().format('yyyyMMDD')+"/"+fileName, file, {
      progress: function (p, checkpoint) {
        console.log(p,checkpoint);
        // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
        tempCheckpoint = checkpoint;
      },
      meta: { year: 2021, people: 'test' },
      mime: 'image/jpeg'
    }).then(res=>{
      return "https://"+ossConfig.bucket+"."+ossConfig.region+".aliyuncs.com"+"/"+ moment().format('yyyyMMDD')+"/"+fileName
    })
  } catch(e){
    console.log(e);
    return null;
  }
}

// 暂停分片上传。
client.cancel();

// 恢复上传。
let resumeclient = new OSS(ossConfig);
export async function resumeUpload (fileName,file) {
  try {
    let result = await resumeclient.multipartUpload(fileName,file, {
      progress: function (p, checkpoint) {
        console.log(p,checkpoint);
        tempCheckpoint = checkpoint;
      },
      checkpoint: tempCheckpoint,
      meta: { year: 2021, people: 'test' },
      mime: 'image/jpeg'
    })
  } catch (e) {
    console.log(e);
  }
}



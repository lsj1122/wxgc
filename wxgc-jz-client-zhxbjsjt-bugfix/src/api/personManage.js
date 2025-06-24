import { axios } from '@/utils/request'


//添加参建单位
export function addBuild(data) {
    return axios({
      url: '/wx/buildUnits/ttBuildUnit/add',
      method: 'post',
      data
    })
}
//编辑单位
export function editBuild(data) {
    return axios({
      url: '/wx/buildUnits/ttBuildUnit/edit',
      method: 'put',
      data
    })
}
//删除单位
export function delBuild(data) {
    return axios({
      url: '/wx/buildUnits/ttBuildUnit/delete?id=' + data,
      method: 'DELETE'
    })
}
//获取参建单位
export function getBuild(params) {
    return axios({
      url: '/wx/buildUnits/ttBuildUnit/list',
      method: 'get',
      params
    })
}


//添加班组
export function addTeam(data) {
    return axios({
      url: '/wx/team/ttTeam/add',
      method: 'post',
      data
    })
}
//编辑班组
export function editTeam(data) {
    return axios({
      url: '/wx/team/ttTeam/edit',
      method: 'put',
      data
    })
}
//删除班组
export function delTeam(data) {
    return axios({
      url: '/wx/team/ttTeam/delete?id=' + data,
      method: 'DELETE'
    })
}
//获取班组列表
export function getTeam(params) {
    return axios({
      url: '/wx/team/ttTeam/list',
      method: 'get',
      params
    }) 
}



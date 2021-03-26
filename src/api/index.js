import axios from 'axios'
import { baseUrl } from './config'

export function addTask(data){
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + '/task/add', data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
}

export function getAllTask(){
    return new Promise((resolve, reject) => {
        axios.get(baseUrl + '/task/')
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
}

export function removeTask(taskId){
    return new Promise((resolve, reject) => {
        axios.delete(baseUrl + `/task/delete/${taskId}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
}

export function removeAllTask(){
    return new Promise((resolve, reject) => {
        axios.delete(baseUrl + `/task/delete/`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
}

export function updateTask(taskId, data){
    return new Promise((resolve, reject) => {
        axios.put(baseUrl + `/task/update/${taskId}`, data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
}
import axios from "axios";
import { useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "./AuthContext";
import { useNavigation } from '@react-navigation/native';
import emitter from "./EventEmitter";
import { API_URL } from '@env'



const AxiosService = axios.create({ 
    baseURL:API_URL, 
    baseURL:`https://worldofaat.com/api/`,
    // baseURL:`http://192.168.1.10:4000/`,

    headers: {
        'Content-Type': 'application/json',
    }
})

AxiosService.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

AxiosService.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            emitter.emit('logout'); 
        }
        return Promise.reject(error);
    }
);


export default AxiosService



import axios from "axios";

export const GET = async (endpoint, params) => {

    try {
        return (await axios.get(`${endpoint}?lat=${params.lat}&lon=${params.lon}&appid=${params.appid}`))?.data;
    }
    catch(err){
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
};
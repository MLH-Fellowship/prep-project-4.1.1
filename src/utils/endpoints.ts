import axios from "axios";

interface queryParams {
    lat: number,
    lon: number,
    appid: string,
    units?: string,
    exclude?: string[]
    dt?: Date
};

export const GET = async (endpoint: string, params: queryParams): Promise<any> => {

    try {
        return (await axios.get(`${endpoint}?lat=${params.lat}&lon=${params.lon}&appid=${params.appid}`))?.data;
    }
    catch(err){
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
};
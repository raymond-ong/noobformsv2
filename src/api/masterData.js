import axios from 'axios';

const getDocUrlWithoutPort = () => {
    const temp = document.URL.replace("http://", '');
    var toks = temp.split(':');
    if (toks && toks.length > 0) {
        return `http://${toks[0]}:60000/api`;
    }

    return null;
}

export default axios.create({
    //baseURL: 'http://localhost:60000/api'
    baseURL: getDocUrlWithoutPort() || 'http://localhost:60000/api'
    //baseURL: 'http://localhost:3001'
});


const getDocUrlWithoutPortFrontEnd = () => {
    const temp = document.URL.replace("http://", '');
    var toks = temp.split(':');
    if (toks && toks.length > 0) {
        return `http://${toks[0]}:5000`;
    }

    return null;
}

export const getAprBaseUrl = () => {
    return getDocUrlWithoutPortFrontEnd() || 'http://localhost:5000';
}

export const aprFrontEndApi = axios.create({
    baseURL: getAprBaseUrl()
});

import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:60000/api'
    //baseURL: 'http://localhost:3001'
});
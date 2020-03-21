// const API_URL = process.env.NODE_ENV === 'development' ? "http://192.168.1.4:1337" : "...";
// export default API_URL;

import * as contentful from 'contentful';
const client = contentful.createClient({
    space: "logsehhmyhm6",
    accessToken: "kc8GxXFoCPvHp_Jeh2XO6l9kPtR14g_7vSCYcdD67lg"
});

export default client;
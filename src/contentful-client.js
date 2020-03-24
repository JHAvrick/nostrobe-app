/**
 * Singleton instance of the contentful client
 */
import * as contentful from 'contentful';
const client = contentful.createClient({
    space: "logsehhmyhm6",
    accessToken: "kc8GxXFoCPvHp_Jeh2XO6l9kPtR14g_7vSCYcdD67lg"
});

export default client;
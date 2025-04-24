import config from "../config/config";

export const getCategoryUrl = (type, id = '') => {
    return config.host + '/categories/' + type + (id ? '/' + id : '');
};
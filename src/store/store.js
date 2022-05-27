import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import {createStore, applyMiddleware} from "redux";
import {reducers} from "../reducers/reducers";
import {getSessionToken} from "@shopify/app-bridge-utils";
import createApp from "@shopify/app-bridge";

const app = createApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    host: new URL(location).searchParams.get("host"),
    forceRedirect: true,
});

const client = axios.create();
client.interceptors.request.use(function (config) {
    return getSessionToken(app)
        .then((token) => {
            config.headers["Authorization"] = `Bearer ${token}`;
            return config;
        });
});

export const store = createStore(reducers, applyMiddleware(axiosMiddleware(client)));
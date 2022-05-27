import {handleActions} from "redux-actions"
import {getProductCount, getPublishedProductCount, getDraftProductCount} from "./actions";


export const defaultState = {
    productCount: 0,
    publishedProductCount: 0,
    draftProductCount: 0
}


const handler = (state, {payload}) => {
    return {
        ...state,
        productCount: payload.data.count
    }
}
const handler1 = (state, {payload}) => {
    return {
        ...state,
        publishedProductCount: payload.data.count
    }
}
const handler2 = (state, {payload}) => {
    return {
        ...state,
        draftProductCount: payload.data.count
    }
}

export const reducers = handleActions({
        [getProductCount.success]: handler,
        [getProductCount.fail]: handler,

        [getPublishedProductCount.success]: handler1,
        [getPublishedProductCount.fail]: handler1,

        [getDraftProductCount.success]: handler2,
        [getDraftProductCount.fail]: handler2
    },
    defaultState)
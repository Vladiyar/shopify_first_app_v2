import {createAction} from "redux-actions";

const createRequestAction = (type, payloadCreator) => {
    const action = createAction(type, payloadCreator);
    action.success = type + '_SUCCESS';
    action.fail = type + '_FAIL';

    return action;
}

export const getProductCount = createRequestAction('GET_PRODUCT_COUNT', () => ({
    request: {
        method: 'post',
        url: '/rest',
        data: {
            url: 'https://dormidont.myshopify.com/admin/api/2022-04/products/count.json'
        }
    }
}))

export const getPublishedProductCount = createRequestAction('GET_PUBLISHED_PRODUCT_COUNT', () => ({
    request: {
        method: 'post',
        url: '/rest',
        data: {
            url: 'https://dormidont.myshopify.com/admin/api/2022-04/products/count.json?status=active'
        }
    }
}))
export const getDraftProductCount = createRequestAction('GET_DRAFT_PRODUCT_COUNT', () => ({
    request: {
        method: 'post',
        url: '/rest',
        data: {
            url: 'https://dormidont.myshopify.com/admin/api/2022-04/products/count.json?status=draft'
        }
    }
}))
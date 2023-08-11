import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import orderSlice from './order/orderSlice'
import accountSlice from './account/accountSlice'

const reducers = combineReducers({
    order: orderSlice,
    account: accountSlice
});

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});

export default store;


// import { configureStore } from '@reduxjs/toolkit'


// export const store = configureStore({
//     reducer: {
//         order: orderSlice,
//         account: accountSlice
//     },
// })
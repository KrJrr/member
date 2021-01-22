import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import auth from './auth'
export * from './auth'
import unauth from './unauth'
export * from './unauth'
import scene from './scene'
export * from './scene'
import home, {homeSaga}from './home'
export * from './home'

const rootReducer = combineReducers({
    auth, unauth, scene, home
})

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

export type ReduxState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))


function* rootSaga() {
    yield all([
        homeSaga(), //또는 fork(homeSaga)라고 넣어도 된다.
    ]); // all 은 배열 안의 여러 사가를 동시에 실행시켜줍니다.
}

sagaMiddleware.run(rootSaga);


export interface IAuthState {
    readonly myAccount?: AccountDB;
}

/**
 * 가치관 탭, 알람탭, 이상형 검색에 블록 처리 되어있음 
 */

export type AuthActionInferred =
    | ReturnType<typeof setMyAccount>


const initialState: IAuthState = {
    myAccount: undefined,
}

// Action
export const setMyAccount = (ac?: AccountDB) => ({
    type: 'SET_MY_ACCOUNT',
    account: ac
})


//Reducer
export default function authReducer(
    state = initialState,
    action: AuthActionInferred
): IAuthState {
    switch (action.type) {
        case 'SET_MY_ACCOUNT':
            return {
                ...state,
                myAccount: action.account
            }
        default:
            return state;
    }
}
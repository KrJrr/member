import update from 'immutability-helper';

export interface IUnauthState {
    readonly temporaryAccount: Partial<AccountDB>
    // readonly temporaryAccount2: RecruitList
}

export type UnauthActionInferred =
    | ReturnType<typeof setTemporaryAccount>
    // | ReturnType<typeof setTemporaryAccount2>

const initialState: IUnauthState = {
    temporaryAccount: {},
    // temporaryAccount2: {},
}


// Action
export const setTemporaryAccount = (ac: Partial<AccountDB>) => ({
    type: 'SET_TEMPORARY_ACCOUNT',
    account: ac
} as const);


export const setTemporaryAccount2 = (ac: RecruitList) => ({
    type: 'SET_TEMPORARY_ACCOUNT2',
    account: ac
} as const);

//Reducer
export default function unauthReducer(
    state = initialState,
    action: UnauthActionInferred
): IUnauthState {
    switch (action.type) {
        case 'SET_TEMPORARY_ACCOUNT':
            return {
                ...state,
                temporaryAccount: update(state.temporaryAccount, {
                    $merge: action.account
                })
            }
            // case 'SET_TEMPORARY_ACCOUNT2':
            //     return {
            //         ...state,
            //         temporaryAccount2: update(state.temporaryAccount2, {
            //             $merge: action.account
            //         })
            //     }
        default:
            return state;
    }
}
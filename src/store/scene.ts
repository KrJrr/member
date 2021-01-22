export interface ISceneState {
    readonly sceneState: eScene;
    readonly loading: boolean;
}

export type SceneActionInferred = 
| ReturnType<typeof changeScene>

const initialState: ISceneState = {
    sceneState: 'Init',
    loading: false
}

//Action
export const changeScene = (scene: eScene) => ({
    type: 'CHANGE_SCENE',
    scene: scene
} as const);

//Reducer
export default function sceneReducer(
    state = initialState,
    action: SceneActionInferred) : ISceneState
{
    switch (action.type) {
        case 'CHANGE_SCENE':
            return {
                ...state,
                sceneState: action.scene
            }
        default : 
            return state
    }
}



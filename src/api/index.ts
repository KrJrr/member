
// const API_URL = 'http://10.0.2.2:5001/member-37712/us-central1/app/'
const API_URL = 'https://us-central1-member-37712.cloudfunctions.net/app/'

//10.0.2.2 에뮬레이터에서 실행할때 localhost 아이피
const APIProcess = async (path: string, params?: RequestSmsAPIParams) => {
    let response = await fetch(API_URL + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params) 
    })
    const responseJson = await response.json() as ResponseParams;
    return responseJson
}

export const API_SMS = async (params: RequestSmsAPIParams) => {
    return await APIProcess('account/sms', params) as ResponseParams
}
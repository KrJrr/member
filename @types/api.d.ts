
interface ResponseParams {
    isSuccess: boolean; //있을때도 있고 없을 때도 있긴함
    error: any;
}

interface RequestSmsAPIParams {
    appName: string;
    appType: string;
    phoneNumber: string;
}
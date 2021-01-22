export const appType: AppType = 'member';

export const getAppName = () => {
    if (appType === 'member') return '멤버';
    return '';
}
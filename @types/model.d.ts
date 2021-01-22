type JobType = 'ceo' | 'staff'

interface LoginInfoCache {
    // uniqueId: string; 전화번호 필수라서 안 써도 됨
    phoneNumber: string;
    uid: string;
}
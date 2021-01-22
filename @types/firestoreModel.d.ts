
type PickerImageType = import('react-native-image-crop-picker').Image | null;

type Timestamp = import('@react-native-firebase/firestore').FirebaseFirestoreTypes.Timestamp;
type FieldValue = import('@react-native-firebase/firestore').FirebaseFirestoreTypes.FieldValue;

interface AccountDB extends DB {
    state: string;
    fcmToken?: string;
    jobType: string
    name: string;
    co_name?: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
    address: string;
    image?: UserImage;
    recruitList: Array<RecruitItem>
}

interface RecruitItem {
    id: string;
    title: string;
    wage: string
    content: string;
    startAt?: Timestamp | FieldValue;
}

interface BannerList {
    uri: string;
}

interface RecruitList {
    
    id: string;
    uid: string
    fcmToken: string;
    co_name: string;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
    phoneNumber: string;
    uri: string;
    title: string;
    wage: string
    content: string;
    startAt?: Timestamp | FieldValue;
}


interface DB {
    id: string;
}

interface CertificationDB extends DB {
    tryCertificateCount: number;
    certificationCode: string; //인증번호
    createAt: Timestamp | FieldValue;
}


interface UserImage extends DB {
    name: string; //확장자 포함
    uri: string;
    width: number;
    height: number;
    // isGif: boolean;
    createAt: Timestamp | FieldValue;

    local?: PickerImageType; //로컬에서만 쓰임
}

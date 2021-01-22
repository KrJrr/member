type InitStackParamList = {
    InitScreen: undefined;
};

type Parm ={
    id: number,
    email : string
}

type UnauthParamList = {
    SingInUpScreen: undefined;
    Join_SignIn: undefined;
    Join_SignUp: undefined;

    Join_Ceo: undefined;
    Join_Staff: undefined;

    Join_Address: undefined;

}

type AuthParamList = {
    MainTabNavigation: undefined;
    RecruitScreen: undefined;
    CoInfoScreen: {uid: string, id: string};
}


type MainTabParamList = {
    HomeNavigation: undefined;
    ProfileNavigation: undefined;
}


type HomeParamList = {
    HomeScreen: undefined;
    RecruitScreen: undefined;
    CoInfoScreen: {uid: string, id: string};

    MyProfileScreen: undefined;
}
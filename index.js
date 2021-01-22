/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';

// 앱이 꺼진상태에서 받는
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
// });

// messaging().onNotificationOpenedApp(remoteMessage => {
//     //앱 백그라운드 일 때 나오는거            
//     if (remoteMessage) onExcuteAction(remoteMessage);
// });

messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    navigation.navigate(remoteMessage.data.type);
  });

messaging()
.getInitialNotification()
.then(remoteMessage => {
    //앱 완전 꺼져있을 때 들어옴
    if (remoteMessage) onExcuteAction(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

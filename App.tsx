import React , { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet , Alert} from 'react-native';
import { Provider } from 'react-redux';
import { store } from '~/store'
import AppNavigator from '~/AppNavigator'

import messaging from '@react-native-firebase/messaging';

import CodePush from 'react-native-code-push';

const App: () => React.ReactNode = () => {

  useEffect(() => {
    // 앱이 켜진 상태
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Alert.alert('알림', JSON.stringify(remoteMessage.data?.name) + '(님) 으로부터 알바 신청이 들어왔습니다. \n tel : ' + JSON.stringify(remoteMessage.data?.phoneNumber))
      console.log(JSON.stringify(remoteMessage))
    });

    return unsubscribe;
  }, [])

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.flex}>
        <AppNavigator />
      </SafeAreaView>
    </Provider>
  )
}

// export default App
export default CodePush({ checkFrequency: CodePush.CheckFrequency.MANUAL })(App);

const styles = StyleSheet.create({
  flex: { flex: 1 }
})

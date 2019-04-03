import '@babel/polyfill'
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import NavigationService from './NavigationService';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';
import { fromTop, fromBottom, fadeIn } from 'react-navigation-transitions'

import SignIn from './screens/SignIn';
import SignOut from './screens/SignOut';
import StudentDashboard from './screens/StudentDashboard';
import CourseDashboard from './screens/CourseDashboard';
import TestDashboard from './screens/TestDashboard';
import CreateQuestion1 from './screens/CreateQuestion1';
import EditQuestion from './screens/EditQuestion';
import ReviewQuestion from './screens/ReviewQuestion';
import AnswerQuestion from './screens/AnswerQuestion';
import AllQuestions from './screens/AllQuestions';
import QuestionAnswered from './screens/QuestionAnswered'
import ChallengeDashboard from './screens/ChallengeDashboard'
import Challenge from './screens/Challenge'
import UserQs from './screens/UserQs'
import UserAnswers from './screens/UserAnswers'
import CameraLabel from './screens/CameraLabel'
import NewQuestionModal from './components/NewQuestionModal'

const url = 'qbe1.herokuapp.com/'

const getToken = async () => {
  const token = await AsyncStorage.getItem('AUTH_TOKEN')
  return token
}

const httpLink = createHttpLink({
  uri: `https://${url}`,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  }
});

const wsLink = new WebSocketLink({
  uri: `wss://${url}`,
  options: {
    reconnect: true
  }
});

const authLink = setContext( async (_, { headers }) => {
  const token = await getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const fullHttpLink = authLink.concat(httpLink)

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  fullHttpLink,
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

const MainStack = createStackNavigator(
  {
    SignIn: SignIn,
    SignOut: SignOut,
    StudentDashboard: StudentDashboard,
    CourseDashboard: CourseDashboard,
    TestDashboard: TestDashboard,
    CreateQuestion1: CreateQuestion1,
    EditQuestion: EditQuestion,
    ReviewQuestion: ReviewQuestion,
    AnswerQuestion: AnswerQuestion,
    QuestionAnswered: QuestionAnswered,
    AllQuestions:AllQuestions,
    ChallengeDashboard:ChallengeDashboard,
    Challenge:Challenge,
    UserQs:UserQs,
    UserAnswers:UserAnswers,
    CameraLabel:CameraLabel
  },
  {
    initialRouteName: "SignIn",
    transitionConfig: () => fadeIn()
  }
)


const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    MyModal: {
      screen: NewQuestionModal,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    transparentCard:true,
    transitionConfig: () => fromTop()
  }
);

const Container = createAppContainer(RootStack);

export default class App extends React.Component {

  state = {
    isVisible:false,
    questionId: ''
  }

  componentDidMount = async () => {

    const enabled = await firebase.messaging().hasPermission();
        if (enabled) {

        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
          NavigationService.navigate('MyModal',{ questionId1: notification.data.questionId })
            console.log('notification')
        })
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
          console.log('notification',notification.data.questionId)
          NavigationService.navigate('MyModal',{ questionId1: notification.data.questionId, course: notification.data.course, institution: notification.data.institution, testNumber: notification.data.testNumber, subject: notification.data.subject })
        })

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
            const action = notificationOpen.action
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification
            console.log('click on',notification.data.questionId)
            NavigationService.navigate('CreateQuestion',{ questionId1: notification.data.questionId })

        })

        const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification()
         if (notificationOpen) {
             // App was opened by a notification
             // Get the action triggered by the notification being opened
             const action = notificationOpen.action
             // Get information about the notification that was opened
             const notification: Notification = notificationOpen.notification
             console.log('notification initial',notificationOpen.data.questionId)
             NavigationService.navigate('CreateQuestion',{ questionId1: notification.data.questionId })

         }
      }

      componentWillUnmount() {
          this.notificationDisplayedListener ()
          this.notificationListener()
          this.notificationOpenedListener()
      }

 render() {
    return (
      <ApolloProvider client={client}>
      <Container
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
      </ApolloProvider>
    );
  }
}

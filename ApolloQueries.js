import gql from "graphql-tag";

const COURSE_QUERY = gql`
query CourseQuery($courseid:ID!){
  course(id:$courseid){
    id
    name
    courseNumber
    time
    institution{
      name
    }
    tests{
      id
      subject
      deleted
      testNumber
      release
      testDate
      questions{
        id
        challenges{
          challenge
        }
        questionAnswers{
        answer{
          choice
          correct
        }
      }
      }
      panels{
        id
      }
    }
  }
}
`

export const PHOTO_LABEL_MUTATION = gql`
mutation AddLabeledPhotoMutation($link: String!, $label:String!, $testId: ID!){
  addLabeledPhoto(link:$link,
  label:$label,
  testId:$testId){
    id
    link
    label
  }
}
`

const USER_COURSE_QUERY = gql`
query UserQuery($userid: ID!) {
  user(id: $userid){
    id
    firstName
    lastName
    invitesSentTo{
      id
      course{
        id
        courseNumber
        name
        time
        teachers{
          firstName
          lastName
        }
        institution{
          name
        }
      }
    }
    studentCourses{
      id
      name
      time
      deleted
      institution{
        name
      }
      teachers{
        firstName
        lastName
      }
      tests{
        id
      }
    }
  }
}
`;

var LOGOUT_MUTATION = gql`
    mutation {
      logout{
        authMsg
        user{
          online
          firstName
          lastName
        }
      }
    }
  `
  const STORE_TOKEN = gql`
  mutation StoreToken($pushToken:String!){
    updateUser(pushToken:$pushToken){
      id
      pushToken
    }
  }
  `

  const CREATE_QUESTION_QUERY = gql`
  query CreateQuestionQuery($questionId:ID!){
    question(id:$questionId){
      id
      question
      sentPanel{
        link
        id
      }
      test{
        id
        subject
        testDate
        testNumber
        course{
          id
          name
          institution{
            id
            name
          }
        }
      }
    }
  }
  `

  const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestion(
    $question: String!,
    $testId:ID!,
    $panelId:ID!,
    $choice1:String!,
    $choiceCorrect1: Boolean!,
    $choice2:String!,
    $choiceCorrect2: Boolean!,
    $choice3:String!,
    $choiceCorrect3: Boolean!,
    $choice4:String!,
    $choiceCorrect4: Boolean!,
    ){
      createQuestion(
        question: $question,
        testId:$testId,
        panelId:$panelId,
        choice1: $choice1,
        choiceCorrect1: $choiceCorrect1,
        choice2: $choice2,
        choiceCorrect2: $choiceCorrect2,
        choice3: $choice3,
        choiceCorrect3: $choiceCorrect3,
        choice4: $choice4,
        choiceCorrect4: $choiceCorrect4,
      ){
          id
          test{
            id
          }
        }
      }
    `

  const LOGIN_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!, $pushToken: String) {
      mobileLogin(email: $email, password: $password, pushToken: $pushToken) {
        token
        user{
          id
          firstName
          lastName
          role
        }
      }
    }
  `
  const TEST_QUESTIONS_QUERY = gql`
  query TestQuestionsQuery($testId:ID!){
    test(id:$testId){
      id
      subject
      testNumber
      testDate
      course{
        id
        name
        courseNumber
      }
      questions{
        id
        question
      }
    }
  }
  `

const ANSWER_QUESTION_QUERY = gql`
  query AnswerQuestionQuery($questionId:ID!){
    question(id:$questionId){
      id
      question
      choices {
        id
        choice
        correct
      }
      test{
        id
        subject
        testNumber
        course{
          id
          name
          institution{
            id
            name
          }
        }
      }
    }
  }
`

const ANSWER_QUESTION_MUTATION = gql`
  mutation AnswerQuestionMutation(
    $questionId:ID!,
  	$answerChoiceId:ID!){
    addAnswer(
      questionId:$questionId,
      answerChoiceId:$answerChoiceId
    ){
      id
    }
  }
`

const CHALLENGE_QUERY = gql`
query ChallengeQuery($challengeId:ID!){
    challenge(id:$challengeId){
    id
    challenge
    answer{
      id
      answer{
        id
        choice
        correct
        question{
          id
          question
          panel{
            id
            link
          }
          addedDate
          addedBy{
            id
            firstName
            lastName
          }
          choices{
            id
            correct
            choice
          }
          test{
            id
            subject
            testNumber
            course{
              id
              name
            }
          }
        }
      }
    }
    addedBy{
      id
      firstName
      lastName
    }
    addedDate
    }
  }
`

const CREATE_CHALLENGE_MUTATION = gql`
  mutation CreateChallenge($answerId:ID!,$challenge:String!){
    addChallenge(challenge:$challenge,answerId:$answerId){
      id
    }
  }
`

const CHALLENGE_ANSWER_QUERY = gql`
query ChallengeAnswerQuery($questionId:ID!){
  answers(where:{question:{id:$questionId}}){
    answers{
    id
    answer{
      id
      choice
      correct
    }
    question{
      id
      question
      panel{
        id
        link
      }
      choices{
        id
        choice
        correct
      }
      challenges{
        id
        challenge
      }
      test{
        id
        subject
        testNumber
        course
        {
          id
          name
          institution{
            id
            name
          }
        }
      }
    }
  }
}
}
`

const EDIT_QUESTION_QUERY = gql`
query EditQuestionQuery($questionId:ID!){
  question(id:$questionId){
    id
    question
    choices{
      id
      choice
      correct
    }
    panel{
      link
    }
    test{
      id
      subject
      testDate
      testNumber
      course{
        name
        institution{
          name
        }
      }
    }
  }
}
`

const ANSWERED_QUESTION_QUERY = gql`
query AnswerQuery($answerId:ID!){
  answer(id:$answerId){
    id
    answer{
      id
      choice
      correct
    }
    question{
      id
      question
      choices{
        id
        choice
        correct
      }
      test{
        id
        subject
        testNumber
        course{
          id
          name
          institution{
            id
            name
          }
        }
      }
    }
  }
}
`

const QUESTION_QUERY = gql`
  query CreateReviewQuery($questionId:ID!){
    question(id:$questionId){
      id
      question
      choices {
        id
        choice
        correct
      }
      panel{
        link
        id
      }
      test{
        id
        subject
        course{
          name
          institution{
            name
          }
        }
      }
    }
  }
`

const SEND_QUESTION_MUTATION = gql`
  mutation SendQuestion($testId: ID!, $questionId:ID! ){
    sendQuestion(testId:$testId, questionId:$questionId){
      question
      id
    }
  }
  `

  const TEST_QUERY = gql`
  query TestQuery($test_id:ID!){
    test(id:$test_id){
        id
        subject
        testNumber
        testDate
        release
        releaseDate
        published
        publishDate
      	course{
          id
          name
          courseNumber
        }
        panels{
          id
      }
      }
    }
  `

  const USER_ANSWERS_QUERY = gql`
  query UserAnswers($testId:ID!){
    userAnswers(testId:$testId){
      id
      answerCorrect
      answer{
        id
        choice
      }
      question{
        id
        question
        choices{
          id
          choice
          correct
        }
      }
    }
  }
  `

  const USER_ANSWERED_QUERY = gql`
  query UserAnsweredStats($testId:ID!){
    userAnsweredStats(testId:$testId){
      total
      totalCorrect
      percentCorrect
    }
  }
  `

  const USER_QUESTIONS_QUERY = gql`
  query UserQuestions($testId:ID!){
    userQuestions(testId:$testId){
      id
      question
      choices{
        id
        choice
        correct
      }
      questionAnswers{
        id
        answerCorrect
        answer{
          id
          choice
          correct
        }
      }
    }
  }
  `

  const USER_QUESTION_STATS_QUERY = gql`
  query UserQuestionStats($testId:ID!){
    userQuestionStats(testId:$testId){
      totalQuestions
      totalCorrect
      percentCorrect
      answers
    }
  }
  `
  const TEST_HEADER_QUERY = gql`
  query TestHeaderQuery($testId:ID!){
    test(id:$testId){
      id
      subject
      testNumber
      testDate
      course{
        id
        name
        courseNumber
      }
  }
  }
  `

  const ADD_CHALLENGE_MESSAGE_MUTATION = gql`
  mutation AddChallengeMessage($challengeId: ID!,
    $challengeMessage: String!){
      addChallengeMessage(challengeMessage:$challengeMessage,
      challengeId:$challengeId){
        id
        addedBy{
          id
          firstName
          lastName
        }
      }
    }
  `

  const CHALLENGE_MESSAGE_QUERY = gql`
  query ChallengeMessages($challengeId:ID!){
     challengeMessages(where:{challenge:{id:$challengeId}}){
      challengeMessages{
        id
        challengeMessage
        addedDate
        addedBy{
          id
          firstName
          lastName
        }
      }
    }
  }
  `

  const CHALLENGE_MESSAGE_SUBSCRIPTION = gql`
    subscription ChallengeMsgSub($challengeId:ID!){
      challengeMsg(challengeId:$challengeId){
        node{
          id
          challengeMessage
          addedDate
          addedBy{
            id
            firstName
            lastName
          }
        }
      }
    }
    `

    const CHALLENGE_QUESTION_QUERY = gql`
      query ChallengesQuestionQuery($questionId:ID!){
        challenges(where:{answer:{question:{id:$questionId}}}){
          challenges{
            id
            challenge
            addedDate
            addedBy{
              firstName
              lastName
            }
          }
        }
      }
    `

    const USER_QUESTION_QUERY = gql`
    query UserQuestionStats($testId:ID!){
      userQuestionStats(testId:$testId){
        totalQuestions
        totalCorrect
        percentCorrect
        answers
      }
    }
    `


export {
  COURSE_QUERY,
  USER_COURSE_QUERY,
  LOGOUT_MUTATION,
  STORE_TOKEN,
  CREATE_QUESTION_QUERY,
  CREATE_QUESTION_MUTATION,
  LOGIN_MUTATION,
  TEST_QUESTIONS_QUERY,
  ANSWER_QUESTION_QUERY,
  ANSWER_QUESTION_MUTATION,
  CHALLENGE_QUERY,
  ANSWERED_QUESTION_QUERY,
  CREATE_CHALLENGE_MUTATION,
  CHALLENGE_ANSWER_QUERY,
  EDIT_QUESTION_QUERY,
  QUESTION_QUERY,
  SEND_QUESTION_MUTATION,
  TEST_QUERY,
  USER_ANSWERS_QUERY,
  USER_ANSWERED_QUERY,
  USER_QUESTIONS_QUERY,
  USER_QUESTION_STATS_QUERY,
  TEST_HEADER_QUERY,
  ADD_CHALLENGE_MESSAGE_MUTATION,
  CHALLENGE_MESSAGE_QUERY,
  CHALLENGE_MESSAGE_SUBSCRIPTION,
  CHALLENGE_QUESTION_QUERY,
  USER_QUESTION_QUERY
}

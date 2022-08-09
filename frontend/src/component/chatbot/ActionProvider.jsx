// control action for chatbot
import { apiCall } from '../../Main';
import { useNavigate } from 'react-router-dom';
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.navigate = useNavigate();
  }

  // Reply the meeting related questions.
  handleMeeting = () => {
    const message = this.createChatBotMessage(
      "Do you want to book a meeting?",
      {
        widget: "optionsmeeting"
      }
    );
    this.setChatbotMessage(message);
  };
  handleMeetingTure = () => {
    const message = this.createChatBotMessage(
      "Which field to you wank to have meeting?",
      {
        widget: "optionsmeetingfield"
      }
    );
    this.setChatbotMessage(message);
  }

  // Reply user's questions.
  handleQuestion = async (text) => {
    const data = await apiCall('/chatbot', 'POST', { state: 1, input_text: text }, this.navigate);
    if (typeof (data) === 'string' && (!data.startsWith('200') || !data.startsWith('201'))) {
      this.navigate('/login');
      return;
    }
    const message = this.createChatBotMessage(
      "Sure! Which type of information you would like to get?",
      {
        widget: "optionsquestion"
      }
    );
    this.setChatbotMessage(message);
  };

  // Reply the user with hte video.
  handleVideos = async () => {
    const send = await apiCall('/chatbot', 'POST', { state: 2, input_text: 'video' })

    this.setState((state) => ({
      ...state,
      src: send,
    }));
    const message = this.createChatBotMessage(
      `Ok, heres are some video link you can have a look relate to your question`,
      {
        widget: "herfWidget"
      }
    );
    console.log('herfwidge');
    this.setChatbotMessage(message);
    const message7 = this.createChatBotMessage(
      "Do you satisfied with this result or do want want to see some related questions?",
      {
        widget: "optionsquestionvideo"
      }
    );
    this.setChatbotMessage(message7);
  };

  // Reply user's quesiton with hte guide.
  handleGuides = async () => {
    const send = await apiCall('/chatbot', 'POST', { state: 2, input_text: 'guide' })

    this.setState((state) => ({
      ...state,
      src: send,

    }));
    const message = this.createChatBotMessage(
      `Ok, heres are some solution to your questions`,
      {
        widget: "herfGuideWidget"
      }
    );
    this.setChatbotMessage(message);

    const message3 = this.createChatBotMessage(
      "Do you still have some questions relate to this topic? You can post an question on our website or see some related questions.",
      {
        widget: "optionsquestionguide"
      }
    );
    this.setChatbotMessage(message3);
  };

  // Reply the user with question content related answer.
  handleRelate = async () => {
    const send = await apiCall('/chatbot', 'POST', { state: 3, input_text: 'related' })
    console.log(send);
    if (send.text.length !== 0) {
      const message = this.createChatBotMessage(
        "Here are several related questions, you can ask me by sending me message",
      );
      this.setChatbotMessage(message);
      send.text.map((s) => {
        const message2 = this.createChatBotMessage(s)
        this.setChatbotMessage(message2);
      })
    } else {
      const message = this.createChatBotMessage(
        "Here are no related questions",
      );
      this.setChatbotMessage(message);
    }
  };

  // Handle the ask for adding a post.
  handlePost = () => {
    const message = this.createChatBotMessage(
      "Okay, please fill in the form",
      { widget: "postform" }
    );
    this.setChatbotMessage(message);
  };

  // Reply the SQL related questions.
  handleSqlQuiz = () => {
    const message = this.createChatBotMessage("Sure! Here's your SQL QUIZ !", {
      widget: "sql"
    });
    this.setChatbotMessage(message);
  };

  // Reply the unknown questions.
  handleUnknown = () => {
    const message = this.createChatBotMessage(
      "Please ask a question"
    );
    this.setChatbotMessage(message);
  };

  // Reply with mental health related doctor.
  handleMeetingMentalHealth = () => {
    const message = this.createChatBotMessage(
      "You can find some doctors to meet for mental health by click the following link",
      {
        widget: "meetingmentalhealth"
      }
    );
    this.setChatbotMessage(message);
  };

  // Reply with covid-19 related doctor.
  handleMeetingCovid19 = () => {
    console.log('a??');
    const message = this.createChatBotMessage(
      "You can find some doctors to meet for covid 19 by click the following link",
      {
        widget: "meetingcovid19"
      }
    );
    this.setChatbotMessage(message);
  };

  // Reply with staying at home related doctor.
  handleMeetingStayingAtHome = () => {
    const message = this.createChatBotMessage(
      "You can find some doctors to meet for staying at home by click the following link at home",
      {
        widget: "meetingstayathome"
      }
    );
    this.setChatbotMessage(message);
  };

  // Reply with caree advice related doctor.
  handleMeetingCareerAdvice = () => {
    const message = this.createChatBotMessage(
      "You can find some doctors to meet for career advice by click the following link advice",
      {
        widget: "meetingcareeradvice"
      }
    );
    this.setChatbotMessage(message);
  };

  // Reply the vaccination related doctor.
  handleMeetingVaccation = () => {
    const message = this.createChatBotMessage(
      "You can find some doctors to meet for vaccation by click the following link vaccation",
      {
        widget: "meetingmvaccation"
      }
    );
    this.setChatbotMessage(message);
  };

  // Reply the greeting message.
  handleGreeting = () => {
    apiCall('/chatbot', 'POST', { state: 3, input_text: 'true' })
    const message = this.createChatBotMessage(
      "Thanks for trying Wellbeing Bot! We hope you had a great experience"
    );
    this.setChatbotMessage(message);
  };

  messageHandler = () => {
    const message = this.createChatBotMessage(
      "Hello, ask me anything",

    );
    this.setChatbotMessage(message);
  };

  handleCancle = () => {
    const message = this.createChatBotMessage(
      "Thanks for trying! Feel free to ask anything!"
    );
    this.setChatbotMessage(message);
  };

  handleSorry = () => {
    apiCall('/chatbot', 'POST', { state: 3, input_text: 'false' })
    const message = this.createChatBotMessage(
      "I am sorry that I do not find those infromations you want :( . You can ask a new questions or ask your previous questions more detailed."
    );
    this.setChatbotMessage(message);
  };

  setChatbotMessage = (messages) => {
    if (Array.isArray(messages)) {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, ...messages]
      }));
    } else {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, messages]
      }));
    }
  };
}
export default ActionProvider;

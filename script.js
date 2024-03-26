const state = {
  root: document.getElementById('root'),
  app: document.getElementById('app'),
  status: 'inactive',
  timeRemaining: {
    minutes: 0,
    seconds: 10,
  },
  intervalID: null,
  questions: [],
  currentQues: 0,
};

function createHeader() {
  // create header;
  const header = `
  <header class="header">
    <img
      class="header__logo"
      alt="react logo"
      src="./assets/logo192.png"
    />
    <h1 class="header__text">THE REACT QUIZ</h1>
  </header>`;
  state.app.innerHTML = header;
}

function createMain() {
  // create main
  const main = `<main class='main'></main>`;
  state.app.insertAdjacentHTML('beforeend', main);
  state.main = document.querySelector('main');
}

function startQuiz() {
  state.status = 'started';
  renderScreen();
  startTimer();
}

function endQuiz() {
  state.status = 'finished';
  renderScreen();
}

function startTimer() {
  state.intervalID = setInterval(() => {
    if (
      state.timeRemaining.seconds === 0 &&
      state.timeRemaining.minutes === 0
    ) {
      endTimer();
      state.status = 'finished';
      renderScreen();
      return;
    }
    if (state.timeRemaining.seconds === 0) {
      state.timeRemaining.minutes--;
      state.timeRemaining.seconds = 59;
    } else {
      state.timeRemaining.seconds--;
    }
    document.querySelector('.quizScreen__timer').textContent = `${
      state.timeRemaining.minutes
    }:${
      state.timeRemaining.seconds < 10
        ? '0' + state.timeRemaining.seconds
        : state.timeRemaining.seconds
    }`;
  }, 1000);
}

function endTimer() {
  clearInterval(state.intervalID);
}

async function fetchQuestions() {
  try {
    const res = await fetch('./data/questions.json');
    const data = await res.json();
    state.questions = data.questions;
  } catch (err) {
    state.status = 'error';
  }
}

function selectOption(e) {
  if (e.target.tagName !== 'LI') return;
  document.querySelectorAll('.quizScreen__option').forEach((option, index) => {
    option.classList.add('selected');
    if (option.id == state.questions[state.currentQues].correctOption)
      option.classList.add('correct');
    option.classList.add('disabled');
  });
  if (+e.target.id !== state.questions[state.currentQues].correctOption)
    e.target.classList.add('incorrect');
}

function initQuizScreen() {
  const quiz = `
  <div class="quizScreenContainer">
      <p class="quizScreen__question">
        ${state.questions[state.currentQues].question}
       </p>
      <ul class="quizScreen__optionsList">
        <li class="quizScreen__option" id="0">${
          state.questions[state.currentQues].options[0]
        }</li>
        <li class="quizScreen__option" id="1">${
          state.questions[state.currentQues].options[1]
        }</li>
        <li class="quizScreen__option" id="2">${
          state.questions[state.currentQues].options[2]
        }</li>
        <li class="quizScreen__option" id="3">${
          state.questions[state.currentQues].options[3]
        }</li>
      </ul>
      <div class="quizScreen__btnContainer">
        <div class="quizScreen__timer">
          ${state.timeRemaining.minutes}:${
    state.timeRemaining.seconds < 10
      ? '0' + state.timeRemaining.seconds
      : state.timeRemaining.seconds
  }
        </div>
        <div class="quizScreen__next">${
          state.currentQues < state.questions.length - 1 ? 'Next' : 'Submit'
        }</div>
      </div>
  </div>`;
  state.main.innerHTML = quiz;
  document
    .querySelector('.quizScreenContainer')
    .addEventListener('click', selectOption);
  document.querySelector('.quizScreen__next').addEventListener('click', () => {
    state.currentQues++;
    if (state.currentQues === state.questions.length - 1) {
      state.status = 'finished';
      renderScreen();
      return;
    }
    initQuizScreen();
  });
}

function initStartScreen() {
  const startScreenContainer = document.createElement('div');
  const heading = document.createElement('h1');
  const text = document.createElement('p');
  const startBtn = document.createElement('button');

  startScreenContainer.className = 'startScreen';
  heading.className = 'startScreen__heading';
  text.className = 'startScreen__text';
  startBtn.className = 'startScreen__startBtn';

  heading.textContent = 'Welcome to The React Quiz!';
  text.textContent = '15 questions to test your React Mastery';
  startBtn.textContent = "Let's Start";

  startBtn.addEventListener('click', startQuiz);
  startScreenContainer.append(heading, text, startBtn);
  state.main.append(startScreenContainer);
}

function initFinishScreen() {
  state.main.innerHTML = `<div class='finishScreenContainer'>
    <p class='finishScreen__heading'>Finished</p>
  </div>`;
}

function renderScreen() {
  state.status === 'inactive' && initStartScreen();
  state.status === 'started' && initQuizScreen();
  state.status === 'finished' && initFinishScreen();
}

function initApp() {
  createHeader();
  createMain();
  fetchQuestions();
  initStartScreen();
}

initApp();

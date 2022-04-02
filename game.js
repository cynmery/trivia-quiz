const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressBarFull = document.getElementById('progressBarFill');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then((res) => {
        return res.json()
    }).then((loadedQuestions) => {
        questions = loadedQuestions.results.map(loadedQuestion => {
            /* Decode HTML entities retrieved from API */
            let fetchedQuestion = loadedQuestion.question;
            let decodedCorrectAnswer = decodeHtml(loadedQuestion.correct_answer);
            const formattedQuestion = {
                question: decodeHtml(fetchedQuestion)
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, decodedCorrectAnswer);
            answerChoices.forEach(function (choice, index) {
                formattedQuestion[`choice${index+1}`] = decodeHtml(choice);
            });
            return (formattedQuestion);
        });
        startGame();
        //questions = loadedQuestions;
    }).catch(err => {
        console.error(err);
    });

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //Go to end page
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressText.innerHTML = `Question ${questionCounter} / ${MAX_QUESTIONS}`;
    // Update Progress Bar
    progressBarFull.style.width = (questionCounter / MAX_QUESTIONS) * 100 + "%";
    scoreText.innerHTML = score;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    choices.forEach(element => {
        let number = element.dataset["number"];
        element.innerText = currentQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = "true";
}

choices.forEach(element => {
    element.addEventListener('click', e => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        let classToApply = 'incorrect';
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = 'correct';
            score = score + CORRECT_BONUS;
            displayScore();
        };
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(function () {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

function displayScore() {
    scoreText.innerHTML = score;
}
/* Decodes HTML entities from fetch response*/
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
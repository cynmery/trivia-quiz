let finalScore = document.getElementById("finalScore");
const saveScoreBtn = document.getElementById("saveScoreBtn");
let username = document.getElementById('username');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const MAX_HIGH_SCORES = 5;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
    console.log(username.value);
});

finalScore.innerHTML = mostRecentScore;

function saveHighScore(e) {
    e.preventDefault();
    const score = {
        score: mostRecentScore,
        name: username.value
    };
    highScores.push(score);
    highScores.sort(function (a, b) {
        return b - a
    });
    highScores.splice(MAX_HIGH_SCORES);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/index.html');
}
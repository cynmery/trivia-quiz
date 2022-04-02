const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const highScoresListName = document.getElementById('highScoresListNames');
const highScoresListScore = document.getElementById('highScoresListScore');

highScoresListName.innerHTML = highScores.map(score => {
    return `<li class="high-score-li"> <p>${score.name}</p></li>`;
}).join('');

highScoresListScore.innerHTML = highScores.map(score => {
    return `<li class="high-score-li"> <p>${score.score}</p></li>`;
}).join('');
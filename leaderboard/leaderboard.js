document.addEventListener("DOMContentLoaded", async () => {
    const chessComApiUrl = "https://api.chess.com/pub/leaderboards";

    try {
        const response = await fetch(chessComApiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        window.chessComLeaderboardData = data;
        fetchLeaderboard(); // Fetch initial leaderboard
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
});

async function fetchLeaderboard() {
    const platform = document.getElementById("platform-selector").value;
    const lichessSelector = document.getElementById("time-format-selector");
    const chessComSelector = document.getElementById("category-selector");
    
    if (platform === "lichess") {
        lichessSelector.style.display = "block";
        chessComSelector.style.display = "none";
        await fetchLichessLeaderboard();
    } else if (platform === "chesscom") {
        lichessSelector.style.display = "none";
        chessComSelector.style.display = "block";
        fetchChessComLeaderboard();
    }
}

async function fetchLichessLeaderboard() {
    const timeFormat = document.getElementById('time-format-selector').value;
    const apiUrl = `https://lichess.org/api/player/top/20/${timeFormat}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.hasOwnProperty('users') && Array.isArray(data.users)) {
            displayLeaderboard(data.users, "lichess");
        } else {
            console.error('Data is not in expected array format:', data);
            document.getElementById('leaderboard').innerText = 'Error fetching data. Please try again later.';
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('leaderboard').innerText = 'Error fetching data. Please try again later.';
    }
}

function fetchChessComLeaderboard() {
    const category = document.getElementById("category-selector").value;
    const leaderboardContainer = document.getElementById("leaderboard");

    leaderboardContainer.innerHTML = "";

    if (window.chessComLeaderboardData) {
        const categoryData = window.chessComLeaderboardData[category];
        if (categoryData && categoryData.length > 0) {
            displayLeaderboard(categoryData.slice(0, 20), "chesscom");
        } else {
            console.error(`No data found for category: ${category}`);
            leaderboardContainer.innerText = 'No data found for the selected category.';
        }
    }
}

function displayLeaderboard(players, platform) {
    const leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('leaderboard-table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const headers = ['Rank', 'Username', 'Rating'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.innerText = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    players.forEach((player, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.innerText = index + 1;
        row.appendChild(rankCell);

        const usernameCell = document.createElement('td');
        const usernameLink = document.createElement('a');
        usernameLink.target = '_blank';

        if (platform === "lichess") {
            usernameLink.href = `https://lichess.org/@/${player.username}`;
            if (player.title) {
                const titleSpan = document.createElement('span');
                titleSpan.innerText = player.title + ' ';
                titleSpan.style.fontWeight = 'bold';
                usernameCell.appendChild(titleSpan);
            }
            usernameLink.innerText = player.username;
            usernameCell.appendChild(usernameLink);
            row.appendChild(usernameCell);

            const ratingCell = document.createElement('td');
            ratingCell.innerText = player.perfs[document.getElementById('time-format-selector').value].rating;
            row.appendChild(ratingCell);
        } else if (platform === "chesscom") {
            usernameLink.href = player.url;
            if (player.title) {
                const titleSpan = document.createElement('span');
                titleSpan.innerText = player.title + ' ';
                titleSpan.style.fontWeight = 'bold';
                usernameCell.appendChild(titleSpan);
            }
            usernameLink.innerText = player.username;
            usernameCell.appendChild(usernameLink);
            row.appendChild(usernameCell);

            const ratingCell = document.createElement('td');
            ratingCell.innerText = player.score;
            row.appendChild(ratingCell);
        }

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    leaderboardDiv.appendChild(table);
}

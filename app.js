document.getElementById('fetchData').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert("Please enter a Lichess username.");
        return;
    }

    const apiUrl = `https://lichess.org/api/user/${username}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("User not found.");
            }
            return response.json();
        })
        .then(data => {
            displayAnalysis(data);
        })
        .catch(error => {
            alert(error.message);
        });
});

function displayAnalysis(data) {
    const statsDiv = document.getElementById('playerStats');
    statsDiv.innerHTML = `
        <p><strong>Username:</strong> ${data.username}</p>
        <p><strong>Total Games:</strong> ${data.count.all}</p>
        <p><strong>Wins:</strong> ${data.count.win || 0}</p>
        <p><strong>Losses:</strong> ${data.count.loss || 0}</p>
    `;

    const ctx = document.getElementById('gamesChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Games', 'Wins', 'Losses'],
            datasets: [{
                label: 'Games Analysis',
                data: [data.count.all, data.count.win || 0, data.count.loss || 0],
                backgroundColor: ['blue', 'green', 'red'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const compareDataBtn = document.getElementById('compareDataBtn');
    const loadingMessage = document.getElementById('loadingMessage');
    const comparisonResults = document.getElementById('comparisonResults');

    const fetchLatestData = async () => {
        try {
            loadingMessage.style.display = 'block';
            const response = await fetch('/api/fetchPlayers');
            if (!response.ok) {
                throw new Error('Failed to fetch latest data');
            }
            const data = await response.json();
            loadingMessage.style.display = 'none';
            displayPlayersData(data);
        } catch (error) {
            loadingMessage.style.display = 'none';
            comparisonResults.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    const compareWithData = async () => {
        try {
            loadingMessage.style.display = 'block';
            const response = await fetch('/api/comparePlayers');
            if (!response.ok) {
                throw new Error('Failed to compare data');
            }
            const comparison = await response.json();
            loadingMessage.style.display = 'none';
            displayComparisonResults(comparison);
        } catch (error) {
            loadingMessage.style.display = 'none';
            comparisonResults.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    const displayPlayersData = (data) => {
        let html = '<h2>Latest Titled Players Data</h2>';
        for (const title in data) {
            html += `<h3>${title}</h3>`;
            html += '<ul>';
            data[title].forEach(player => {
                html += `<li>${player}</li>`;
            });
            html += '</ul>';
        }
        comparisonResults.innerHTML = html;
    };

    const displayComparisonResults = (comparison) => {
        let html = '<h2>Comparison Results</h2>';
        for (const title in comparison.added) {
            html += `<h3>Added Players (${title})</h3>`;
            html += '<ul>';
            comparison.added[title].forEach(player => {
                html += `<li>${player}</li>`;
            });
            html += '</ul>';
        }
        for (const title in comparison.removed) {
            html += `<h3>Removed Players (${title})</h3>`;
            html += '<ul>';
            comparison.removed[title].forEach(player => {
                html += `<li>${player}</li>`;
            });
            html += '</ul>';
        }
        comparisonResults.innerHTML = html;
    };

    fetchDataBtn.addEventListener('click', fetchLatestData);
    compareDataBtn.addEventListener('click', compareWithData);
});

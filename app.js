document.getElementById('userDataForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value.trim();
  
    if (username === '') {
      alert('Please enter a username.');
      return;
    }
  
    const userInfoUrl = `https://lichess.org/api/user/${username}`;
  
    fetch(userInfoUrl)
      .then(response => response.json())
      .then(userInfo => {
        displayUserData(userInfo);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        const userDataContainer = document.getElementById('userData');
        userDataContainer.innerHTML = `<p class="error">Error fetching user data for ${username}.</p>`;
      });
  });
  
  function displayUserData(userData) {
    const { id, username, createdAt, perfs } = userData;
  
    const formattedCreatedAt = new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    let userStatsHtml = `
      <h2>User Information:</h2>
      <p><strong>ID:</strong> ${id}</p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Join Date:</strong> ${formattedCreatedAt}</p>
      <h3>Performance Ratings:</h3>
      <ul>
    `;
  
    if (perfs) {
      userStatsHtml += generatePerfHtml(perfs.bullet, 'Bullet');
      userStatsHtml += generatePerfHtml(perfs.blitz, 'Blitz');
      userStatsHtml += generatePerfHtml(perfs.rapid, 'Rapid');
      userStatsHtml += generatePerfHtml(perfs.classical, 'Classical');
    } else {
      userStatsHtml += `
        <li><strong>Bullet:</strong> N/A</li>
        <li><strong>Blitz:</strong> N/A</li>
        <li><strong>Rapid:</strong> N/A</li>
        <li><strong>Classical:</strong> N/A</li>
      `;
    }
  
    userStatsHtml += `</ul>`;
  
    const userDataContainer = document.getElementById('userData');
    userDataContainer.innerHTML = userStatsHtml;
    const backButton = document.getElementById('backButton');
    backButton.classList.remove('hidden');
  }
  
  function generatePerfHtml(perf, label) {
    if (perf) {
      const winPercentage = perf.games > 0 ? ((perf.win / perf.games) * 100).toFixed(2) : 'N/A';
      return `
        <li><strong>${label}:</strong> ${perf.rating}</li>
        <li><strong>${label} Win/Loss Percentage:</strong> ${winPercentage}%</li>
      `;
    } else {
      return `
        <li><strong>${label}:</strong> N/A</li>
        <li><strong>${label} Win/Loss Percentage:</strong> N/A</li>
      `;
    }
  }
  
  function goBack() {
    const userDataContainer = document.getElementById('userData');
    userDataContainer.innerHTML = '';
    const backButton = document.getElementById('backButton');
    backButton.classList.add('hidden');
  }
  
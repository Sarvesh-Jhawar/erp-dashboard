document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Replace with your backend endpoint and logic
  fetch('http://localhost:8083/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `rollno=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Invalid credentials or server error.');
    }
    return response.json();
  })
  .then(data => {
    // Save attendance data and username for dashboard
    localStorage.setItem('attendanceData', JSON.stringify(data));
    localStorage.setItem('bunk_username', username);
    localStorage.setItem('loginSuccess', 'true');
    // Show success message with animation (removed, now handled in dashboard)
    window.location.href = 'dashboard.html';
  })
  .catch(error => {
    console.error('Login failed:', error);
    alert('Login failed. Please check your username and password.');
  });
});

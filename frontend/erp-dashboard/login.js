document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const rollno = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch('http://localhost:8083/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `rollno=${encodeURIComponent(rollno)}&password=${encodeURIComponent(password)}`
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Invalid credentials or server error.');
    }
    return response.json();
  })
  .then(data => {
    // Save attendance data and redirect
    localStorage.setItem('attendanceData', JSON.stringify(data));
    window.location.href = 'dashboard.html';
  })
  .catch(error => {
    console.error('Login failed:', error);
    alert('Login failed. Please check your roll number and password.');
  });
});

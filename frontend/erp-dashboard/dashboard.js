const rollNumber = localStorage.getItem('bunk_username');
const welcomeMsg = document.getElementById('welcomeMsg');
if (rollNumber) {
  welcomeMsg.textContent = `Welcome, Roll Number: ${rollNumber}`;
} else {
  welcomeMsg.textContent = 'Welcome!';
}

// Sample subject-wise attendance data
const subjectData = JSON.parse(localStorage.getItem('attendanceData')) || [];


function getMarks(attPerc) {
  if (attPerc >= 85) return 5;
  if (attPerc >= 80) return 4;
  if (attPerc >= 75) return 3;
  if (attPerc >= 70) return 2;
  if (attPerc >= 65) return 1;
  return 0;
}

function getOverallStatus(attPerc) {
  if (attPerc >= 75) return { status: 'Safe', class: 'legend-safe' };
  if (attPerc >= 65) return { status: 'Condonation', class: 'legend-condone' };
  return { status: 'Detained', class: 'legend-detained' };
}

function renderSubjectTable() {
  const tbody = document.getElementById('subjectAttendanceBody');
  tbody.innerHTML = '';
  subjectData.forEach(row => {
    const attPerc = row.held === 0 ? 0 : ((row.attended / row.held) * 100).toFixed(2);
    const marks = getMarks(attPerc);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.sn}</td>
      <td>${row.subject}</td>
      <td>${row.faculty}</td>
      <td>${row.held}</td>
      <td>${row.attended}</td>
      <td>${attPerc}</td>
      <td>${marks > 0 ? marks : '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function calculateBunkableClassesFor(attended, held, targetPercent) {
  if (held === 0) return 0;
  let n = Math.floor((attended * 100) / targetPercent - held);
  if (n < 0) n = 0;
  return n;
}

function calculateClassesToAttend(attended, held, targetPercent) {
  // (attended + x) / (held + x) >= targetPercent/100
  // attended + x >= (held + x) * targetPercent/100
  // attended + x >= held*targetPercent/100 + x*targetPercent/100
  // attended + x - x*targetPercent/100 >= held*targetPercent/100
  // x*(1 - targetPercent/100) >= held*targetPercent/100 - attended
  // x >= (held*targetPercent/100 - attended) / (1 - targetPercent/100)
  if (held === 0) return 0;
  const required = (held * (targetPercent / 100) - attended) / (1 - targetPercent / 100);
  const x = Math.ceil(required);
  return x > 0 ? x : 0;
}

function renderFilterDropdown() {
  const filter = document.getElementById('attendanceFilter');
  // Remove all except 'Overall'
  while (filter.options.length > 1) filter.remove(1);
  subjectData.forEach((row, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = row.subject;
    filter.appendChild(opt);
  });
}

// Remove renderFilterTable function entirely
// Update updateAllTables to only call renderBunkAndAttendTables
function updateAllTables() {
  renderBunkAndAttendTables();
}

function renderBunkAndAttendTables() {
  const filter = document.getElementById('attendanceFilter');
  let row;
  if (filter.value === 'overall') {
    const totalHeld = subjectData.reduce((sum, r) => sum + r.held, 0);
    const totalAttended = subjectData.reduce((sum, r) => sum + r.attended, 0);
    row = { attended: totalAttended, held: totalHeld };
  } else {
    row = subjectData[parseInt(filter.value)];
  }
  const thresholds = [90, 85, 80, 75, 70, 65];
  const bunkBody = document.getElementById('bunkableTableBody');
  const attendBody = document.getElementById('attendTableBody');
  bunkBody.innerHTML = '';
  attendBody.innerHTML = '';
  thresholds.forEach(percent => {
    const leave = calculateBunkableClassesFor(row.attended, row.held, percent);
    const att = calculateClassesToAttend(row.attended, row.held, percent);
    const leaveRow = document.createElement('tr');
    leaveRow.innerHTML = `<td>${percent}%</td><td>${leave}</td>`;
    bunkBody.appendChild(leaveRow);
    const attRow = document.createElement('tr');
    attRow.innerHTML = `<td>${percent}%</td><td>${att}</td>`;
    attendBody.appendChild(attRow);
  });
}

// Initial renders
renderSubjectTable();
renderFilterDropdown();
// updateAllTables(); // This line is moved to DOMContentLoaded
document.getElementById('attendanceFilter').addEventListener('change', updateAllTables);

window.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('loginSuccess') === 'true') {
    const dashboardContainer = document.querySelector('.dashboard-container');
    const successMsg = document.createElement('div');
    successMsg.className = 'login-success-msg';
    successMsg.innerHTML = '<span>Logged in successfully!</span>';
    dashboardContainer.insertBefore(successMsg, dashboardContainer.firstChild);
    setTimeout(() => {
      successMsg.style.display = 'none';
      localStorage.removeItem('loginSuccess');
    }, 4000);
  }
  // Info button toggle logic
  const infoBtn = document.getElementById('infoBtn');
  const marksPopup = document.getElementById('marksCriteriaPopup');
  if (infoBtn && marksPopup) {
    infoBtn.addEventListener('click', function() {
      if (marksPopup.style.display === 'none' || marksPopup.style.display === '') {
        marksPopup.style.display = 'block';
      } else {
        marksPopup.style.display = 'none';
      }
    });
  }
  // Initial renders for new tables
  updateAllTables();
  
  // Load notification preferences
  loadNotificationPreferences();
  
  // Add notification event listeners
  setupNotificationHandlers();
  
  // Check attendance and send notifications if needed
  checkAttendanceForNotifications();
});

// Notification Functions
function loadNotificationPreferences() {
  const savedPreferences = localStorage.getItem('notificationPreferences');
  if (savedPreferences) {
    const preferences = JSON.parse(savedPreferences);
    document.getElementById('notificationEmail').value = preferences.email || '';
    document.getElementById('emailNotifications').checked = preferences.emailNotifications !== false;
  }
}

function setupNotificationHandlers() {
  const saveBtn = document.getElementById('saveNotificationSettings');
  const testBtn = document.getElementById('testNotification');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', saveNotificationSettings);
  }
  
  if (testBtn) {
    testBtn.addEventListener('click', testNotification);
  }
}

function saveNotificationSettings() {
  const email = document.getElementById('notificationEmail').value;
  const emailNotifications = document.getElementById('emailNotifications').checked;
  
  const preferences = {
    rollNumber: rollNumber,
    email: email,
    emailNotifications: emailNotifications
  };
  
  // Save to localStorage
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  
  // Send to backend
  fetch('http://localhost:8083/api/notifications/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences)
  })
  .then(response => response.json())
  .then(data => {
    showNotificationStatus('Settings saved successfully!', 'success');
  })
  .catch(error => {
    console.error('Error saving preferences:', error);
    showNotificationStatus('Failed to save settings. Please try again.', 'error');
  });
}

function testNotification() {
  const email = document.getElementById('notificationEmail').value;
  
  if (!email) {
    showNotificationStatus('Please enter an email address first.', 'error');
    return;
  }
  
  const testData = {
    rollNumber: rollNumber,
    email: email,
    testType: 'WARNING'
  };
  
  fetch('http://localhost:8083/api/notifications/test-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showNotificationStatus('Test notification sent! Check your email.', 'success');
    } else {
      showNotificationStatus('Failed to send test notification: ' + data.message, 'error');
    }
  })
  .catch(error => {
    console.error('Error sending test notification:', error);
    showNotificationStatus('Failed to send test notification. Please try again.', 'error');
  });
}

function checkAttendanceForNotifications() {
  const attendanceData = localStorage.getItem('attendanceData');
  if (!attendanceData) return;
  
  const preferences = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
  if (!preferences.email) return;
  
  fetch('http://localhost:8083/api/notifications/check-attendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rollNumber: rollNumber,
      attendanceData: attendanceData
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success && data.notificationsSent) {
      showNotificationStatus('Attendance alert sent! Check your email.', 'info');
    }
  })
  .catch(error => {
    console.error('Error checking attendance for notifications:', error);
  });
}

function showNotificationStatus(message, type) {
  const statusDiv = document.getElementById('notificationStatus');
  statusDiv.textContent = message;
  statusDiv.className = `notification-status ${type}`;
  
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = 'notification-status';
  }, 5000);
} 
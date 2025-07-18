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

function renderFilterTable() {
  const filter = document.getElementById('attendanceFilter');
  const tbody = document.getElementById('filterAttendanceBody');
  tbody.innerHTML = '';
  let subjectName, attPerc, bunk90, bunk85, bunk80, bunk75, bunk70, bunk65;
  let att90, att85, att80, att75, att70, att65;
  if (filter.value === 'overall') {
    const totalHeld = subjectData.reduce((sum, row) => sum + row.held, 0);
    const totalAttended = subjectData.reduce((sum, row) => sum + row.attended, 0);
    attPerc = totalHeld === 0 ? 0 : ((totalAttended / totalHeld) * 100).toFixed(2);
    subjectName = 'Overall';
    bunk90 = calculateBunkableClassesFor(totalAttended, totalHeld, 90);
    bunk85 = calculateBunkableClassesFor(totalAttended, totalHeld, 85);
    bunk80 = calculateBunkableClassesFor(totalAttended, totalHeld, 80);
    bunk75 = calculateBunkableClassesFor(totalAttended, totalHeld, 75);
    bunk70 = calculateBunkableClassesFor(totalAttended, totalHeld, 70);
    bunk65 = calculateBunkableClassesFor(totalAttended, totalHeld, 65);
    att90 = calculateClassesToAttend(totalAttended, totalHeld, 90);
    att85 = calculateClassesToAttend(totalAttended, totalHeld, 85);
    att80 = calculateClassesToAttend(totalAttended, totalHeld, 80);
    att75 = calculateClassesToAttend(totalAttended, totalHeld, 75);
    att70 = calculateClassesToAttend(totalAttended, totalHeld, 70);
    att65 = calculateClassesToAttend(totalAttended, totalHeld, 65);
  } else {
    const idx = parseInt(filter.value);
    const row = subjectData[idx];
    attPerc = row.held === 0 ? 0 : ((row.attended / row.held) * 100).toFixed(2);
    subjectName = row.subject;
    bunk90 = calculateBunkableClassesFor(row.attended, row.held, 90);
    bunk85 = calculateBunkableClassesFor(row.attended, row.held, 85);
    bunk80 = calculateBunkableClassesFor(row.attended, row.held, 80);
    bunk75 = calculateBunkableClassesFor(row.attended, row.held, 75);
    bunk70 = calculateBunkableClassesFor(row.attended, row.held, 70);
    bunk65 = calculateBunkableClassesFor(row.attended, row.held, 65);
    att90 = calculateClassesToAttend(row.attended, row.held, 90);
    att85 = calculateClassesToAttend(row.attended, row.held, 85);
    att80 = calculateClassesToAttend(row.attended, row.held, 80);
    att75 = calculateClassesToAttend(row.attended, row.held, 75);
    att70 = calculateClassesToAttend(row.attended, row.held, 70);
    att65 = calculateClassesToAttend(row.attended, row.held, 65);
  }
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${subjectName}</td>
    <td>
      <div><strong>Attendance %:</strong> ${attPerc}%</div>
      <div style="margin-top:0.3em;"><strong>To stay above 90%:</strong> <span style="color:#00e676; font-weight:bold;">${bunk90}</span> more class(es) to bunk</div>
      <div><strong>To stay above 85%:</strong> <span style="color:#00e676; font-weight:bold;">${bunk85}</span> more class(es) to bunk</div>
      <div><strong>To stay above 80%:</strong> <span style="color:#4f8cff; font-weight:bold;">${bunk80}</span> more class(es) to bunk</div>
      <div><strong>To stay above 75%:</strong> <span style="color:#ffb300; font-weight:bold;">${bunk75}</span> more class(es) to bunk</div>
      <div><strong>To stay above 70%:</strong> <span style="color:#ff9800; font-weight:bold;">${bunk70}</span> more class(es) to bunk</div>
      <div><strong>To stay above 65%:</strong> <span style="color:#ff5252; font-weight:bold;">${bunk65}</span> more class(es) to bunk</div>
      <hr style="border: none; border-top: 1px solid #333; margin: 0.7em 0;">
      <div><strong>To reach 90%:</strong> <span style="color:#00e676; font-weight:bold;">${att90}</span> more class(es) to attend</div>
      <div><strong>To reach 85%:</strong> <span style="color:#00e676; font-weight:bold;">${att85}</span> more class(es) to attend</div>
      <div><strong>To reach 80%:</strong> <span style="color:#4f8cff; font-weight:bold;">${att80}</span> more class(es) to attend</div>
      <div><strong>To reach 75%:</strong> <span style="color:#ffb300; font-weight:bold;">${att75}</span> more class(es) to attend</div>
      <div><strong>To reach 70%:</strong> <span style="color:#ff9800; font-weight:bold;">${att70}</span> more class(es) to attend</div>
      <div><strong>To reach 65%:</strong> <span style="color:#ff5252; font-weight:bold;">${att65}</span> more class(es) to attend</div>
    </td>
  `;
  tbody.appendChild(tr);
}

// Initial renders
renderSubjectTable();
renderFilterDropdown();
renderFilterTable();
document.getElementById('attendanceFilter').addEventListener('change', renderFilterTable); 
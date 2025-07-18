const text = 'Know your attendance';
const typingText = document.getElementById('typingText');
let idx = 0;

function type() {
  if (idx <= text.length) {
    typingText.textContent = text.slice(0, idx);
    idx++;
    setTimeout(type, 80);
  }
}
type(); 
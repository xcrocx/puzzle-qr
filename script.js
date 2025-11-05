document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('puzzle-grid');
  const LS_KEY = 'unlocked_pieces';
  const winSound = document.getElementById('win-sound');
  const unlockSound = document.getElementById('unlock-sound');

  // --- 1️⃣ Allow audio playback (Chrome restriction fix)
  document.addEventListener('click', () => {
    if (winSound) winSound.play().then(() => winSound.pause());
    if (unlockSound) unlockSound.play().then(() => unlockSound.pause());
  }, { once: true });

  // --- 2️⃣ Get piece number from URL
  function getPieceFromURL() {
    const params = new URLSearchParams(window.location.search);
    const pieceNum = parseInt(params.get('piece'), 10);
    return (!isNaN(pieceNum) && pieceNum >= 1 && pieceNum <= 9) ? pieceNum : null;
  }

  // --- 3️⃣ LocalStorage helpers
  function getUnlockedPieces() {
    const arr = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    return Array.isArray(arr) ? arr : [];
  }

  function unlockPiece(p) {
    const arr = getUnlockedPieces();
    if (!arr.includes(p)) {
      arr.push(p);
      localStorage.setItem(LS_KEY, JSON.stringify(arr));

      // 🔊 Play unlock sound
      if (unlockSound) {
        unlockSound.currentTime = 0;
        unlockSound.play().catch(() => {});
      }

      // ✨ Flash effect on grid
      grid.classList.add('flash');
      setTimeout(() => grid.classList.remove('flash'), 500);
    }
  }

  // --- 4️⃣ Unlock piece from URL (if any)
  const scannedPiece = getPieceFromURL();
  if (scannedPiece) unlockPiece(scannedPiece);

  // --- 5️⃣ Render puzzle grid
  const unlocked = getUnlockedPieces();
  for (let i = 1; i <= 9; i++) {
    const img = document.createElement('img');
    img.src = unlocked.includes(i)
      ? `images/part${i}.jpg`
      : 'images/placeholder.png';
    img.alt = `Piece ${i}`;
    grid.appendChild(img);
  }

  // --- 6️⃣ Check puzzle completion
  function checkPuzzleComplete() {
    const unlocked = getUnlockedPieces();
    const isComplete = unlocked.length === 9 && [1,2,3,4,5,6,7,8,9].every(n => unlocked.includes(n));

    if (isComplete) {
      document.getElementById('win-modal').classList.remove('hidden');

      // 🎵 Play win sound
      if (winSound) {
        winSound.currentTime = 0;
        winSound.play().catch(err => console.warn('Audio blocked:', err));
      }

      // 🎉 Confetti animation
      triggerConfetti();
    }
  }

  // --- 7️⃣ Confetti animation
  function triggerConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    (function frame() {
      if (window.confetti) {
        window.confetti(Object.assign({}, defaults, {
          particleCount: 50,
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
        }));
      }
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  // --- 8️⃣ Reset & close handlers
  document.getElementById('reset-btn').addEventListener('click', () => {
    localStorage.removeItem(LS_KEY);
    location.reload();
  });

  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('win-modal').classList.add('hidden');
  });

  // --- 9️⃣ Initial completion check
  checkPuzzleComplete();
});

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('puzzle-grid');
  const LS_KEY = 'unlocked_pieces';
  const winSound = document.getElementById('win-sound');

  // ---- AUDIO UNLOCK FIX (to bypass Chrome autoplay restriction) ----
  document.addEventListener('click', () => {
    if (winSound) {
      // Play-pause trick to mark it as user-activated
      winSound.play().then(() => winSound.pause());
    }
  }, { once: true });

  // ---- FUNCTION: Get piece number from URL ----
  function getPieceFromURL() {
    const params = new URLSearchParams(window.location.search);
    let pieceNum = parseInt(params.get('piece'), 10);
    return (!isNaN(pieceNum) && pieceNum >= 1 && pieceNum <= 9) ? pieceNum : null;
  }

  // ---- LOCAL STORAGE HELPERS ----
  function getUnlockedPieces() {
    let arr = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    return Array.isArray(arr) ? arr : [];
  }

  function unlockPiece(p) {
    let arr = getUnlockedPieces();
    if (!arr.includes(p)) {
      arr.push(p);
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
    }
  }

  // ---- UNLOCK PIECE FROM URL ----
  let scannedPiece = getPieceFromURL();
  if (scannedPiece) unlockPiece(scannedPiece);

  // ---- BUILD THE GRID ----
  let unlocked = getUnlockedPieces();
  for (let i = 1; i <= 9; i++) {
    let img = document.createElement('img');
    img.src = unlocked.includes(i)
      ? `images/part${i}.jpg`
      : 'images/placeholder.png';
    img.alt = `Piece ${i}`;
    grid.appendChild(img);
  }

  // ---- CHECK COMPLETION ----
  function checkPuzzleComplete() {
    let unlocked = getUnlockedPieces();
    const isComplete = unlocked.length === 9 && [1,2,3,4,5,6,7,8,9].every(n => unlocked.includes(n));

    if (isComplete) {
      document.getElementById('win-modal').classList.remove('hidden');

      // ---- Play winning sound ----
      if (winSound) {
        winSound.currentTime = 0;
        winSound.play().catch(err => console.log('Audio blocked:', err));
      }

      // ---- Trigger confetti effect ----
      triggerConfetti();
    }
  }

  // ---- CONFETTI EFFECT ----
  function triggerConfetti() {
    const duration = 2 * 1000; // 2 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    (function frame() {
      // Only run if confetti lib is available
      if (window.confetti) {
        window.confetti(Object.assign({}, defaults, {
          particleCount: 50,
          origin: {
            x: randomInRange(0.2, 0.8),
            y: Math.random() - 0.2
          }
        }));
      }
      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    })();
  }

  // ---- RESET PUZZLE ----
  document.getElementById('reset-btn').addEventListener('click', function () {
    localStorage.removeItem(LS_KEY);
    location.reload();
  });

  // ---- CLOSE MODAL ----
  document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('win-modal').classList.add('hidden');
  });

  // ---- INITIAL CHECK ----
  checkPuzzleComplete();
});

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('puzzle-grid');
  const LS_KEY = 'unlocked_pieces';

  // --- Get piece number from URL ---
  function getPieceFromURL() {
    const params = new URLSearchParams(window.location.search);
    let pieceNum = parseInt(params.get('piece'), 10);
    return (!isNaN(pieceNum) && pieceNum >= 1 && pieceNum <= 9) ? pieceNum : null;
  }

  // --- LocalStorage functions ---
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

  // --- Unlock piece from URL (if present) ---
  let scannedPiece = getPieceFromURL();
  if (scannedPiece) unlockPiece(scannedPiece);

  // --- Display puzzle grid ---
  let unlocked = getUnlockedPieces();
  for (let i = 1; i <= 9; i++) {
    let img = document.createElement('img');
    img.src = unlocked.includes(i)
      ? `images/part${i}.jpg`
      : 'images/placeholder.png';
    img.alt = `Piece ${i}`;
    grid.appendChild(img);
  }

  // --- Check if puzzle is complete ---
  function checkPuzzleComplete() {
    const unlockedPieces = getUnlockedPieces();
    if (unlockedPieces.length === 9) {
      document.getElementById('win-modal').classList.remove('hidden');
    }
  }

  // --- Reset puzzle ---
  document.getElementById('reset-btn').addEventListener('click', function () {
    localStorage.removeItem(LS_KEY);
    location.reload();
  });

  // --- Close modal ---
  document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('win-modal').classList.add('hidden');
  });

  // --- Run check after loading grid ---
  checkPuzzleComplete();
});

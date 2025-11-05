document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('puzzle-grid');

  function getPieceFromURL() {
    const params = new URLSearchParams(window.location.search);
    let pieceNum = parseInt(params.get('piece'), 10);
    return (!isNaN(pieceNum) && pieceNum >= 1 && pieceNum <= 9) ? pieceNum : null;
  }

  const LS_KEY = 'unlocked_pieces';
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

  // Unlock piece from URL, if any
  let scannedPiece = getPieceFromURL();
  if (scannedPiece) unlockPiece(scannedPiece);

  // Draw puzzle pieces
  let unlocked = getUnlockedPieces();
  grid.innerHTML = ''; // Ensure grid is cleared before re-populating
  for (let i = 1; i <= 9; i++) {
    let img = document.createElement('img');
    img.src = unlocked.includes(i) ? `images/part${i}.jpg` : 'images/placeholder.png';
    img.alt = `Piece ${i}`;
    grid.appendChild(img);
  }

  // Show Congratulations modal if all 9 pieces are unlocked
  function checkWin() {
    let unlocked = getUnlockedPieces();
    if (unlocked.length === 9 && [1,2,3,4,5,6,7,8,9].every(p => unlocked.includes(p))) {
      document.getElementById('win-modal').classList.remove('hidden');
    }
  }
  checkWin();

  // Close Congratulations modal handler
  document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('win-modal').classList.add('hidden');
  });

  // Reset button handler
  document.getElementById('reset-btn').addEventListener('click', function() {
    localStorage.removeItem(LS_KEY); // Clears all unlocked pieces
    location.reload(); // Refreshes page to update the grid
  });
});
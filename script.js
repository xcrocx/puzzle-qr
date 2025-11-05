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

  let scannedPiece = getPieceFromURL();
  if (scannedPiece) unlockPiece(scannedPiece);

  let unlocked = getUnlockedPieces();
  for (let i = 1; i <= 9; i++) {
    let img = document.createElement('img');
    img.src = unlocked.includes(i) ? `images/part${i}.jpg` : 'images/placeholder.png';
    img.alt = `Piece ${i}`;
    grid.appendChild(img);
  }
function checkPuzzleComplete() {
    const images = document.querySelectorAll('#puzzle-grid img');
    if (images.length === 9) {
        // Show modal popup
        document.getElementById('win-modal').classList.remove('hidden');
    }
}
document.getElementById('reset-btn').addEventListener('click', function() {
  localStorage.removeItem('unlocked_pieces'); // Clears all unlocked pieces
  location.reload(); // Refreshes page to update the grid
});
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('win-modal').classList.add('hidden');
});

});

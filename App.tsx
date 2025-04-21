import { useState } from 'react';
import './App.css';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function App() {
  const [playerOne, setPlayerOne] = useState<File | null>(null);
  const [playerTwo, setPlayerTwo] = useState<File | null>(null);
  const [playerOneURL, setPlayerOneURL] = useState<string | null>(null);
  const [playerTwoURL, setPlayerTwoURL] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
    player: 'playerOne' | 'playerTwo'
  ) => {
    const imageRef = ref(storage, `${player}/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    console.log(`${player} Bild hochgeladen:`, url);

    if (player === 'playerOne') setPlayerOneURL(url);
    else setPlayerTwoURL(url);
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setPlayer: (file: File) => void,
    playerKey: 'playerOne' | 'playerTwo'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlayer(file);
      await uploadImage(file, playerKey);
    }
  };

  const handleBattle = () => {
    const winner = Math.random() > 0.5 ? 'Player One' : 'Player Two';
    setResult(`${winner} sieht laut KI besser aus!`);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🧠 AI Face Battle</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3>Spieler 1</h3>
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, setPlayerOne, 'playerOne')} />
          {playerOneURL && <img src={playerOneURL} alt="Player One" style={{ width: '150px', marginTop: '1rem' }} />}
        </div>
        <div>
          <h3>Spieler 2</h3>
          <input type="file" accept="image/*" onChange={(e) => handleUpload(e, setPlayerTwo, 'playerTwo')} />
          {playerTwoURL && <img src={playerTwoURL} alt="Player Two" style={{ width: '150px', marginTop: '1rem' }} />}
        </div>
      </div>

      <button
        onClick={handleBattle}
        disabled={!playerOne || !playerTwo}
        style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          cursor: 'pointer',
          background: '#00c',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        Battle starten
      </button>

      {result && (
        <div style={{ marginTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {result}
        </div>
      )}
    </div>
  );
}

export default App;

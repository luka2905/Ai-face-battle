// Firebase-Konfiguration (denke daran, deine eigenen Firebase-Daten zu verwenden)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Referenz zum Firebase Storage
const storageRef = firebase.storage().ref();

// Referenzen zu den HTML-Elementen
const image1Input = document.getElementById('image1');
const image2Input = document.getElementById('image2');
const generateHugBtn = document.getElementById('generateHugBtn');
const hugResult = document.getElementById('hugResult');
const image1Preview = document.getElementById('image1Preview');
const image2Preview = document.getElementById('image2Preview');

// Bilder vorab anzeigen
function previewImage(input, previewElement) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            previewElement.src = reader.result;
            previewElement.style.display = 'block';
            checkIfReadyToGenerate();
        };
        reader.readAsDataURL(file);
    }
}

// Überprüfen, ob beide Bilder hochgeladen wurden
function checkIfReadyToGenerate() {
    if (image1Input.files.length > 0 && image2Input.files.length > 0) {
        generateHugBtn.disabled = false;
    } else {
        generateHugBtn.disabled = true;
    }
}

// Event-Listener für Bild-Uploads
image1Input.addEventListener('change', () => previewImage(image1Input, image1Preview));
image2Input.addEventListener('change', () => previewImage(image2Input, image2Preview));

// Funktion zum Hochladen von Bildern auf Firebase Storage
function uploadImage(file) {
    const fileRef = storageRef.child('uploads/' + file.name);
    return fileRef.put(file).then(snapshot => snapshot.ref.getDownloadURL());
}

// Umarmung generieren (mit Firebase und Replicate API)
generateHugBtn.addEventListener('click', async () => {
    const file1 = image1Input.files[0];
    const file2 = image2Input.files[0];

    if (!file1 || !file2) {
        alert("Bitte lade beide Bilder hoch.");
        return;
    }

    try {
        // Bilder auf Firebase Storage hochladen
        const imageUrl1 = await uploadImage(file1);
        const imageUrl2 = await uploadImage(file2);

        // Replicate API (ersetze mit deinem API-Schlüssel und Modell-ID)
        const apiKey = "YOUR_REPLICATE_API_KEY";
        const modelVersionId = "YOUR_MODEL_VERSION_ID";

        // Anfrage an die Replicate API
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: modelVersionId,
                input: {
                    image_one: imageUrl1,
                    image_two: imageUrl2
                }
            })
        });

        const data = await response.json();

        // Prüfen, ob das Ergebnis erfolgreich ist
        if (data.error) {
            alert('Fehler beim Generieren der Umarmung!');
        } else {
            // Zeige das generierte Hug-Video
            const hugImage = document.createElement('img');
            hugImage.src = data.output[0];  // Das generierte Hug-Bild
            hugResult.innerHTML = '';  // Leere das Ergebnis-Feld
            hugResult.appendChild(hugImage);  // Füge das Bild hinzu
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Umarmung:', error);
        alert('Es gab ein Problem beim Erzeugen der Umarmung.');
    }
});

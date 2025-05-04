// Dein Replicate API-Schlüssel
const API_KEY = 'r8_2drzmtLeHWUVa5NsHsNv0fDU1NHDLx31yAHiW';  // Setze deinen API-Key hier

// Button und Datei-Input Elemente
const generateHugBtn = document.getElementById('generateHugBtn');
const image1Input = document.getElementById('image1');
const image2Input = document.getElementById('image2');

// Event Listener für Datei-Inputs
image1Input.addEventListener('change', checkInputs);
image2Input.addEventListener('change', checkInputs);

// Überprüfe, ob beide Bilder hochgeladen wurden
function checkInputs() {
    if (image1Input.files.length > 0 && image2Input.files.length > 0) {
        generateHugBtn.disabled = false;
    } else {
        generateHugBtn.disabled = true;
    }
}

// Funktion, um die Umarmung zu generieren
async function generateHug() {
    const prompt = "A cute hamster lies leisurely on a lifebuoy, wearing fashionable sunglasses, and drifts with the gentle waves on the shimmering sea surface. The hamster reclines comfortably, enjoying a peaceful and pleasant time. Cartoon style, the camera follows the subject moving, with a heartwarming and high picture quality.";
    
    try {
        // Anfrage an die Replicate API
        const response = await fetch('https://api.replicate.com/v1/models/kwaivgi/kling-v2.0/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'wait'
            },
            body: JSON.stringify({
                input: { prompt }
            })
        });

        const result = await response.json();

        // Zeige das generierte Ergebnis an (z.B. ein Bild oder Video)
        if (result && result.output) {
            console.log("Generiertes Ergebnis: ", result.output);
            // Beispiel: Das Ergebnis könnte ein Bild sein, das du auf der Seite anzeigst
            const hugResult = document.getElementById('hugResult'); // Das Element, wo das Ergebnis angezeigt wird
            const img = document.createElement('img');
            img.src = result.output[0]; // Das Bild oder Video von Replicate
            hugResult.innerHTML = '';  // Alte Ergebnisse löschen
            hugResult.appendChild(img);  // Füge das neue Bild hinzu
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Umarmung:', error);
        alert('Es gab ein Problem beim Erzeugen der Umarmung.');
    }
}

// Event-Listener für den Button
generateHugBtn.addEventListener('click', generateHug);

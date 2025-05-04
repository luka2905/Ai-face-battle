// Referenzen zu den HTML-Elementen
const image1Input = document.getElementById('image1');
const image2Input = document.getElementById('image2');
const generateHugBtn = document.getElementById('generateHugBtn');
const hugResult = document.getElementById('hugResult');

// Bilder vorab anzeigen
function previewImage(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            input.style.display = 'block';  // Optional: Bild-Vorschau anzeigen
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
image1Input.addEventListener('change', () => previewImage(image1Input));
image2Input.addEventListener('change', () => previewImage(image2Input));

// Funktion zum Hochladen von Bildern auf einen Server (z.B. Google Cloud, AWS S3, etc.)
async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://your-server.com/upload", {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    return result.imageUrl; // Die URL des hochgeladenen Bildes
}

// Funktion zum Generieren der Umarmung
generateHugBtn.addEventListener('click', async () => {
    const file1 = image1Input.files[0];
    const file2 = image2Input.files[0];

    if (!file1 || !file2) {
        alert("Bitte lade beide Bilder hoch.");
        return;
    }

    try {
        // Bilder auf deinen Server hochladen
        const imageUrl1 = await uploadImage(file1);
        const imageUrl2 = await uploadImage(file2);

        // Replicate API (ersetze mit deinem API-Schlüssel und Modell-ID)
        const apiKey = "r8_2drzmtLeHWUVa5NsHsNv0fDU1NHDLx31yAHiW";
        const modelVersionId = "YOUR_MODEL_VERSION_ID";  // Modell-ID (AnimateDiff oder ControlNet)

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

        if (data.error) {
            alert('Fehler beim Generieren der Umarmung!');
        } else {
            // Zeige das generierte Hug-Video (oder Bild)
            const hugImage = document.createElement('img');
            hugImage.src = data.output[0]; // Das generierte Hug-Bild
            hugResult.innerHTML = '';  // Leere das Ergebnis-Feld
            hugResult.appendChild(hugImage);  // Füge das Bild hinzu

            // Event in Amplitude und Google Analytics aufzeichnen
            amplitude.getInstance().logEvent('Hug Generated', {
                'image1': imageUrl1,
                'image2': imageUrl2
            });

            gtag('event', 'hug_generated', {
                'image1': imageUrl1,
                'image2': imageUrl2
            });
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Umarmung:', error);
        alert('Es gab ein Problem beim Erzeugen der Umarmung.');
    }
});

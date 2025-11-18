const bgImages = {
    park: "static/bg-park.jpg",
    unterfuehrung: "static/bg-unterfuehrung.jpg",
    feuerstelle: "static/bg-feuerstelle.jpg",
    pfandstelle: "static/bg-pfand.jpg",        // Bild kannst du noch nachreichen
    kneipenviertel: "static/bg-kneipe.jpg",
    bruecke: "static/bg-bruecke.jpg",
    gambling: "static/bg-gambling.png",
    doener: "static/bg-doener.jpg"
};

function setBackgroundFor(place) {
    const container = document.getElementById("mapContainer");
    if (!container) return;

    const img = bgImages[place];
    if (img) {
        container.style.backgroundImage = `url('${img}')`;
    }

    setActiveButton(place);
}

function setActiveButton(place) {
    const buttons = document.querySelectorAll(".button-grid button");

    buttons.forEach((btn) => {
        const onclick = btn.getAttribute("onclick") || "";
        const match = onclick.match(/openPlace\('([^']+)'\)/);
        const btnPlace = match ? match[1] : null;

        btn.classList.toggle("active", btnPlace === place);
    });
}

function openPlace(place) {
    setBackgroundFor(place);
    console.log("Opened: " + place);
}

// Standard-Hintergrund beim Laden
window.addEventListener("DOMContentLoaded", () => {
    setBackgroundFor("park");
});

const bgImages = {
    park: "static/bg-park.jpg",
    unterfuehrung: "static/bg-unterfuehrung.jpg",
    feuerstelle: "static/bg-feuerstelle.jpg",
    pfandstelle: "static/bg-pfand.jpg",
    kneipenviertel: "static/bg-kneipe.jpg",
    bruecke: "static/bg-bruecke.jpg",
    gambling: "static/bg-gambling.jpg",
    doener: "static/bg-doener.jpg"
};

function setBackgroundFor(place) {
    const container = document.getElementById("mapContainer");
    container.style.backgroundImage = `url('${bgImages[place]}')`;
}

function openPlace(place) {
    setBackgroundFor(place);
    console.log("Opened: " + place);
}

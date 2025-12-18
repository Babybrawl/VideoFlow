var array = [];
var click = 0;
var click3 = 0;
var clickTag = 0;
var clickState = ["0", "0", "0", "0"];

function suite(resultat) {
    let suite = [];
    for (let i = 1; i <= resultat; i++) {
        suite.push(i);
    }
    return suite;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function incrementTagPopularity(tag) {
    try {
        var popularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};
        popularityData[tag] = (popularityData[tag] || 0) + 1;
        localStorage.setItem("tagPopularity", JSON.stringify(popularityData));
    } catch (error) {
        console.error("Erreur incrementTagPopularity :", error);
    }
}

function clear2() {
    localStorage.clear("LastVideo");
    array = [];
    document.getElementById("LastVideo").innerHTML = localStorage.getItem("LastVideo");
}
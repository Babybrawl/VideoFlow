function clickMenu() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.marginLeft == "-250px" || sidebar.style.marginLeft == "") {
        sidebar.style.marginLeft = "0px";
    } else {
        sidebar.style.marginLeft = "-250px";
    }
}

function toggleChevron(name, x) {
    if (clickState[x] == 0) {
        clickState[x] = 1;
        document.getElementById('chevron-right-' + name).style.display = "none";
        document.getElementById('chevron-down-' + name).style.display = "block";
        document.getElementById("ul_" + name).style.display = "none";
    } else {
        clickState[x] = 0;
        document.getElementById('chevron-right-' + name).style.display = "block";
        document.getElementById('chevron-down-' + name).style.display = "none";
        document.getElementById("ul_" + name).style.display = "flex";
    }
}

function searchCategories() {
    if (clickTag == 0) {
        clickTag = 1;
        document.getElementById("rechercheTag").style.display = "block";
    } else {
        clickTag = 0;
        document.getElementById("rechercheTag").style.display = "none";
    }
}
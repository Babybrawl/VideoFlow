localStorage.setItem("tagDef", 0);

async function videoView(x, y, z, w, episode, saison) {
    try {
        localStorage.setItem("videoTitre", x);
        incrementTagPopularity(w);
        localStorage.setItem("videoSRC", y);
        localStorage.setItem("videoDesc", z);
        localStorage.setItem("episode", episode);
        localStorage.setItem("saison", saison);

        let array = JSON.parse(localStorage.getItem("LastVideo")) || [];
        array = array.filter((value) => value !== null && value !== undefined);
        const existingIndex = array.indexOf(x);
        if (existingIndex !== -1) array.splice(existingIndex, 1);
        array.unshift(x);
        localStorage.setItem("LastVideo", JSON.stringify(array));
    } catch (error) {
        console.error("Erreur videoView :", error);
    }
}

async function displayTrendingMovies() {
    try {
        const tagPopularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};

        const sortedTags = Object.keys(tagPopularityData).sort((a, b) => tagPopularityData[b] - tagPopularityData[a]);

        for (let index = 0; index < sortedTags.length; index++) {
            const tag = sortedTags[index];
            let movies = await getMoviesByTag(tag);

            if (movies.length < 2 && index < sortedTags.length - 1) {
                const nextTag = sortedTags[index + 1];
                const additionalMovies = await getMoviesByTag(nextTag);
                movies = movies.concat(additionalMovies.slice(0, 2 - movies.length));
            }

            const randomMovies = [];
            const numMovies = Math.min(movies.length, 2);
            while (randomMovies.length < numMovies && movies.length > 0) {
                const randomIndex = Math.floor(Math.random() * movies.length);
                const selectedMovie = movies.splice(randomIndex, 1)[0];
                randomMovies.push(selectedMovie);
            }

            randomMovies.forEach((movie, movieIndex) => {
                const trendDiv = document.getElementById(`trend${index * 2 + movieIndex + 1}`);
                trendDiv.innerHTML = ''; 

                const newLink = document.createElement("a");
                const newImage = document.createElement("img");

                newLink.href = "html/viewVideo.html";
                newLink.className = "film";
                newLink.dataset.tag = movie.tag;

                newLink.onclick = function () {
                    videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                };

                newImage.src = movie.image;
                newImage.style.width = "100%";
                newImage.style.height = "100%";
                newImage.style.borderRadius = "15px";

                newLink.appendChild(newImage);
                trendDiv.appendChild(newLink);
            });
        }
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction displayTrendingMovies :", error.message);
    }
}


async function start() {
    try {
        resizeWidth();
        const movieTitle = localStorage.getItem("videoTitre");
        const movie = await getMovieByTitle(movieTitle);

        const videoElem = document.getElementById('video');
        const titreElem = document.getElementById('titre');
        const descElem = document.getElementById('desc');
        const serieElem = document.getElementById("serie");
        const saisonElem = document.getElementById("saison");

        videoElem.src = localStorage.getItem("videoSRC");
        titreElem.innerHTML = movieTitle;
        descElem.innerHTML = localStorage.getItem("videoDesc");

        // Remplir les options des épisodes et saisons
        if (serieElem.options.length <= 0 && localStorage.getItem("episode") > 0) {
            const episode = parseInt(localStorage.getItem("episode"));
            const res = suite(episode);
            res.forEach(optionText => {
                const option = document.createElement("option");
                option.text = optionText;
                serieElem.appendChild(option);
            });
        }

        if (saisonElem.options.length <= 0 && localStorage.getItem("saison") > 0) {
            const saison = parseInt(localStorage.getItem("saison"));
            const res = suite(saison);
            res.forEach(optionText => {
                const option = document.createElement("option");
                option.text = "saison " + optionText;
                saisonElem.appendChild(option);
            });
        }

        // Rendre visibles les listes déroulantes si elles ont des options
        if (serieElem.options.length > 0) {
            serieElem.style.visibility = "visible";
            saisonElem.style.visibility = "visible";

            const selectedSaison = parseInt(localStorage.getItem(movieTitle + "NumberSaison")) - 1;
            const selectedEpisode = parseInt(localStorage.getItem(movieTitle + "NumberEpisode")) - 1;

            saisonElem.selectedIndex = selectedSaison;
            serieElem.selectedIndex = selectedEpisode;

            const ep = selectedEpisode + 1;
            const sais = selectedSaison + 1;

            if (sais === 1) {
                videoElem.src = ep === 1 ? movie["link"] : movie["link" + ep];
            } else {
                videoElem.src = ep === 1 ? movie[sais + "link"] : movie[sais + "link" + ep];
            }

            const saisonValue = saisonElem.value;
            const saisonNumber = saisonValue.substring(6);

            console.log("ta grand mere", movie.episode);
            alert("saison number :", saisonValue);
            if (saisonNumber == 1) {
                alert("saisonnuer1");
                const selectElement = document.getElementById('serie');

                while (selectElement.options.length > 0) {
                    selectElement.remove(0);
                }
            
                // Ajouter les options en fonction du nombre d'épisodes
                for (let i = 1; i <= parseInt(movie.episode); i++) {
                    const option = document.createElement("option");
                    option.text = "Episode " + i;
                    option.value = i;
                    selectElement.appendChild(option);
                }
            } else {
                const episodeLink = movie[saisonNumber + "link" + ep] || movie[saisonNumber + "link"];
                serieElem.value = episodeLink;
            }

        } else {
            serieElem.style.visibility = "hidden";
            saisonElem.style.visibility = "hidden";
        }

    } catch (error) {
        console.error("Une erreur s'est produite dans start :", error);
    }
}



async function start2() {
    try {
        resizeWidth();
        localStorage.setItem("ExploreTag", "rien");
        localStorage.setItem("tagDef", "none");
        displayTrendingMovies();
        for (let y = 0; y <= 4; y++) {
            const movie = await getMovieByIndex(y);
            const NewLink = document.createElement("a");
            const NewImage = document.createElement("img");

            NewLink.href = "html/viewVideo.html";
            NewLink.dataset.tag = movie.tag;
            NewLink.className = "film";
            NewLink.id = movie.titre;

            (function (currentMovie) {
                NewLink.onclick = function () {
                    videoView(currentMovie.titre, currentMovie.link, currentMovie.description, currentMovie.tag, currentMovie.episode, currentMovie.saison);
                };
            })(movie);

            NewImage.id = "img" + y;
            NewImage.src = movie.image;

            document.getElementById("news" + y).appendChild(NewLink);
            NewLink.appendChild(NewImage);

            if (y === 3) {
                var lastVideoData = localStorage.getItem("LastVideo");

                if (lastVideoData) {
                    const LastArray = JSON.parse(localStorage.getItem("LastVideo"));

                    for (var i = 1; i <= 4; i++) {
                        const elementId = "a" + i;
                        const imgId = "img" + i;

                        const lastMovie = await getMovieByTitle(LastArray[i - 1]);

                        document.getElementById(imgId).src = lastMovie.image;
                        const linkElement = document.getElementById(elementId);
                        linkElement.style.visibility = "visible";
                        linkElement.dataset.tag = lastMovie.tag;

                        (async function (index) {
                            const movie = await getMovieByTitle(LastArray[index - 1]);
                            document.getElementById(elementId).onclick = function () {
                                videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                            };
                        })(i);
                    }
                    displayPopularTags();
                } else {
                    document.getElementById("ul_continue").style.display = "none";
                }
            }
        }
        
    } catch (error) {
        console.error("Une erreur s'est produite dans start2 :", error);
    }
}

async function search() {
    try {
        var searchTerm = document.getElementById("search_bar").value.toLowerCase();
        var selectedTag = localStorage.getItem("tagDef");
        
        var parentDiv = document.getElementById("recherche");
        
        if (searchTerm === "" && selectedTag === "none") {
            parentDiv.style.display = "none";
            return;
        } else {
            parentDiv.style.display = "block";
        }

        const movies = await getAllMovies();

        parentDiv.innerHTML = '';

        movies.forEach(movie => {
            if ((searchTerm === "" || movie.titre.toLowerCase().includes(searchTerm)) && (selectedTag === "none" || movie.tag === selectedTag)) {
                
                var nouvelleDiv = document.createElement("div");
                var nouvelleimage = document.createElement("img");
                var nouveauxLink = document.createElement("a");

                nouvelleDiv.className = "movie-card";
                nouvelleDiv.style.display = "block";
                nouvelleDiv.style.position = "relative";
                nouvelleDiv.style.overflowY = "hidden";
                nouvelleimage.src = movie.image;
                nouvelleimage.style.width = "100%";
                nouvelleDiv.style.height = "200px";
                nouvelleDiv.style.marginTop = "10px";
                nouveauxLink.href = "html/viewVideo.html";
                nouveauxLink.dataset.tag = movie.tag;

                nouveauxLink.onclick = function () {
                    videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                };

                nouveauxLink.appendChild(nouvelleimage);
                nouvelleDiv.appendChild(nouveauxLink);
                parentDiv.appendChild(nouvelleDiv);
            }
        });

    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction search :", error);
        alert("Erreur: " + error.message);
    }
}

function searchTag(tag) {
    localStorage.setItem("tagDef", tag);
    
    const buttonCategories = document.getElementById("ButtonCategories");
    
    // Vérifier la largeur de la fenêtre et ajuster en conséquence
    if (window.innerWidth <= 490) {
        buttonCategories.innerHTML = tag;
    } else {
        buttonCategories.innerHTML = "Categories : " + tag;
    }
    search();
}


async function plus() {
    var jsp = JSON.parse(localStorage.getItem("LastVideo"));

    document.getElementById("ul_continue").style.overflowX = "auto";
    document.getElementById("ul_continue").style.overflowY = "hidden";
    document.getElementById("load_card").style.display = "none";
    
    const LastArray = JSON.parse(localStorage.getItem("LastVideo"));

    for (var i = 5; i <= 9; i++) {
        const elementId = "a" + i;
        const imgId = "img" + i;

        const lastMovie = await getMovieByTitle(LastArray[i - 1]);

        var nouvelleDiv = document.createElement("div");
        var nouveauxLink = document.createElement("a");
        var nouveauxImg = document.createElement("img");

        nouvelleDiv.className = "movies_card";
        nouveauxLink.href = "html/viewVideo.html";
        nouveauxLink.className = "film";
        nouveauxLink.id = "a" + i;
        nouveauxLink.dataset.tag = lastMovie.tag;

        (function (index) {
            nouveauxLink.onclick = function () {
                videoView(lastMovie.titre, lastMovie.link, lastMovie.description, lastMovie.tag, lastMovie.episode, lastMovie.saison);
            };
        })(i);

        nouveauxImg.src = lastMovie.image;
        nouveauxImg.id = "img";

        document.getElementById("ul_continue").appendChild(nouvelleDiv);
        nouvelleDiv.appendChild(nouveauxLink);
        nouveauxLink.appendChild(nouveauxImg);
    }
}

    
    
    

async function plus2() {
    try {
        const movies = await getAllMovies();

        // Hide loading elements
        document.getElementById("ul_news").style.overflowX = "auto";
        document.getElementById("ul_news").style.overflowY = "hidden";
        document.getElementById("load_card_news").style.display = "none";
        document.querySelector("#ul_news .load_card").style.display = "none";

        for (let i = 4; i < movies.length; i++) {
            const movie = movies[i];
            const nouvelleDiv = document.createElement("div");
            const nouveauxLink = document.createElement("a");
            const nouveauxImg = document.createElement("img");

            nouvelleDiv.className = "movies_card";
            nouvelleDiv.id = "news" + i;
            nouveauxLink.href = "html/viewVideo.html";
            nouveauxLink.className = "film";
            nouveauxLink.id = movie._id;
            nouveauxLink.dataset.tag = movie.tag;

            (function (currentMovie) {
                nouveauxLink.onclick = function () {
                    videoView(currentMovie.titre, currentMovie.link, currentMovie.description, currentMovie.tag, currentMovie.episode, currentMovie.saison);
                };
            })(movie);

            nouveauxImg.src = movie.image;
            nouveauxImg.id = "img";

            document.getElementById("ul_news").appendChild(nouvelleDiv);
            nouvelleDiv.appendChild(nouveauxLink);
            nouveauxLink.appendChild(nouveauxImg);
        }
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction plus2 :", error);
        alert("Erreur: " + error.message);
    }
}

    
    async function plus_explore(tag) {
        try {
            for (var l = 4; l < 100; l++) {
                var element = document.getElementById("Explore" + l);
                if (element) {
                    element.remove();
                }
            }

            if(tag == localStorage.getItem("ExploreTag")){
                document.getElementById("ul_explore").style.display = "none";
                localStorage.setItem("ExploreTag", "rien");
            }else{
                const movies = await getMoviesByTag(tag);
                localStorage.setItem("ExploreTag", tag);
                
                document.getElementById("ul_explore").style.display = "flex";

                for (var i = 0; i < 4; i++) {
                    var ExploreDiv = document.getElementById("Explore" + i);
                    while (ExploreDiv.firstChild) {
                        ExploreDiv.removeChild(ExploreDiv.firstChild);
                    }
                }
        
                // Ajouter de nouvelles images aux div Explore
                movies.slice(0, 4).forEach((movie, index) => {
                    var ExploreDiv = document.getElementById("Explore" + index);
        
                    var NewImageExplore = document.createElement("img");
                    var NewLinkExplore = document.createElement("a");
        
                    NewImageExplore.src = movie.image;
                    NewImageExplore.style.width = "100%";
                    NewImageExplore.style.height = "100%";
                    NewImageExplore.style.borderRadius = "15px";
                    NewLinkExplore.href = "html/viewVideo.html";
                    NewLinkExplore.className = "film";
                    NewLinkExplore.id = "trend" + index;
        
                    NewLinkExplore.onclick = function() {
                        videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    };
        
                    ExploreDiv.appendChild(NewLinkExplore);
                    NewLinkExplore.appendChild(NewImageExplore);
                });
            }
        } catch (error) {
            console.error("Une erreur s'est produite dans la fonction plus_explore :", error);
            alert("Erreur: " + error.message);
        }
    }
    


    function updateTagsIfEmpty() {
        var keys = Object.keys(baseDeDonnees);
    
        for (var i = 0; i < keys.length; i++) {
            var video = baseDeDonnees[keys[i]];
    
            if (!video.tag) {
                video.tag = "action";
            }
        }
    }
    


    async function displayTrendingMovies() {
        try {
            const tagPopularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};
    
            const sortedTags = Object.keys(tagPopularityData).sort((a, b) => tagPopularityData[b] - tagPopularityData[a]);
    
            let trendIndex = 0;
            for (let index = 0; index < sortedTags.length; index++) {
                const tag = sortedTags[index];
                let movies = await getMoviesByTag(tag);
    
                if (movies.length === 0) continue;
    
                const selectedMovies = shuffleArray(movies).slice(0, 2);
    
                selectedMovies.forEach((movie, movieIndex) => {
                    const trendDiv = document.getElementById(`trend${trendIndex * 2 + movieIndex + 1}`);
                    trendDiv.innerHTML = '';
    
                    const newLink = document.createElement("a");
                    const newImage = document.createElement("img");
    
                    newLink.href = "html/viewVideo.html";
                    newLink.className = "film";
                    newLink.dataset.tag = movie.tag;
    
                    newLink.onclick = function () {
                        videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    };
    
                    newImage.src = movie.image;
                    newImage.style.width = "100%";
                    newImage.style.height = "100%";
                    newImage.style.borderRadius = "15px";
    
                    newLink.appendChild(newImage);
                    trendDiv.appendChild(newLink);
                });
    
                trendIndex++;
            }
    
            while (trendIndex < 2) {
                const randomTag = sortedTags[Math.floor(Math.random() * sortedTags.length)];
                const movies = await getMoviesByTag(randomTag);
    
                if (movies.length === 0) continue;
    
                const selectedMovies = shuffleArray(movies).slice(0, 2);
    
                selectedMovies.forEach((movie, movieIndex) => {
                    const trendDiv = document.getElementById(`trend${trendIndex * 2 + movieIndex + 1}`);
                    trendDiv.innerHTML = '';
    
                    const newLink = document.createElement("a");
                    const newImage = document.createElement("img");
    
                    newLink.href = "html/viewVideo.html";
                    newLink.className = "film";
                    newLink.dataset.tag = movie.tag;
    
                    newLink.onclick = function () {
                        videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    };
    
                    newImage.src = movie.image;
                    newImage.style.width = "100%";
                    newImage.style.height = "100%";
                    newImage.style.borderRadius = "15px";
    
                    newLink.appendChild(newImage);
                    trendDiv.appendChild(newLink);
                });
    
                trendIndex++;
            }
        } catch (error) {
            console.error("Une erreur s'est produite dans la fonction displayTrendingMovies :", error.message);
        }
    }
    
    async function plus3(){
        document.getElementById("ul_trending").style.overflowX = "auto";
        document.getElementById("ul_trending").style.overflowY = "hidden";
        document.getElementById("load_card_trending").style.display = "none";

        const tagPopularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};
        const sortedTags = Object.keys(tagPopularityData).sort((a, b) => tagPopularityData[b] - tagPopularityData[a]);
        const thirdTag = sortedTags[2];
        const movies = await getMoviesByTag(thirdTag);
        var filmUtiliser;

        if (movies.length < 2) {
            alert("Pas assez de films pour afficher.");
            return;
        }

        for(var l = 5; l<7; l++){
            let randomMovie;
            do {
                const randomIndex = Math.floor(Math.random() * movies.length);
                randomMovie = movies[randomIndex];
            } while (filmUtiliser === randomMovie.titre);
            
            filmUtiliser = randomMovie.titre;

            var nouvelleDiv = document.createElement("div");
            var nouveauxLink = document.createElement("a");
            var nouvelleimage = document.createElement("img");
    
            nouvelleDiv.className = "movies_card";
            nouveauxLink.href = "html/viewVideo.html";
            nouveauxLink.className = "film";
            nouvelleDiv.id = "trend" + l;
            nouveauxLink.dataset.tag = thirdTag;
            nouvelleimage.src = randomMovie.image;
            nouvelleimage.id = "img";
            nouveauxLink.onclick = function () {
                videoView(randomMovie.titre,randomMovie.link, randomMovie.description, randomMovie.tag, randomMovie.episode, randomMovie.saison);
            };
    
            document.getElementById("ul_trending").appendChild(nouvelleDiv);
            nouvelleDiv.appendChild(nouveauxLink);
            nouveauxLink.appendChild(nouvelleimage);
        }
    }

    async function plus_categories() {
        const tag = localStorage.getItem("ExploreTag");
        const movie = await getMoviesByTag(tag);

        document.getElementById("ul_explore").style.overflowX = "auto";
        document.getElementById("ul_explore").style.overflowY = "hidden";
        document.getElementById("load_card_explore").style.display = "none";

        for(var l = 5; l<9; l++){
            const movies = movie[l-1];

            var nouvelleDiv = document.createElement("div");
            var nouveauxLink = document.createElement("a");
            var nouvelleimage = document.createElement("img");
    
            nouvelleDiv.className = "movies_card";
            nouveauxLink.href = "html/viewVideo.html";
            nouveauxLink.className = "film";
            nouvelleDiv.id = "Explore"+ (l-1);
            nouveauxLink.dataset.tag = tag;
            nouvelleimage.src = movies.image;
            nouvelleimage.id = "img";
            nouveauxLink.onclick = function () {
                videoView(movies.titre,movies.link, movies.description, movies.tag, movies.episode, movies.saison);
            };
    
            document.getElementById("ul_explore").appendChild(nouvelleDiv);
            nouvelleDiv.appendChild(nouveauxLink);
            nouveauxLink.appendChild(nouvelleimage);
        }
    }


    const selectSaison = document.getElementById('saison');
    const selectSerie = document.getElementById('serie');
    
    selectSaison.addEventListener('change', function() {
      const selectedValue = this.value;
      const videoTitre = localStorage.getItem("videoTitre");
      localStorage.setItem(`${videoTitre}NumberSaison`, selectedValue.substring(6));
      alert("lala" + localStorage.getItem(`${videoTitre}NumberSaison`));
      change(selectedValue, 1);
    });
    
    selectSerie.addEventListener('change', function() {
      const selectedValue = this.value;
      const videoTitre = localStorage.getItem("videoTitre");
      localStorage.setItem(`${videoTitre}NumberEpisode`, selectedValue);
      change(selectedValue, 0);
    });

async function change(x, saison) {
    try {
        const movie = await getMovieByTitle(localStorage.getItem("videoTitre"));
        if(saison == 1){
            const episodeSelect = document.getElementById("serie");
            const selectedEpisodeText = episodeSelect.options[episodeSelect.selectedIndex].text;
            const propertyName = x.substring(6)+'link';

            alert(selectedEpisodeText);

            if(selectedEpisodeText == 1){
                if (x.substring(6) == 1){
                    videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }else{
                    videoView(movie.titre, movie[propertyName], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }
            }else{
                if (x.substring(6) == 1){
                    videoView(movie.titre, movie["link" + selectedEpisodeText], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }else{
                    videoView(movie.titre, movie[propertyName + selectedEpisodeText], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }
            }
        }else{
            const saisonSelect = document.getElementById("saison");
            const selectedSaisonText = saisonSelect.options[saisonSelect.selectedIndex].text;
            alert(selectedSaisonText);
            
            if (selectedSaisonText.substring(6) == 1) {
                const propertyName = 'link' + x;
                alert(propertyName);
                if (x == 1) {
                    videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                } else {
                    videoView(movie.titre, movie[propertyName], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }
            } else {
                const propertyName = selectedSaisonText.substring(6) + 'link' + x;
                alert(selectedSaisonText.substring(6));
                if (x == 1) {
                    videoView(movie.titre, movie[selectedSaisonText.substring(6) + "link"], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                } else {
                    videoView(movie.titre, movie[propertyName], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }
            }
        }

    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction change :", error);
        alert("Erreur: " + error.message);
    }
}

async function populateCatalogue() {
    try {
        const movies = await getAllMovies();
        console.log("Liste de tous les films :", movies);

        const catalogueDiv = document.getElementById("cata");

        movies.forEach((movie, index) => {
            var nouvelleDiv = document.createElement("div");
            var nouveauxLink = document.createElement("a");
            var nouvelleimage = document.createElement("img");
    
            nouvelleDiv.className = "movies_card";
            nouveauxLink.href = "viewVideo.html";
            nouveauxLink.className = "film";
            nouvelleDiv.id = "Catalogue" + index;
            nouveauxLink.dataset.tag = movie.tag;
            if(movie.image.indexOf("image/") > -1){
                nouvelleimage.src = "../" + movie.image;
            }else{
                nouvelleimage.src = movie.image;
            }
            
            nouvelleimage.id = "img";
            nouveauxLink.onclick = function () {
                videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
            };
    
            catalogueDiv.appendChild(nouvelleDiv);
            nouvelleDiv.appendChild(nouveauxLink);
            nouveauxLink.appendChild(nouvelleimage);
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors du peuplement du catalogue :", error);
        alert("Erreur: " + error.message);
    }
}
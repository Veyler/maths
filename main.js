
var tentatives = [];

var ongletactuel = "eleve";
var exerciceouvert = -1; // -1 = aucun exercice ouvert
var resultats = [];
var aValide = false;

var exercices = [
    {
        id: "suites1",
        classe: "L1 Mathématiques",
        chapitre: "Suites",
        title: "Suite récurrente",
        questions: [
        {
            type: "nombre",
            enonce: "Soit u0 = 1 et u(n+1) = 2*u(n) + 1. Combien vaut u3 ?",
            response: 15
        },
        {
            type: "qcm",
            enonce: "Quelle méthode de preuve utilise-t-on pour une formule valable pour tout n ?",
            choix: ["Récurrence", "Absurde", "Contraposée"],
            response: 0
        }],
        correction: "u1 = 3, u2 = 7, u3 = 15. \nPour la formule générale, on utilise une démonstration par récurrence."
    }
];


// Met en minuscule et supprime les espaces
function clean(texte) {
    var resultat = "";
    texte = texte.toLowerCase();
    for (var i = 0; i < texte.length; i++) {
    if (texte[i] !== " ") {
        resultat = resultat + texte[i];
    }
    }
    return resultat;
}

// Vérifier la réponse en fonction du type de fonction
function verify(question, response){
    
    if (question.type === "nombre"){
        // On accepte la virgule
        var text = response.split(",").join(".");
        var number = parseFloat(text);
        return number === question.response;
    }

    if (question.type === "qcm"){
        return Number(response) === question.response;
    }

    if (question.type === "text"){
        // On compare avec chaque réponse possible
        for (var i = 0; i < question.response.length; i++){
            if (clean(response) === clean(question.response[i])){
                return true;
            }
        }
        return false;
    }
    return false;
}

function draw_list(){
    var html = "";

    for (var i = 0; i < exercices.length; i++){
        var exercice = exercices[i];
        html = html + '<div class="carte">';
        html = html + "<h3>" + exercice.title + "</h3>";
        html = html + "<p>Chapitre : " + exercice.chapitre + " (" + exercice.questions.length + " questions)</p>";
        html = html + '<button onclick="open_exercice(' + i + ')">Commencer</button>';
        html = html + "</div>";
    }

    if (html === "") {
        html = "<p>Aucun exercice pour cette classe.</p>";
    }
    return html;
}

function draw_question(numero, question) {
    var classe = "question";
    if (aValide === true) {
        if (resultats[numero] === true) {
            classe = "question juste";
        } else {
            classe = "question faux";
        }
    }

    var html = '<div class="' + classe + '">';
    html = html + "<p><b>Question " + (numero + 1) + " :</b> " + question.enonce + "</p>";

    if (question.type === "qcm") {
        for (var i = 0; i < question.choix.length; i++) {
            html = html + '<label><input type="radio" name="choix' + numero + '" value="' + i + '"> ' + question.choix[i] + "</label><br>";
        }
    } else {
        html = html + '<input type="text" id="reponse' + numero + '">';
    }

    if (aValide === true) {
        if (resultats[numero] === true) {
          html = html + "<p>✔ Bonne réponse</p>";
        } else {
          html = html + "<p>✘ Mauvaise réponse</p>";
        }
    }

    html = html + "</div>";
    return html;
}

function draw_exercice() {
    var exercice = exercices[exerciceouvert];

    var html = '<button onclick="back_to_list()">← Retour</button>';
    html = html + '<div class="carte">';
    html = html + "<h2>" + exercice.title + "</h2>";

    for (var i = 0; i < exercice.questions.length; i++) {
        html = html + draw_question(i, exercice.questions[i]);
    }

    if (aValide === false) {
        html = html + '<button onclick="valider()">Vérifier mes réponses</button>';
    } else {
        var score = 0;
        for (var j = 0; j < resultats.length; j++) {
          if (resultats[j] === true) {
            score = score + 1;
          }
        }
        html = html + "<p><b>Score : " + score + " / " + exercice.questions.length + "</b></p>";
        html = html + '<div class="correction"><b>Correction</b>\n' + exercice.correction + "</div>";
        html = html + '<button onclick="restart()">Réessayer</button>';
    }

    html = html + "</div>";
    return html;
}

function draw_profil() {
    var html = '<div class="carte"><h2>Ma progression</h2>';

    for (var i = 0; i < exercices.length; i++) {
        var exercice = exercices[i];
        
        var total = 0;
        var bonnes = 0;
        for (var j = 0; j < tentatives.length; j++) {
            if (tentatives[j].exercice === exercice.id) {
                total = total + 1;
                if (tentatives[j].juste === true) {
                    bonnes = bonnes + 1;
                }
            }
        }

        html = html + "<p><b>" + exercice.title + "</b> : ";
        if (total === 0) {
            html = html + "pas encore travaillé";
        } else {
            var pourcentage = Math.round(100 * bonnes / total);
            html = html + pourcentage + " % de réussite (" + bonnes + " bonnes réponses sur " + total + ")";
        }
        html = html + "</p>";
        
    }

    html = html + "</div>";
    return html;
}

function draw_teacher() {

    var modele = {
        id: "mon-exercice",
        chapitre: "Suites",
        title: "Mon nouvel exercice",
        questions: [
            { type: "nombre", enonce: "Combien font 6 x 7 ?", response: 42 }
        ],
        correction: "6 x 7 = 42"
    };

    var html = '<div class="carte"><h2>Ajouter un exercice</h2>';
    html = html + "<p>Modifie le texte ci-dessous, puis clique sur le bouton.</p>";
    html = html + '<textarea id="zoneExercice">' + JSON.stringify(modele, null, 2) + "</textarea>";
    html = html + '<button onclick="ajouterExercice()">Ajouter l\'exercice</button>';
    html = html + '<p id="message"></p></div>';
    return html;
}

function show_pages(){
    var page = document.getElementById("view");

    if (ongletactuel === "eleve"){
        if (exerciceouvert === -1){
            page.innerHTML = draw_list();
        } else {
            page.innerHTML = draw_exercice();
        }
    }
    if (ongletactuel === "profil"){
        page.innerHTML = draw_profil();
    }
    if (ongletactuel === "prof"){
        page.innerHTML = draw_teacher();
    }
}

function switch_tab(name){
    ongletactuel = name;
    exerciceouvert = -1;
    aValide = false;
    show_pages();
}

function open_exercice(number){
    exerciceouvert = number;
    aValide = false;
    show_pages();
}

function back_to_list(){
    exerciceouvert = -1;
    aValide = false;
    show_pages();
}

function restart(){
    aValide = false;
    show_pages();
}

function valider() {
    var exo = exercices[exerciceouvert];
    resultats = [];

    for (var i = 0; i < exo.questions.length; i++) {
        var question = exo.questions[i];
        var reponse = "";

        if (question.type === "qcm") {
          
            reponse = "aucune";
            var boutons = document.getElementsByName("choix" + i);
            for (var j = 0; j < boutons.length; j++) {
                if (boutons[j].checked === true) {
                reponse = boutons[j].value;
                }
            }
        } else {
            reponse = document.getElementById("reponse" + i).value;
        }

        var istrue = verify(question, reponse);
        resultats.push(istrue);
        tentatives.push({ exercice: exo.id, juste: istrue });
    }

    aValide = true;
    show_pages();
}

function ajouterExercice() {
    var message = document.getElementById("message");
    var text = document.getElementById("zoneExercice").value;


    try {
        var new_exercice = JSON.parse(text);

        if (!new_exercice.id || !new_exercice.title || !new_exercice.questions) {
            message.innerHTML = "Erreur : il manque id, classe, titre ou questions.";
            return;
        }

        exercices.push(new_exercice);
        message.innerHTML = "Exercice ajouté ! Va dans l'onglet Élève pour le voir.";

      } catch (erreur) {
        message.innerHTML = "Erreur : le texte n'est pas valide (virgule ou guillemet oublié ?).";
    }
}

show_pages()
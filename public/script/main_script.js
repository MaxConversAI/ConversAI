// In questo script:
// - funzione di debug
// - dichiarazione degli elementi
// - variabili che memorizzano le conversazioni e progetti selezionati dall'utente
// - funzioni dei button della pagina index.html
// - assegnazione event listener ai button della pagina

//const { response } = require("express");


//DA FARE
//cross conv x prog
//cross messaggio x conv

//////////// DEBUG
banner = document.getElementById("top_banner").addEventListener("click", debaco); //ALENKA DOCET

function debaco() {
  // fetch ('/api/getProgetti')
  //  .then(res => res.json())
  //  .then(data => {console.log(data)});

  console.log("vediamo se funziona");
}
//////////// FINE DEBUG



//////////// VARIABILI PER MEMORIZZARE CONVERSAZIONI E PROGETTI SELEZIONATI DALL'UTENTE

let selectedConversazione;
let selectedProgetto;

//////////// FUNZIONI BUTTON
    // INSERISCI NUOVA CONVERSAZIONE

    // check se è selezionato un progetto
function insertNewConversazione() {


     // topic della conversazione
    let convers_topic = document.getElementById("conv_name").value; // topic della conversazione
     // descrizione delle conversazione
    let convers_descr = document.getElementById("conv_descr").value; // descrizione delle conversazione


    // inserisci una nuova conversazione nel DB
    fetch ('/api/newConversation', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({
            topic: convers_topic,
            descrizione: convers_descr,
            prog_id: selectedProgetto
        })
    })
    .then (res => res.json())
    .then (data => {
        // aggiorno le conversazioni
        document.getElementById("conv_name").value = "";
        document.getElementById("conv_descr").value = "";
        getConversazioni(selectedProgetto);
    })
    .catch(err => console.error(err));

    // svuoto i campi
};



    // INSERISCI NUOVO PROGETTO
function insertNewProject () {
    //catturo i dati
    let nome_project = document.getElementById("project_name").value;
    let descr_project = document.getElementById("project_descr").value;

    //api call
    fetch ('/api/newProject', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({
            proj_name: nome_project,
            proj_descrizione: descr_project
        })
    })
    .then (res => res.json)
        .then (data => {console.log(data);
            if (data.successo) {
                console.log("Progetto creato")
            }
        });
    
    // svuoto i campi
    document.getElementById("project_name").value = "";
    document.getElementById("project_descr").value = "";

    //aggiorno i progetti nella home
    getProgetti();

}


        // INVIA NUOVO MESSAGGIO
function sendNewMessage(idRuolo) {
    if (!selectedConversazione) {
    alert("seleziona prima una conversazione");
    return;
    } else {
        const txtArea = document.getElementById("user_chat_txtarea");
        const newMessage = txtArea.value;

        //api call method:post
        fetch ('/api/sendMessage', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},

            body: JSON.stringify({
                ruolo_id: idRuolo,
                message: newMessage,
                conv_id: selectedConversazione
            })
        }
  
    )
        .then (res => res.json())
        .then (data => {
            console.log(data);
            
            const sezMessaggi = document.getElementById("sezione_chat");
            if (data.successo) {
                creaBubbleMess(sezMessaggi, data);
                txtArea.value = "";
                console.log(data);
                console.log("mess inviato");
                sezMessaggi.scrollTop = sezMessaggi.scrollHeight;
            }
        });
    }
}




//////////// FETCH MESSAGGI DA DB
function getMessaggi(conv_id) {
        fetch('/api/getMessaggi', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({
            conv_id: conv_id
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const sezMessaggi = document.getElementById("sezione_chat");
            sezMessaggi.innerHTML = "";

            data.forEach(mess => {
                creaBubbleMess(sezMessaggi, mess);
            })

             sezMessaggi.scrollTop = sezMessaggi.scrollHeight;
        })
    ;    
}
//////////// CHECK SE ESISTONO PROGETTI 

const check_progetti = () => {
    //if 'SELECT * FROM CAI_Progetti IS NULL'
    fetch ('api/check_progetti', {
        cache: 'no-store'
    })
    .then (response => response.json())
    .then (data => {
        if (data.hasData) {
            console.log("dati trovati");
            const sezProgetti = document.getElementById("sel_progetti");
            console.log(data);
        } else {
            console.log("dati non trovati");
        }
    });
}

//////////// FETCH CONVERSAZIONI DA DB
const getConversazioni = (x) => {
    fetch ('/api/get_conversazioni', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({
            prog_id: x
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const sezConversazioni = document.getElementById("sel_conversazioni");
        sezConversazioni.innerHTML = ""; //svuoto la sezione prima di scriverci dentro
        data.forEach(convers => {
            // per ogni conversazione inserisco un div
            const div = document.createElement("div");
            div.textContent = convers.topic;
            div.dataset.idConversazione = convers.id;
            div.classList.add("nomeConversazione", "selectable");

            div.addEventListener("click", () => {
                
                div.dataset.idConversazione = convers.id;
                getMessaggi(convers.id); 

                resetConversazioniSelezionate();
                selectedConversazione = convers.id;
                div.classList.toggle("selected");
            })      

            sezConversazioni.appendChild(div);

        })
    })
    ;
}


//////////// FETCH PROGETTI DA DB
const getProgetti = () => {
    fetch ('api/get_progetti')
    .then (response => response.json())
    .then (data => {
        if (data.length > 0) {
            console.log("dati trovati");
            const sezProgetti = document.getElementById("sel_progetti");
            sezProgetti.innerHTML = ""; // svuoto la sezione prima di scriverci dentro
            data.forEach(progetto => {

                //per ogni progetto ottenuto inseriamo un div contentente il nome del progetto
                const div = document.createElement("div");
                div.textContent = progetto.nome;
                div.dataset.idProgetto = progetto.id; //inseriamo nel dataset l'id del progetto
                div.classList.add("nomeProgetto", "selectable");    // creiamo una classe CSS

                div.addEventListener("click", () => {
                    //console.log("progetto "+ div.dataset.idProgetto);
                    getConversazioni(progetto.id);   //se click sul nome progetto
                    //console.log("qua funziona");              //memorizzo l'id per visualizzare le conversazioni
                    selectedProgetto = div.dataset.idProgetto;  //e per salvare le conversazioni associate al progetto tramite tabella cross
                    selectedConversazione = null;
                    console.log("id progetto selezionato " + selectedProgetto);
                    resetProgettiSelezionati();
                    div.classList.toggle("selected");
                 });

                sezProgetti.appendChild(div);
            });

        } else {
            console.log(data);
        }
    });
}

//////////// FETCH RISPOSTA ASSISTENTE DA DB

const getResponse = () => {
    fetch (req, res)
}

// PRENDE I PROGETTI ALL'APERTURA DELLA PAGINA
getProgetti();



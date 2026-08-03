// - assegnazione event listener ai button della pagina
// - funzioni per effetto bagliore dinamico
// - apertura e chiusura finestre modali
// - trascinamento finestre modali
// - generazione bubble dei messaggi


//////////// ASSEGNAZIONI BUTTON

document.getElementById("ins_new_conv").addEventListener("click", insertNewConversazione);
document.getElementById("ins_new_proj").addEventListener("click", insertNewProject);
 //chiama la funzione per salvare un messaggio con ruolo 1 (utente)
document.getElementById("send_user_chat_msg").addEventListener("click", () => {sendNewMessage(1)});

///// variabile in millisecondi per il ritardo della risposta dell'assistente
let ritardoRisposta = 800;


// se si preme invio mentre la sezione input dell'utente è attiva si invia il messaggio
const chat_txtarea = document.getElementById("user_chat_txtarea");
chat_txtarea.addEventListener("keydown", (tasto) => {
   
     if (tasto.code == "Enter") {
       sendNewMessage(1);
       chat_txtarea.value = "";
    }

});



// card.getBoundingClientRect() trova le coordinate dei bordi esterni dell'elemento
// poi per ciascun elemento con classe "card" assegna un eventListener che ascolta
// il movimento del mouse e ne cattura le coordinate
// per trasformarle in proprietà CSS per stabilire il centro del gradiente per dare l'impressione
// che l'effetto di luce segua il cursore
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();        

        card.style.setProperty("--y", `${e.clientY - rect.top}px`);
        card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    })
});


document.querySelectorAll(".glow").forEach(glow => {
    glow.addEventListener('mousemove', (e) => {
        const rect = glow.getBoundingClientRect();        

        glow.style.setProperty("--x", `${e.clientX - rect.left}px`);
        glow.style.setProperty("--y", `${e.clientY - rect.top}px`);
    })
});


////////////// DRAG E MOVE MODALI

let dragging;
let offsetX = 0;
let offsetY = 0;


// per ogni elemento con classe "draggable" aggiunge un listener che ascolta quando il tasto
// del mouse viene tenuto schiacciato e inserisce le coordinate del cursore dentro a delle variabili

document.querySelectorAll(".draggable").forEach(drag => {
    drag.addEventListener("mousedown", (e) => {

        dragging = drag;

        offsetX = e.clientX - drag.offsetLeft;
        offsetY = e.clientY - drag.offsetTop;


    })


})
    document.addEventListener("mousemove", (e) => {    
        if (!dragging) {
        return;
        }

        dragging.style.left =  `${e.clientX - offsetX}px`;
        dragging.style.top = `${e.clientY - offsetY}px`;

    })

    document.addEventListener("mouseup", (e) => {

        dragging = null;

    })





//script per aprire finestre modali

const buttons = document.getElementsByClassName("arr_opener");

for (const button of buttons) {
    button.addEventListener("click", function displayModale() {
        const targetDiv = document.getElementById(button.dataset.target_id);
        console.log(targetDiv);
        if (!selectedProgetto && targetDiv.id == "modal_conv") {
                alert("seleziona prima un progetto!");
                return;
            } else {
            targetDiv.classList.toggle("modal_hidden");
            document.getElementById("separatore").classList.toggle("modal_hidden");
        }
    });
}


// toglie la classe ai progetti selezionati, viene chiamata al momento del click
function resetProgettiSelezionati() {
    let itemSelezionati = document.getElementsByClassName("selected");

    for (let sel of itemSelezionati) {
        let progetti = document.getElementsByClassName("nomeProgetto");
        for (let pro of progetti) {
            pro.classList.remove("selected");
        }
    }
}


// toglie la classe alle conversazioni selezionate, viene chiamata al momento del click
function resetConversazioniSelezionate() {
    let itemSelezionati = document.getElementsByClassName("selected");

    for (let sel of itemSelezionati) {
        let conversazioni = document.getElementsByClassName("nomeConversazione");
        for (let con of conversazioni) {
            con.classList.remove("selected");
        }
    }
}




// crea il bubble del messaggio quando richiedo i messaggi dal DB
function creaBubbleMess(sezMsg, mess) {
    const divContainer = document.createElement("div");
    const divMsg = document.createElement("div");
    const divMsgOrario = document.createElement("div");

    divMsg.textContent = mess.testo;
    let dataInvio = new Date(mess.data_invio); //informo il sistema che si tratta di una data
    divMsgOrario.textContent = dataInvio.toLocaleDateString()+" "+ dataInvio.toLocaleTimeString(); // lo converto in data locale
    divMsgOrario.classList.add("msg-orario");

    divContainer.dataset.idMessaggio = mess.id;
    divContainer.dataset.ruolo = mess.ruolo_id;

    ///////////////
    if (mess.ruolo_id == 1) {
        divContainer.classList.add("msg-utente");
        divMsg.classList.add("msg-utente-testo");
    } else {
        divContainer.classList.add("msg-assistente");
        divMsg.classList.add("msg-assistente-testo");
    }
///////////////////////////////////////////
    divContainer.appendChild(divMsg);
    divContainer.appendChild(divMsgOrario);
    sezMsg.appendChild(divContainer);
}


// crea il bubble del messaggio al momento dell'invio
// con ritardo per simulare il tempo di calcolo dell'assistente IA
function creaBubbleMessInst(sezMsg, mess) {
    const divContainer = document.createElement("div");
    const divMsg = document.createElement("div");
    const divMsgOrario = document.createElement("div");

    divMsg.textContent = mess.testo;
    let dataInvio = new Date(mess.data_invio); //informo il sistema che si tratta di una data
    divMsgOrario.textContent = dataInvio.toLocaleDateString()+" "+ dataInvio.toLocaleTimeString(); // lo converto in data locale
    divMsgOrario.classList.add("msg-orario");

    divContainer.dataset.idMessaggio = mess.id;
    divContainer.dataset.ruolo = mess.ruolo_id;

    ////////////////
    if (mess.ruolo_id == 1) {
        divContainer.classList.add("msg-utente");
        divMsg.classList.add("msg-utente-testo");
        
        divContainer.appendChild(divMsg);
        divContainer.appendChild(divMsgOrario);
        sezMsg.appendChild(divContainer);

        sezMsg.scrollTop = sezMsg.scrollHeight;
        //////////
    } else {
         divContainer.classList.add("msg-assistente");
        divMsg.classList.add("msg-assistente-testo");

        setTimeout( () => {
            divContainer.appendChild(divMsg);
            divContainer.appendChild(divMsgOrario);
            sezMsg.appendChild(divContainer);
            sezMsg.scrollTop = sezMsg.scrollHeight;
            }, ritardoRisposta
        );
    }

}

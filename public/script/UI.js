//////////// ASSEGNAZIONI BUTTON

document.getElementById("ins_new_conv").addEventListener("click", insertNewConversazione);
document.getElementById("ins_new_proj").addEventListener("click", insertNewProject);
 //chiama la funzione per salvare un messaggio con ruolo 1 (utente)
document.getElementById("send_user_chat_msg").addEventListener("click", () => {sendNewMessage(1)});



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

function resetProgettiSelezionati() {
    let itemSelezionati = document.getElementsByClassName("selected");

    for (let sel of itemSelezionati) {
        let progetti = document.getElementsByClassName("nomeProgetto");
        for (let pro of progetti) {
            pro.classList.remove("selected");
        }
    }
}

function resetConversazioniSelezionate() {
    let itemSelezionati = document.getElementsByClassName("selected");

    for (let sel of itemSelezionati) {
        let conversazioni = document.getElementsByClassName("nomeConversazione");
        for (let con of conversazioni) {
            con.classList.remove("selected");
        }
    }
}



// seleziona il progetto e popola le conversazioni


// crea il bubble del messaggio
function creaBubbleMess(sezMsg, mess) {
    const divContainer = document.createElement("div");
    const divMsg = document.createElement("div");
    const divMsgOrario = document.createElement("div");

    divMsg.textContent = mess.testo;
    let dataInvio = new Date(mess.data_invio); //informo il sistema che si tratta di una data
    divMsgOrario.textContent = dataInvio.toLocaleDateString()+" "+ dataInvio.toLocaleTimeString(); // lo converto in data locale
    divMsgOrario.classList.add("msg-orario");

    divContainer.dataset.idMessaggio = mess.id;
    divContainer.dataset.ruolo = mess.ruolo;
    if (mess.ruolo = 1) {
        divContainer.classList.add("msg-utente");
        divMsg.classList.add("msg-utente-testo");
    }
    divContainer.appendChild(divMsg);
    divContainer.appendChild(divMsgOrario);
    sezMsg.appendChild(divContainer);
}


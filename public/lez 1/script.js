document.getElementById("boop").addEventListener("click", provaFetch);
document.getElementById("beep").addEventListener("click", readFetch);
function apriAvviso() {
    alert("hai schiacciato il bottone");
}

function provaFetch() {

    // nome dell'api presente nella configurazione del server
    fetch('/api/prova', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},

            // il corpo del json
            body: JSON.stringify({
                id: 2,
                nome: 'Mario',
                descrizione: 'Rossi'
            })
        })
    .then (response => response.json())
    .then(data => console.log(data));
}

function readFetch() {
    fetch('/api/provaRead?id=1')
    .then (response => response.json())
    .then (data => {
            document.getElementById("insertQua").innerText = `${data.id} ${data.nome} ${data.descr}`;
    });


}
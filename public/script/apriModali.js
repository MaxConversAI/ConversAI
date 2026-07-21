//script per aprire finestre modali

const buttons = document.getElementsByClassName("arr_opener");

for (const button of buttons) {
    button.addEventListener("click", function displayModale() {
        const targetDiv = document.getElementById(button.dataset.target_id);

        if (targetDiv) {
            targetDiv.classList.toggle("modal_hidden");
        }
    });
}

/////////////////////////////////////////////////////////////////////


/*
function toggleDisplayModale() {
    
}

function displayModale() {
    let target_id = document.getElementById(Element.getAttribute("target_id"));
    
    console.log(Element.getAttribute("target_id"));
    target_id.classList.toggle("modal_hidden");
}
    */
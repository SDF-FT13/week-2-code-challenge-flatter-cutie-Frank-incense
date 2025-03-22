// Your code here
const characterBar = document.querySelector("div#character-bar")
const detailedInfo = document.querySelector("div#detailed-info")
const vote = document.querySelector("form#votes-form")
let characterList = [];

function getCharacters(){
    fetch("http://localhost:3000/characters")
    .then(res=> res.json())
    .then(characters=> {
        characterList = characters
        displayCharacter(characters)
        const span = document.querySelectorAll("div#character-bar span")
        addClickListener(span)
        vote.addEventListener("submit",submitVote)
    })
}

function displayCharacter(characters){
    characters.forEach(character => {
        characterBar.innerHTML += `
            <span>${character.name}</span>
        `

    });

}
function addClickListener(spanList){
    spanList.forEach(span=>{
        span.addEventListener("click", handleClick)
    })
}

function handleClick(e){
    const p = detailedInfo.firstElementChild
    const img = p.nextElementSibling
    const votes = img.nextElementSibling.firstElementChild
    characterList.forEach((character)=>{
        if (character.name == e.target.textContent){
            p.textContent = character.name
            img.src = character.image
            img.alt = character.name
            votes.textContent = character.votes
        }
    })
}
function submitVote(e){
    e.preventDefault()
    const formdata = new FormData(e.target)
    if (Number(e.target.votes.value) && Number(e.target.votes.value) > 0){
        let p = detailedInfo.firstElementChild
        characterList.forEach(character => {
            if (p.textContent === character.name){
                patchVotes(formdata, character.id)
            }
        })   
    }
    else{
        alert("Kindly Input a positive number")
    }
    e.target.reset()
}
function patchVotes(voteValue, id){
    const voteData = {
        votes: voteValue.get("votes")
    }
    fetch(`http://localhost:3000/characters/${id}`, {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(voteData)
    }).then(res => res.json())
    .then(data => {
        const p = detailedInfo.firstElementChild
        p.textContent = data.votes
    })
}

function main(){
    getCharacters()
    
}

main()
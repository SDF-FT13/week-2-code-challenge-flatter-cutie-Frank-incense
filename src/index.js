// Your code here
const characterBar = document.querySelector("div#character-bar")
const detailedInfo = document.querySelector("div#detailed-info")
const vote = document.querySelector("form#votes-form")
const reset = document.querySelector("#reset-btn")
let characterList;

function getCharacters(){
    return fetch("http://localhost:3000/characters")
    .then(res=> res.json())
    .then(characters => {
        displayCharacters(characters)
        characterList = characters
    })
}
// First user story 
function displayCharacters(characterList){
    characterList.forEach(character => {

        characterBar.innerHTML += `
            <span id="${character.id}">${character.name}</span>
        `
    });
    // Second user story
    listenForClicks()
}

function listenForClicks(){
    const span = characterBar.querySelectorAll("span")
    // console.log(span)
    span.forEach((node)=>{
        node.addEventListener("click", handleClick)
    })
}

function handleClick(e){
    fetch(`http://localhost:3000/characters/${e.target.id}`)
    .then(res=> res.json())
    .then(data =>{
        const p = detailedInfo.firstElementChild
        const img = p.nextElementSibling
        const vote = img.nextElementSibling.firstElementChild
        p.textContent = data.name
        img.src = data.image
        vote.textContent = data.votes
    })   
}

document.querySelector("form#votes-form").addEventListener("submit", addVotes)

function addVotes(e){
    e.preventDefault()
    
    if (Number(e.target.votes.value) && Number(e.target.votes.value) > 0){
        const formdata = new FormData(e.target)
        let character = detailedInfo.firstElementChild.textContent
        characterList.forEach( char =>{
            getCharacterData(char.id)
            console.log(char.votes)
            if(char.name === character){
                postVote(formdata, char, char.votes)
            }
        })
    }
    else{
        alert("Kindly input a positive integer or number greater than 0")
    }
    e.target.reset()
}

function postVote(vote, char, votes){
    let voteData = {
        votes : Number(vote.get("votes")) + Number(votes)
    }
    
    fetch(`http://localhost:3000/characters/${char.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(voteData)
    })
    .then(res=> res.json())
    .then(data => {
        let voteElement = detailedInfo.querySelector("#vote-count")
        voteElement.textContent = data.votes        
    })
}

function getCharacterData(){
    return fetch(`http://localhost:3000/characters`)
        .then(res=>res.json())
        .then(data=>characterList = data)
}

reset.addEventListener("click", handleReset)

function handleReset(e){
    characterList.forEach(character=>{
        character.votes = 0;
        fetch(`http://localhost:3000/characters/${character.id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(character)
        })
        .then(res=> res.json())
        .then(data=> {
            const p = detailedInfo.firstElementChild
            const img = p.nextElementSibling
            const vote = img.nextElementSibling.firstElementChild
            p.textContent = data.name
            img.src = data.image
            vote.textContent = data.votes
        })
    })
}

getCharacters()
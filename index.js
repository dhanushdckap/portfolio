//my carry starts scroll animation

let button  = document.querySelector("#scroll");
let container = document.querySelector("#demo");
button.addEventListener("click",()=>{
    const containerOffset = container.offsetTop;
    window.scrollTo(0, containerOffset);
})

let Skill_set = document.querySelector("#Skill_set");
let skills_display = document.querySelector(".skills");
Skill_set.addEventListener("click",()=>{
    const containerOffset = skills_display.offsetTop;
    window.scrollTo(0, containerOffset);
})
    
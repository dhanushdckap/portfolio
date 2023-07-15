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


/*--------------------
Vars
--------------------*/
let progress = 50
let startX = 0
let active = 0
let isDown = false

const speedWheel = 0.02
const speedDrag = -0.1

const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index-active)/$items.length)
}

const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor(progress/100*($items.length-1))
  
  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    progress = (i/$items.length) * 100 + 10
    animate()
  })
})

const handleMouseMove = (e) => {
  if (e.type === 'mousemove') {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })
  }
  if (!isDown) return
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const mouseProgress = (x - startX) * speedDrag
  progress = progress + mouseProgress
  startX = x
  animate()
}

document.addEventListener('mousemove', handleMouseMove);


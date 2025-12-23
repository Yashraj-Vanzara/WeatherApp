const slides=document.querySelectorAll('.slide')
const leftbtn=document.querySelector(".leftbtn")
const rightbtn=document.querySelector(".rightbtn")
// console.log(slides)
let counter=0
slides.forEach((slides,index)=>{
  slides.style.left=`${index*100}%`
})

const slider=()=>{
    slides.forEach((slide)=>(
      slide.style.transform=`translateX(-${counter*100}%)`
    ))
}


leftbtn.addEventListener('click',function(e){
  
  counter--
    if (counter < 0) {
    counter = slides.length - 1
  }
  slider()
})

rightbtn.addEventListener('click',function(e){
    
  counter++
  if (counter >= slides.length) {
    counter = 0
  }
  slider()
})
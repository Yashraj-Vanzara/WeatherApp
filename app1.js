window.addEventListener('load',()=>{
       getimages()
})


const imageContainer=document.querySelector('.imageContainer')
const h6=document.querySelector(".h6")
async function getimages() {
    const city=localStorage.getItem("CityImagename")

    
  const response=await fetch(`https://api.unsplash.com/search/photos?query=${city}&per_page=20&client_id=JlI5BycBBALnFYLbkACTINd8o_fnz7LccN-xoXPajOQ`)
  //  await console.log(response.json())
  h6.textContent=`This are some Images for ${city}`
  const data=await response.json()
  data.results.forEach(photo=> {
    const image=document.createElement('img')
  image.src=photo.urls.small
  image.classList.add('cityimage')
console.log(photo.urls.small)
 imageContainer.appendChild(image)
    
  });
  
//   imageContainer.appendChild(image)

  console.log(data)

  
}
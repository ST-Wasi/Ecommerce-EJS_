const allTheLikeButtons = document.querySelectorAll('.like-btn');
const plusButton = document.querySelector('.button-plus')
const quantity = document.querySelector('.quantity');
const totalCartValue = document.querySelector('.totalCartValue');

async function increaseQty(productId,plusButton){
    try {
        const response = await axios({
            method: 'post',
            url: `/product/${productId}/cart`,
            headers:{
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        quantity.value++;
    } catch (error) {
        if(error.response.status === 401){
            window.location.replace('/login');
        }
    }
}

function selectCategory(category) {
    document.getElementById('selectedCategory').value = category;
    document.getElementById('btnGroupDrop1').innerText = 'Category: ' + category;
  }

async function likeButton(productId,btn){
    try {
        const response = await axios({
            method: 'post',
            url: `/product/${productId}/like`,
            headers:{
                'X-Requested-With': 'XMLHttpRequest'
            }
           })
           if(btn.children[0].classList.contains('fa-regular')){
            btn.children[0].classList.remove('fa-regular')
            btn.children[0].classList.add('fa-solid')
        }else{
            btn.children[0].classList.remove('fa-solid')
            btn.children[0].classList.add('fa-regular')
        }
    } catch(e){
        if(e.response.status === 401){
            window.location.replace('/login');
        }
    }
   
}

for(let btn of allTheLikeButtons){
    btn.addEventListener('click',()=>{
        const productId = btn.getAttribute('productId')
        likeButton(productId,btn);
    })
}

plusButton.addEventListener('click',()=>{
    const productId = plusButton.getAttribute('productId')
    increaseQty(productId,plusButton)
})
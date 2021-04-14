const form = document.querySelector('.form')
const nameEl = document.getElementById('name')
const cost = document.getElementById('cost')
const error = document.getElementById('error')

form.addEventListener('submit', e =>{
    e.preventDefault()

    if(nameEl.value && cost.value){
       const item ={
            name: nameEl.value,
            cost: parseInt(cost.value)
       }

       db.collection('Expenses').add(item).then(res => {
        nameEl.value = '',
        cost.value = ''
        })
        
    }else{
        error.innerText ='Please enter values before submitting'
    }
})
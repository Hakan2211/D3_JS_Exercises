const btns = document.querySelectorAll('button')
const form = document.querySelector('.form')
const formAct = document.querySelector('.form p span')
const input = document.querySelector('input')
const error = document.querySelector('.error')

let activity = 'cycling'

btns.forEach(btn =>{
    btn.addEventListener('click', e => {
        //get activity
        activity = e.target.dataset.activity

        //remove and add activity class

        btns.forEach(btn => btn.classList.remove('active'))
        e.target.classList.add('active')

        // ser id of input field

        input.setAttribute('id', activity)

        //set text of form span
        formAct.innerText = activity

        //call the update function
        update(data);
    })
})

//from submit

form.addEventListener('submit', e =>{
    e.preventDefault()

    const distance = parseInt(input.value)
    if(distance){
        db.collection('activities').add({
            distance,
            activity,
            date: new Date().toString() 
        }).then(() =>{
            error.innerText = ''
            input.value = ''
               
        })
    }else{
        error.innerText =' Please Enter a valid distance '
    }
})

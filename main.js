let form = document.querySelector('.form')
let formItems = document.querySelectorAll('[data-related]')
let fieldInputs = document.querySelectorAll('input:not(.submit-btn), textarea')
let criticalFormInputs = ['radio-option', 'checkbox']
let alertMsg = document.querySelector('.alert-msg')

const validateEntriesObj = {
    'name': (e) =>  e === '',
    'surname': (e) => e === '',
    'email': (e) => validateEmail(e),
    'custom-message': (e) => e === '',
    'radio-option': (e) => e === '',
    'checkbox': (e) => e === ''
}


function fillExtraDataIfNececary(data, extraInputs) {
    extraInputs.forEach(inpt => {
        if (!Object.keys(data).includes(inpt)){
            data[inpt] = ''
        }
    })
}

function validateEmail(e){
    const emailPattern =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailPattern.test(e)
}


function handleSubmit(e) {
    e.preventDefault()
    let formIsValid = false
    let data = Object.fromEntries(new FormData(form))
    fillExtraDataIfNececary(data, criticalFormInputs)
    let emptyValues = Object.keys(data).filter(key =>  validateEntriesObj[key](data[key]) )
    console.log(emptyValues)
    formIsValid = (emptyValues.length === 0) ? true : false;
    if (formIsValid) {
        alertMsg.classList.remove('hidden-msg')
        alertMsg.setAttribute('aria-hidden', false)
        fieldInputs.forEach(inpt => {
            if (inpt.matches('.text-input')){
                inpt.value = ''
            }else {
                inpt.checked = false
            }
        })
        setTimeout(()=>{alertMsg.classList.add('hidden-msg')},2000)
    }else {
        let firstInvalid = Array.from(fieldInputs).filter(e => e.name === emptyValues[0])[0].getBoundingClientRect().y
        window.scroll({top:firstInvalid, behavior:'smooth'})
    }

    formItems.forEach(item => {item.classList.toggle('error', emptyValues.includes(item.dataset.related))})

}

function handleInputs(e){
    let inputIsValid = false
    if (e.target.matches('#checkbox')) {
        inputIsValid = e.target.checked
    }else {
        inputIsValid = !validateEntriesObj[e.target.name](e.target.value)
    }
    let thisField = Array.from(formItems).filter(item => item.dataset.related === e.target.name)[0]
    if (inputIsValid){
        thisField.classList.remove('error')
    }
    
}

form.addEventListener('submit', handleSubmit)
fieldInputs.forEach(input => input.addEventListener('input', handleInputs))


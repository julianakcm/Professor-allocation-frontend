

const input = document.querySelector('input-cpf')

    
     var el = document.getElementById('Cpf');
    if(el){
      el.addEventListener('keypress', () => {
     
    if (el.inputLength == 3 || el.inputLength == 7) {
        el.inputLength.value += '.'
    }else if (el.inputLength == 11) {
        el.inputLength += '-'
  }

})
    }
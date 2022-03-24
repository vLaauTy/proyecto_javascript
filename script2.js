

(function () {
    'use strict'
    const forms = document.querySelectorAll('.requires-validation')
    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
    
          form.classList.add('was-validated')
        }, false)
      })
    })()

    class User {
        constructor(nombre, email) {
            this.nombre = nombre;
            this.email = email;
        }
    }
    
    let usuarios = []
    
    if(localStorage.getItem('Users')) {
        usuarios = JSON.parse(localStorage.getItem('Users'))
    } else {
        localStorage.setItem('Users', JSON.stringify(usuarios))
    }
    
    let formUsers = document.getElementById('formUser')
    
    
    formUsers.addEventListener('submit', (e) => {
        e.preventDefault()
        let nombre = document.getElementById('nombreID').value 
        let email = document.getElementById('emailID').value 
        const user = new User(nombre, email)
        usuarios.push(user)
    
        localStorage.setItem('Users', JSON.stringify(usuarios))
        
    })
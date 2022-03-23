

const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const items = document.getElementById('items')
const footer = document.getElementById('footer')


let carrito = {}
const comprar = document.getElementById('botonComprar')
comprar.addEventListener('click', () => {
    if(Object.keys(carrito).length === 0){
        swal({
            title: "No se ha podido realizar esta accion",
            text: "Su carrito esta vacio",
            icon: "warning",
            button: "Ok",
          });
    } else {
        swal("Felicitaciones!", "Su compra se ha realizado con exito", "success");
    }
    
})


document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click' , e => {
    agregar(e)
})

items.addEventListener('click' , e => {
    botonAccion(e)
})


const fetchData = async () => {
        const res = await fetch('productos.json')
        const data = await res.json()
        pintarCards(data)
}

const pintarCards = data => {
    data.forEach(prod => {
        templateCard.querySelector('h5').textContent = prod.title
        templateCard.querySelector('.precio').textContent = prod.precio
        templateCard.querySelector('img').setAttribute("src", prod.foto)
        templateCard.querySelector('.btn-dark').dataset.id = prod.id

        const clone = templateCard.cloneNode(true)

        fragment.appendChild(clone)

    })

    cards.appendChild(fragment)
}

const agregar = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')) {      
        manipularCarrito(e.target.parentElement)
    }
}

const manipularCarrito = objeto => {
    console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('.precio').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad+1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad*producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const cantidadSuma = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad ,0 )
    const total = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = cantidadSuma
    templateFooter.querySelector('span').textContent = total

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const vaciarCarrito = document.getElementById('vaciar-carrito')
    const botonComprar = document.getElementById('botonComprar')

    vaciarCarrito.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

    botonComprar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const botonAccion = e => {
    if(e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
}


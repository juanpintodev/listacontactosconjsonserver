const formCreate = document.querySelector('#form-create');
const createInput = document.querySelector('#create-input');
const formLogin = document.querySelector('#form-login');
const loginInput = document.querySelector('#login-input');
const notification = document.querySelector('.notification');

formLogin.addEventListener('submit', async e =>{
    e.preventDefault();

    const response = await fetch('http://localhost:3000/users', {method: 'GET'});
    const users = await response.json();
    const user = users.find(user => user.username === loginInput.value);

    if (!user) {
        notification.innerHTML =`El usuario no existe`;
        notification.classList.add('show-notification');
        setTimeout(() =>{
            notification.classList.remove('show-notification');
        }, 3000);
    } else {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '../listacontactos/lista.html';
    }
})

formCreate.addEventListener('submit', async e =>{
    e.preventDefault();

    const response = await fetch('http://localhost:3000/users', {method: 'GET'});
    const users = await response.json();
    const user = users.find(user => user.username === createInput.value);

    if(!createInput.value){
        notification.innerHTML =`El campo usuario no puede estar vacio`;
        notification.classList.add('show-notification');
        setTimeout(() =>{
            notification.classList.remove('show-notification');
        }, 3000);
    }else if(user){
        notification.innerHTML =`El nombre de usuario ingresado ya existe`;
        notification.classList.add('show-notification');
        setTimeout(() =>{
            notification.classList.remove('show-notification');
        }, 3000);
    }else{
        await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {'Content-Type':'aplication/json'},
            body: JSON.stringify({username: createInput.value}),
        })
        notification.innerHTML =`El usuario ${createInput.value} ha sido creado con exito`;
        notification.classList.add('show-notification');
        setTimeout(() =>{
            notification.classList.remove('show-notification');
        }, 3000);
        createInput.value = ``;
    }
});
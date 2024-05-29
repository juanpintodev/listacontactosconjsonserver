const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z ]*$/;
const NUMBER_REGEX = /^[0](412|212|424|426|414|416)[0-9]{7}$/;

const nameInput = document.querySelector('#input-name');
const numberInput = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const closeBtn = document.querySelector('#close');
const user = JSON.parse(localStorage.getItem('user'));
const principal = document.querySelector('#principal');


// Validations
let nameValidation = false;
let numberValidation = false;

if(!user){
  window.location.href = '../home/index.html';
}

// Functions
const validateInput = (input, validation) => {
  
  
  const infoText = input.parentElement?.children[2];
  if (input.value === '') {
    input.classList.remove('incorrect');
    input.classList.remove('correct');
    infoText?.classList.remove('show');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText?.classList.remove('show');
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    infoText?.classList.add('show');
  }

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }

}

// Data
let contacts = [];

nameInput.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(nameInput.value);
  validateInput(nameInput, nameValidation);
});

numberInput.addEventListener('input', e => {
  numberValidation = NUMBER_REGEX.test(numberInput.value);
  validateInput(numberInput, numberValidation);
});



form.addEventListener('submit', async e => {
  e.preventDefault();


  const responseJSON = await fetch('http://localhost:3000/contacts', {
            method: 'POST',
            headers: {
              'Content-Type': 'aplication/json'
            },
            body: JSON.stringify({name: nameInput.value, number: numberInput.value, user: user.username}),
        });
        
        const response = await responseJSON.json();
        list.innerHTML = `<div class="lds-ring2"><div></div><div></div><div></div><div></div></div>`;
        setTimeout(() =>{
          list.innerHTML = ``;   
          getContacts();
      }, 1000);

  // Verificar si las validaciones son verdaderas
  if (!nameValidation || !numberValidation) return;

  const listaContactos = document.createElement('li')
      listaContactos.innerHTML = `
      <li class="contact" id="${response.id}">
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>        
      </button>
      <p>${response.name}</p>
      <p>${response.number}</p>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 
          4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 
          21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      </li>
      `;

  form.reset();
  formBtn.disabled = true;
  nameInput.classList.remove('correct');
  numberInput.classList.remove('correct');
  if(nameInput === '' || numberInput === ''){
    formBtn.disabled = true;
  }
});

list.addEventListener('click', async e => {
  const eliminar = e.target.closest('.delete-btn') 
  const editar = e.target.closest('.edit-btn');
  
  if(eliminar){
    const id = e.target.parentElement.parentElement.id;
    await fetch(`http://localhost:3000/contacts/${id}`, 
    {method: 'DELETE'});
    e.target.closest('.delete-btn').parentElement.remove();
    list.innerHTML = `<div class="lds-ring2"><div></div><div></div><div></div><div></div></div>`;
    setTimeout(() =>{
      list.innerHTML = ``;   
      getContacts();
  }, 1000);
  
  }else if(editar){
    const li = editar.parentElement;
    const nameEdit = li.children[1];
    const numberEdit = li.children[2];
    const id = e.target.parentElement.parentElement.id;
    

    let nameValidation2 = NAME_REGEX.test(nameEdit.innerHTML);
    let numberValidation2 = NUMBER_REGEX.test(numberEdit.innerHTML);

    nameEdit.addEventListener('input', e =>{
      nameValidation2 = NAME_REGEX.test(nameEdit.innerHTML);
      validateInput(nameEdit, nameValidation2);
      });
      
      
      numberEdit.addEventListener('input', e =>{ 
      numberValidation2 = NUMBER_REGEX.test(numberEdit.innerHTML);
      validateInput(numberEdit, numberValidation2);
      });
      
      if (li.classList.contains('editando')) {
      if(!nameValidation2 || !numberValidation2){
        return;
        }

      li.classList.remove('editando');

      
       const updatedContact = {
       name: nameEdit.innerHTML,
       number: numberEdit.innerHTML
      };

      const responseJSON = await fetch(`http://localhost:3000/contacts/${id}`, 
      {method: 'PATCH',
      headers: {
      'Content-Type': 'aplication/json'
      },
      body: JSON.stringify(updatedContact),
      });

      const response = await responseJSON.json();
      console.log(response);
      
      nameEdit.removeAttribute('contenteditable');
      numberEdit.removeAttribute('contenteditable');
      nameEdit.classList.remove('sombreado');
      numberEdit.classList.remove('sombreado');
      editar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 
        4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 
        2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
      `;

    } else {
      li.classList.add('editando');
      nameEdit.setAttribute('contenteditable', true);
      numberEdit.setAttribute('contenteditable', true);
      nameEdit.classList.add('sombreado');
      numberEdit.classList.add('sombreado');
      editar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 
        4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
      `;
    }
  }
  nameValidation = false;
  numberValidation = false;
});

const getContacts = async () => {
  
  const response = await fetch('http://localhost:3000/contacts',
   {method: 'GET'});
  const contactos = await response.json()
  const userContact = contactos.filter(contacto => contacto.user === user.username);
     
     userContact.forEach(contacto =>{
      const listaContactos = document.createElement('li')
      listaContactos.innerHTML = `
      <li class="contact" id="${contacto.id}">
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>        
      </button>
      <p>${contacto.name}</p>
      <p>${contacto.number}</p>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 
          4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 
          21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      </li>
      `;
      list.append(listaContactos);
     });
}

closeBtn.addEventListener('click', async e =>{
  localStorage.removeItem('user');
  principal.innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
  window.location.href = '../home/index.html';
});

getContacts();

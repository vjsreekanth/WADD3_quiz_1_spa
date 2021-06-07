const BASE_URL = `http://localhost:3000/api/v1`;

const Pet = {
    index(){
        return fetch(`${BASE_URL}/pets`)
        .then(res =>{
            console.log(res);
            return res.json();
        })
    },

    show(id){
        return fetch(`${BASE_URL}/pets/${id}`)
        .then(res => res.json());
     },

    create(params){
        return fetch(`${BASE_URL}/pets`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(params)
        }).then((res) => res.json())
    },

   

     destroy(id){
        return fetch(`${BASE_URL}/pets/${id}`, {
            method: 'DELETE',
            credentials: 'include'
            })
    },

      update(id, params){
        return fetch(`${BASE_URL}/pets/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify(params)
        })
        .then((res) => res.json())
    },
}

// function To create session 
const Session = {
    create(params){
        return fetch(`${BASE_URL}/session`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(params)
        })
    }
}

// sign in with a default user
Session.create({
    email: 'hagrid@hogwarts.edu',
    password: 'supersecret'
}).then(console.log)


// new pet form  submission (create pet)
const newPetForm = document.querySelector('#new-pet-form')

    newPetForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget
        const formData = new FormData(form);
        const newPetParams = {
            name: formData.get('name'),
            pet_type: formData.get('pet_type'),
            description: formData.get('description'),
            image_url: formData.get('image_url'),
            is_available: formData.get('is_available'),
        }

        Pet.create(newPetParams)
        .then(data => {
            console.log(data)
            loadPets();
            renderPetShow(data.id);
            navigateTo('pet-show');
        })
    });



// function to load all posts to index page
const loadPets =()=> {Pet.index()
    .then(pets => {
        const petsContainer = document.querySelector('ul.pet-list');
        petsContainer.innerHTML = pets.map(pet=>{
            return `
            <li>
            <a class="pet-link" data-id="${pet.id}" href="">
            ${pet.id} - ${pet.name} | Available: ${pet.is_available}
            `
            }).join('');
        })}
    
    loadPets();

//  enabling show click event
const petsContainer = document.querySelector('ul.pet-list');
petsContainer.addEventListener('click', (event) => {
    event.preventDefault();
    const petElement = event.target;
    if(petElement.matches('a.pet-link')){
    const petId = event.target.dataset.id
    renderPetShow(petId);
    navigateTo('pet-show')
    }
});
      
// function for showing post details
function renderPetShow(id){
Pet.show(id)
.then(pet => {
    const showPage = document.querySelector('.page#pet-show');
    showPage.innerHTML = 
    `<div class="card shadow p-3 m-3 bg-body rounded">
        <img src="${pet.image_url}" class="card-img-top" alt="...">
        <div class="card-body">
            
            <h3 class="card-title">${pet.name}</h3>
            <p class="card-text d-inline fw-bold">Animal Type: <p class="card-text d-inline">${pet.pet_type}</p></p>
            <p class="card-text d-inline fw-bold">Characteristics: <p class="card-text d-inline">${pet.description}</p></p>
        
            <p class="card-text">
            <small class="text-muted">Availability: ${pet.is_available}</small></br>
         
            </p>
            <a class="btn btn-primary" data-target='pet-edit' data-id='${pet.id}' href="">Edit</a>
            <a class="btn btn-primary" data-target='delete-pet' data-id='${pet.id}' href="">Delete</a>
        </div>
    </div>
    `
    })
}



// function to fill edit-post-form with current values
function populateForm(id){
    Pet.show(id).then(petData =>{
       document.querySelector('#edit-pet-form [name=name]').value=petData.name;
       document.querySelector('#edit-pet-form [name=pet_type]').value=petData.pet_type;
       document.querySelector('#edit-pet-form [name=description]').value=petData.description;
       document.querySelector('#edit-pet-form [name=image_url]').value=petData.image_url;
       document.querySelector('#edit-pet-form [name=is_available]').value=petData.is_available;
       document.querySelector('#edit-pet-form [name=id]').value=petData.id
    })
}

document.querySelector('#pet-show').addEventListener('click', (event) =>{
    event.preventDefault();
    const petId = event.target.dataset.id
    const actionNeededToBePerformed = event.target.dataset.target
    if(petId){
        if (actionNeededToBePerformed === 'delete-pet'){
            console.log(`delete: ${petId}`)
            Pet.destroy(petId).then(data =>{
                loadPets();
                navigateTo('pets-index');
            })
        }else if(actionNeededToBePerformed === 'pets-index'){
            navigateTo('pets-index');

        }else{
            populateForm(petId);
            navigateTo('pet-edit')
        }
    }
});

//edit and update fuction
const editPetForm = document.querySelector('#edit-pet-form');
editPetForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    const editFormData = new FormData(event.currentTarget)
    const updatePetParams = {
        name: editFormData.get('name'),
        pet_type: editFormData.get('pet_type'),
        description: editFormData.get('description'),
        image_url: editFormData.get('image_url'),
        is_available: editFormData.get('is_available'),
        id: editFormData.get('id')
    }
    Pet.update(editFormData.get('id'), updatePetParams)
    .then(pet => {
        editPetForm.reset();
        renderPetShow(pet.id);
        navigateTo('pet-show')
    });
    

})





// Show active page only
function navigateTo(id){
    document.querySelectorAll('.page').forEach(node => {
        node.classList.remove('active')
    });
    document.querySelector(`.page#${id}`).classList.add('active')
}

 //add navigation
 const navbar = document.querySelector('nav.navbar')
 navbar.addEventListener('click', (event) => {
     event.preventDefault();
     const node = event.target;
     const page = node.dataset.target;
     if(page){
         console.log(page);
         navigateTo(page);
     } 
 });
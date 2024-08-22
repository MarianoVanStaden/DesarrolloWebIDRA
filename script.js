const url = 'https://api.restful-api.dev/objects'; //'https://backend-idra.onrender.com/element';

window.onload = function () {
    $('#popUp').hide();
    getElement();
};

function loadElement() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.onload = function () {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };
        request.onerror = function () {
            reject(Error('Error: error inesperado de red.'));
        };
        request.send();
    });
}

function addElement(element) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('POST', url);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            if (request.status == 201 || request.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Elemento agregado!',
                    text: 'El elemento se ha agregado correctamente.',
                    timer: 2000,
                    timerProgressBar: true,
                    willClose: () => {
                        resolve(request.response);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'No se pudo agregar el elemento.',
                });
                reject(Error(request.statusText));
            }
        };
        request.onerror = function () {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error inesperado de red.',
            });
            reject(Error('Error: unexpected network error.'));
        };
        request.send(JSON.stringify(element));
    });
}


function removeElement(id) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('DELETE', url + `/${id}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            if (request.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Elemento eliminado!',
                    text: 'El elemento se ha eliminado correctamente.',
                    timer: 2000,
                    timerProgressBar: true,
                    willClose: () => {
                        resolve(request.response);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'No se pudo eliminar el elemento.',
                });
                reject(Error(request.statusText));
            }
        };
        request.onerror = function () {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error inesperado de red.',
            });
            reject(Error('Error: unexpected network error.'));
        };
        request.send();
    });
}

function modifyElement(id, element) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('PUT', url + `/${id}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
            if (request.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Elemento actualizado!',
                    text: 'El elemento se ha actualizado correctamente.',
                    timer: 2000,
                    timerProgressBar: true,
                    willClose: () => {
                        resolve(request.response);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'No se pudo actualizar el elemento.',
                });
                reject(Error(request.statusText));
            }
        };
        request.onerror = function () {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error inesperado de red.',
            });
            reject(Error('Error: unexpected network error.'));
        };
        request.send(JSON.stringify(element));
    });
}

function getElement() {
    loadElement().then(response => {
        var tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        response.forEach(e => {
            var row = tbody.insertRow();
            var id = row.insertCell();
            id.innerHTML = e.id;
            var data = e.data || {};
            var name = row.insertCell();
            name.innerHTML = e.name;
            var capacity = row.insertCell();
            capacity.innerHTML = data.capacity || '-';
            var screenSize = row.insertCell();
            screenSize.innerHTML = data.screenSize || '-';
            var generation = row.insertCell();
            generation.innerHTML = data.generation || data.Generation || '-';
            var price = row.insertCell();
            price.innerHTML = data.price || '-';
            var view = row.insertCell();
            view.innerHTML = `<button onclick='viewElement(${JSON.stringify(e)})'>Ver</button>`;
            var del = row.insertCell();
            del.innerHTML = `<button onclick='deleteElement(${e.id})'>Eliminar</button>`;
        });
        document.getElementById('name').value = '';
        document.getElementById('capacity').value = '';
        document.getElementById('screenSize').value = '';
        document.getElementById('generation').value = '';
        document.getElementById('price').value = '';
        document.getElementById('name').focus();
    }).catch(reason => {
        console.error(reason);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No se pudieron cargar los elementos.',
        });
    });
}

function saveElement() {
    const name = document.getElementById('name').value.trim();
    const capacity = document.getElementById('capacity').value.trim();
    const screenSize = document.getElementById('screenSize').value.trim();
    const generation = document.getElementById('generation').value.trim();
    const price = document.getElementById('price').value.trim();

    // Ensure all fields are filled
    if (name && capacity && screenSize && generation && price) {
        const element = {
            name,
            data: {
                capacity,
                screenSize,
                generation,
                price
            }
        };
        
        addElement(element)
            .then((response) => {
                alert(response)
                var tbody = document.querySelector('tbody');
        
        
            var row = tbody.insertRow();
            var id = row.insertCell();
            var id3 = JSON.parse(response)
            id.innerHTML = id3.id

            var data = response.data || {};
            var name = row.insertCell();
            name.innerHTML = id3.name
            //name.innerHTML = document.getElementById('name').value;
            var capacity = row.insertCell();
            capacity.innerHTML = document.getElementById('capacity').value || '-';
            var screenSize = row.insertCell();
            screenSize.innerHTML = document.getElementById('screenSize').value || '-';
            var generation = row.insertCell();
            generation.innerHTML = document.getElementById('generation').value || document.getElementById('Generation').value || '-';
            var price = row.insertCell();
            price.innerHTML = document.getElementById('price').value || '-';
            var view = row.insertCell();
            view.innerHTML = `<button onclick='viewElement(${JSON.stringify(response)})'>Ver</button>`;
            var del = row.insertCell();
            del.innerHTML = `<button onclick='deleteElement(${response.id})'>Eliminar</button>`;
            })
            .catch(reason => {
                console.error('Error adding element:', reason);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'No se pudo agregar el elemento. Verifique los datos e intente nuevamente.',
                });
            });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Por favor, complete todos los campos.',
        });
    }
}

function viewElement(element) {
    console.log(element); // Debugging log to check the element
    if (element && element.capacity) {
        // Proceed with your code to handle the element
        // For example, you can append the element data to your table
        const tbody = document.querySelector('tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.capacity}</td>
            <td>${element.screenSize}</td>
            <td>${element.generation}</td>
            <td>${element.price}</td>
            <td><button onclick="editElement(${element.id})">Edit</button></td>
            <td><button onclick="deleteElement(${element.id})">Delete</button></td>
        `;
        tbody.appendChild(row);
    } else {
        console.error('Element is undefined or missing the capacity property.');
    }
}


function deleteElement(id) {
    removeElement(id).then(() => {
        getElement();
    }).catch(reason => {
        console.error(reason);
    });
}

function updateElement() {
    const id = document.getElementsByName('id2')[0].value;
    const name = document.getElementsByName('name2')[0].value.trim();
    const capacity = document.getElementsByName('capacity2')[0].value.trim();
    const screenSize = document.getElementsByName('screenSize2')[0].value.trim();
    const generation = document.getElementsByName('generation2')[0].value.trim();
    const price = document.getElementsByName('price2')[0].value.trim();
    
    if (name && capacity && screenSize && generation && price) {
        const element = {
            name,
            data: {
                capacity,
                screenSize,
                generation,
                price
            }
        };
        modifyElement(id, element).then(() => {
            getElement();
            $('#popUp').dialog('close');
        }).catch(reason => {
            console.error(reason);
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Por favor, complete todos los campos.',
        });
    }
}

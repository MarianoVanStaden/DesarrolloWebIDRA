const url = 'https://api.restful-api.dev/objects'; //'https://backend-idra.onrender.com/student';

window.onload = function() {
    $('#popUp').hide();
    getData();
};

function loadElement() {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.onload = function() {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };
        request.onerror = function() {
            reject(Error('Error: error inesperado de red.'));
        };
        request.send();
    });
}

function addStudent() {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('POST', url);
        request.setRequestHeader('Content-Type', 'application/json');
        var student = JSON.stringify({
            'dni': document.getElementById('dni').value,
            'lastName': document.getElementById('lastName').value,
            'firstName': document.getElementById('firstName').value,
            'email': document.getElementById('email').value,
            'cohort': '0',
            'status': 'activo',
            'gender': 'masculino',
            'address': 'abc123',
            'phone': '000'
        });
        request.onload = function() {
            if (request.status == 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Estudiante agregado!',
                    text: 'El estudiante se ha agregado correctamente.',
                    timer: 2000,
                    timerProgressBar: true,
                    onClose: () => {
                        resolve(request.response);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'No se pudo agregar el estudiante.',
                });
                reject(Error(request.statusText));
            }
        };
        request.onerror = function() {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error inesperado de red.',
            });
            reject(Error('Error: unexpected network error.'));
        };
        request.send(student);
    });
}

function removeElement(id) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('POST', url + `/${id}/delete`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function() {
            if (request.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Estudiante eliminado!',
                    text: 'El estudiante se ha eliminado correctamente.',
                    timer: 2000,
                    timerProgressBar: true,
                    onClose: () => {
                        resolve(request.response);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'No se pudo eliminar el estudiante.',
                });
                reject(Error(request.statusText));
            }
        };
        request.onerror = function() {
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

function modifyElement() {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('POST', url + `/${document.getElementsByName('id2')[0].value}/update`);
        request.setRequestHeader('Content-Type', 'application/json');
        var student = JSON.stringify({
            'dni': document.getElementsByName('dni2')[0].value,
            'lastName': document.getElementsByName('lastName2')[0].value,
            'firstName': document.getElementsByName('firstName2')[0].value,
            'email': document.getElementsByName('email2')[0].value,
            'cohort': '0',
            'status': 'activo',
            'gender': 'masculino',
            'address': 'abc123',
            'phone': '000'
        });
        request.send(student);
    });
}



function getData() {
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
            capacity.innerHTML = data.capacity  || '-';
            var screenSize = row.insertCell();
            screenSize.innerHTML = data.screenSize  || '-';
            var generation = row.insertCell();
            generation.innerHTML =  data.generation || data.Generation || '-';;
            var price = row.insertCell();
            price.innerHTML = data.price  || '-';
            var student = JSON.stringify({
                'id': e.id,
                'model': e.model ,
                'capacity': e.capacity,
                'screenSize': e.screenSize,
                'generation': e.generation,
                'price': e.price,
            });
            var view = row.insertCell();
            view.innerHTML = `<button onclick='viewElement(${student})'>Ver</button>`;
            var del = row.insertCell();
            del.innerHTML = `<button onclick='deleteElement(${e.id})'>Eliminar</button>`;
        });
        document.getElementById('model').value = '';
        document.getElementById('capacity').value = '';
        document.getElementById('screenSize').value = '';
        document.getElementById('generation').value = '';
        document.getElementById('price').focus();
    }).catch(reason => {
        console.error(reason);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No se pudieron cargar los estudiantes.',
        });
    });
}


function saveStudent() {
    const dni = document.getElementById('dni').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    
}



function viewElement(student) {
    document.getElementsByName('id2')[0].value = student.id;
    document.getElementsByName('dni2')[0].value = student.dni;
    document.getElementsByName('lastName2')[0].value = student.lastName;
    document.getElementsByName('firstName2')[0].value = student.firstName;
    document.getElementsByName('email2')[0].value = student.email;
    $('#popUp').dialog({
        closeText: ''
    }).css('font-size', '15px');
}

function deleteElement(id) {
    removeElement(id).then(() => {
        getData();
    }).catch(reason => {
        console.error(reason);
    });
}

function updateElement() {
    const dni = document.getElementsByName('dni2')[0].value.trim();
    const lastName = document.getElementsByName('lastName2')[0].value.trim();
    const firstName = document.getElementsByName('firstName2')[0].value.trim();
    const email = document.getElementsByName('email2')[0].value.trim();
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;

}
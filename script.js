const url = 'https://backend-idra.onrender.com/student';

window.onload = function() {
    $('#popUp').hide();
    getStudents();
};

function loadStudents() {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url + '/getAll');
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

function removeStudent(id) {
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

function modifyStudent() {
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
        request.onload = function() {
            if (request.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Estudiante actualizado!',
                    text: 'El estudiante se ha actualizado correctamente.',
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
                    text: 'No se pudo actualizar el estudiante.',
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



function getStudents() {
    loadStudents().then(response => {
        var tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        response.forEach(e => {
            var row = tbody.insertRow();
            var id = row.insertCell();
            id.innerHTML = e.id;
            var dni = row.insertCell();
            dni.innerHTML = e.dni;
            var lastName = row.insertCell();
            lastName.innerHTML = e.lastName;
            var firstName = row.insertCell();
            firstName.innerHTML = e.firstName;
            var email = row.insertCell();
            email.innerHTML = e.email;
            var student = JSON.stringify({
                'id': e.id,
                'dni': e.dni,
                'lastName': e.lastName,
                'firstName': e.firstName,
                'email': e.email,
            });
            var view = row.insertCell();
            view.innerHTML = `<button class='button-primary' onclick='viewStudent(${student})'>Ver</button>`;
            var del = row.insertCell();
            del.innerHTML = `<button class='button-danger' onclick='deleteStudent(${e.id})'>Eliminar</button>`;
            
        });
        document.getElementById('dni').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('firstName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('dni').focus();
    }).catch(reason => {
        console.error(reason);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No se pudieron cargar los estudiantes.',
        });
    });
}

function isEmailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(email);
}

function saveStudent() {
    const dni = document.getElementById('dni').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Validación de caracteres especiales y números en nombre y apellido
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
    if (!nameRegex.test(lastName) || !nameRegex.test(firstName)) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia!',
            text: 'Los campos de nombre y apellido no deben contener caracteres especiales ni números.',
        });
        return;
    }

    if (dni !== '' && lastName !== '' && firstName !== '' && email !== '') {
        if (isNaN(dni)) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia!',
                text: 'El DNI debe contener solo números.',
            });
            return;
        }

        if (!isEmailValid(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia!',
                text: 'El correo electrónico no tiene un formato válido.',
            });
            return;
        }

        addStudent().then(() => {
            getStudents();
        }).catch(reason => {
            console.error(reason);
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia!',
            text: 'Por favor completa todos los campos.',
        });
    }
}


function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function viewStudent(student) {
    document.getElementsByName('id2')[0].value = student.id;
    document.getElementsByName('dni2')[0].value = student.dni;
    document.getElementsByName('lastName2')[0].value = student.lastName;
    document.getElementsByName('firstName2')[0].value = student.firstName;
    document.getElementsByName('email2')[0].value = student.email;
    $('#popUp').dialog({
        closeText: ''
    }).css('font-size', '15px');
}

function deleteStudent(id) {
    removeStudent(id).then(() => {
        getStudents();
    }).catch(reason => {
        console.error(reason);
    });
}

function updateStudent() {
    const dni = document.getElementsByName('dni2')[0].value.trim();
    const lastName = document.getElementsByName('lastName2')[0].value.trim();
    const firstName = document.getElementsByName('firstName2')[0].value.trim();
    const email = document.getElementsByName('email2')[0].value.trim();
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;

    let isValidLastName = nameRegex.test(lastName);
    let isValidFirstName = nameRegex.test(firstName);

    if (!isValidLastName && !isValidFirstName) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia!',
            text: 'Los campos de nombre y apellido no deben contener caracteres especiales ni números.',
        });
        return;
    } else if (!isValidLastName) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia!',
            text: 'El campo de apellido no debe contener caracteres especiales ni números.',
        });
        return;
    } else if (!isValidFirstName) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia!',
            text: 'El campo de nombre no debe contener caracteres especiales ni números.',
        });
        return;
    }

    if (dni !== '' && lastName !== '' && firstName !== '' && email !== '') {
        if (isNaN(dni)) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia!',
                text: 'El DNI debe contener solo números.',
            });
            return;
        }

        if (!isEmailValid(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia!',
                text: 'El correo electrónico no tiene un formato válido.',
            });
            return;
        }

        modifyStudent().then(() => {
            $('#popUp').dialog('close');
            getStudents();
        }).catch(reason => {
            console.error(reason);
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia!',
            text: 'Por favor completa todos los campos.',
        });
    }
}

function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


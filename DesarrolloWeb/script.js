const url = 'https://19ee-181-230-219-190.ngrok.io/student'

        window.onload = function() {
            $('#popUp').hide()
            getStudents()
        }



        function loadStudents() {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest()
                request.open('GET', url + '/getAll')
                request.responseType = 'json'
                request.onload = function() {
                    if (request.status == 200) {
                        resolve(request.response)
                    } else {
                        reject(Error(request.statusText))
                    }
                }
                request.onerror = function() {
                    reject(Error('Error: unexpected network error.'))
                }
                request.send()
            })
        }

        function addStudent() {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest()
                request.open('POST', url)
                request.setRequestHeader('Content-Type', 'application/json')
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
                })
                request.onload = function() {
                    if (request.status == 201) {
                        resolve(request.response)
                    } else {
                        reject(Error(request.statusText))
                    }
                }
                request.onerror = function() {
                    reject(Error('Error: unexpected network error.'))
                }
                request.send(student)
            })
        }

        function removeStudent(id) {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest()
                request.open('POST', url + `/${id}/delete`)
                request.setRequestHeader('Content-Type', 'application/json')
                request.onload = function() {
                    if (request.status == 200) {
                        resolve(request.response)
                    } else {
                        reject(Error(request.statusText))
                    }
                }
                request.onerror = function() {
                    reject(Error('Error: unexpected network error.'))
                }
                request.send()
            })
        }

        function modifyStudent() {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest()
                request.open('POST', url + `/${document.getElementsByName('id2')[0].value}/update`)
                request.setRequestHeader('Content-Type', 'application/json')
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
                })
                request.onload = function() {
                    if (request.status == 200) {
                        resolve(request.response)
                    } else {
                        reject(Error(request.statusText))
                    }
                }
                request.onerror = function() {
                    reject(Error('Error: unexpected network error.'))
                }
                request.send(student)
            })
        }

        //FUNCIONES QUE CONSUMEN LAS PROMESAS//

        function getStudents() {
            loadStudents().then(response => {
                var tbody = document.querySelector('tbody')
                tbody.innerHTML = ''
                response.forEach(e => {
                    var row = tbody.insertRow()
                    var id = row.insertCell()
                    id.innerHTML = e.id
                    var dni = row.insertCell()
                    dni.innerHTML = e.dni
                    var lastName = row.insertCell()
                    lastName.innerHTML = e.lastName
                    var firstName = row.insertCell()
                    firstName.innerHTML = e.firstName
                    var email = row.insertCell()
                    email.innerHTML = e.email
                    var student = JSON.stringify({
                        'id': e.id,
                        'dni': e.dni,
                        'lastName': e.lastName,
                        'firstName': e.firstName,
                        'email': e.email,
                    })
                    var view = row.insertCell()
                    view.innerHTML = `<button onclick='viewStudent(${student})'>View</button>`
                    var del = row.insertCell()
                    del.innerHTML = `<button onclick='deleteStudent(${e.id})'>Delete</button>`
                })
                document.getElementById('dni').value = ''
                document.getElementById('lastName').value = ''
                document.getElementById('firstName').value = ''
                document.getElementById('email').value = ''
                document.getElementById('dni').focus()
            }).catch(reason => {
                console.error(reason)
            })
        }

        function saveStudent() {
            if (document.getElementById('dni').value.trim() !== '' &&
                document.getElementById('lastName').value.trim() !== '' &&
                document.getElementById('firstName').value.trim() !== '' &&
                document.getElementById('email').value.trim() !== '') {
                addStudent().then(() => {
                    getStudents()
                }).catch(reason => {
                    console.error(reason)
                })
            }
        }

        function viewStudent(student) {
            document.getElementsByName('id2')[0].value = student.id
            document.getElementsByName('dni2')[0].value = student.dni
            document.getElementsByName('lastName2')[0].value = student.lastName
            document.getElementsByName('firstName2')[0].value = student.firstName
            document.getElementsByName('email2')[0].value = student.email
            $('#popUp').dialog({
                closeText: ''
            }).css('font-size', '15px')
        }

        function deleteStudent(id) {
            removeStudent(id).then(() => {
                getStudents()
            }).catch(reason => {
                console.error(reason)
            })
        }

        function updateStudent() {
            if (document.getElementsByName('dni2')[0].value.trim() !== '' &&
                document.getElementsByName('lastName2')[0].value.trim() !== '' &&
                document.getElementsByName('firstName2')[0].value.trim() !== '' &&
                document.getElementsByName('email2')[0].value.trim() !== '') {
                modifyStudent().then(() => {
                    $('#popUp').dialog('close')
                    getStudents()
                }).catch(reason => {
                    console.error(reason)
                })
            }
        }
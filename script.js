// author: Mariano Van Staden

const url = 'https://api.restful-api.dev/objects';
let localElements = [];

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
            reject(Error('Error: unexpected network error.'));
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
                console.log('Element added:', request.responseText);
                const newElement = JSON.parse(request.responseText);

                // Add the new element to the DOM and store it locally
                addElementToDOM(newElement);
                localElements.push(newElement);

                resolve(request.response);
            } else {
                console.error('Error adding element:', request.statusText);
                reject(Error(request.statusText));
            }
        };
        request.onerror = function () {
            console.error('Unexpected network error');
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
                console.log('Element removed:', request.responseText);
                resolve(request.response);
            } else {
                console.error('Error removing element:', request.statusText);
                reject(Error(request.statusText));
            }
        };
        request.onerror = function () {
            console.error('Unexpected network error');
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
                console.log('Element updated:', request.responseText);
                const updatedElement = JSON.parse(request.responseText);

                // Update the element in the DOM
                updateElementInDOM(updatedElement);

                // Update the localElements array
                const index = localElements.findIndex(e => e.id === id);
                if (index !== -1) {
                    localElements[index] = updatedElement;
                }

                resolve(request.response);
            } else {
                console.error('Error updating element:', request.statusText);
                reject(Error(request.statusText));
            }
        };
        request.onerror = function () {
            console.error('Unexpected network error');
            reject(Error('Error: unexpected network error.'));
        };
        request.send(JSON.stringify(element));
    });
}

function addElementToDOM(element) {
    var tbody = document.querySelector('tbody');
    var row = tbody.insertRow();
    var id = row.insertCell();
    id.innerHTML = element.id;
    var data = element.data || {};
    var name = row.insertCell();
    name.innerHTML = element.name;
    var capacity = row.insertCell();
    capacity.innerHTML = data.capacity || '-';
    var screenSize = row.insertCell();
    screenSize.innerHTML = data.screenSize || '-';
    var generation = row.insertCell();
    generation.innerHTML = data.generation || '-';
    var price = row.insertCell();
    price.innerHTML = data.price || '-';
    var view = row.insertCell();
    view.innerHTML = `<button onclick='viewElement("${JSON.stringify(element).replace(/'/g, "\\'").replace(/"/g, '&quot;')}")'>View</button>`;
    var del = row.insertCell();
    del.innerHTML = `<button onclick='deleteElement("${element.id}")'>Delete</button>`;
}

function updateElementInDOM(updatedElement) {
    var rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        var idCell = row.cells[0];
        if (idCell && idCell.innerHTML == updatedElement.id) {
            var data = updatedElement.data || {};
            row.cells[1].innerHTML = updatedElement.name;
            row.cells[2].innerHTML = data.capacity || '-';
            row.cells[3].innerHTML = data.screenSize || '-';
            row.cells[4].innerHTML = data.generation || '-';
            row.cells[5].innerHTML = data.price || '-';
        }
    });
}

function getElement() {
    loadElement().then(response => {
        var tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        const combinedElements = response.concat(localElements);

        combinedElements.forEach(e => {
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
            generation.innerHTML = data.generation || '-';
            var price = row.insertCell();
            price.innerHTML = data.price || '-';
            var view = row.insertCell();
            view.innerHTML = `<button onclick='viewElement(${JSON.stringify(e).replace(/'/g, "\\'").replace(/"/g, '&quot;')})'>View</button>`;
            var del = row.insertCell();
            del.innerHTML = `<button onclick='deleteElement("${e.id}")'>Delete</button>`;
        });

        document.getElementById('name').value = '';
        document.getElementById('capacity').value = '';
        document.getElementById('screenSize').value = '';
        document.getElementById('generation').value = '';
        document.getElementById('price').value = '';
        document.getElementById('name').focus();
    }).catch(reason => {
        console.error('Failed to load elements:', reason);
    });
}

function saveElement() {
    const name = document.getElementById('name').value.trim();
    const capacity = document.getElementById('capacity').value.trim();
    const screenSize = document.getElementById('screenSize').value.trim();
    const generation = document.getElementById('generation').value.trim();
    const price = document.getElementById('price').value.trim();

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

        console.log('Attempting to add element:', element);

        addElement(element)
            .then((response) => {
                console.log('Element successfully added:', response);
                getElement(); // Reload the element list after adding a new one
            })
            .catch(error => {
                console.error('Error adding element:', error);
            });
    } else {
        console.warn('Incomplete form');
    }
}

function viewElement(elementJSON) {
    const element = typeof elementJSON === 'string' ? JSON.parse(elementJSON) : elementJSON;

    document.getElementsByName('id2')[0].value = element.id;
    document.getElementsByName('name2')[0].value = element.name || '-';
    document.getElementsByName('capacity2')[0].value = element.data.capacity || '-';
    document.getElementsByName('screenSize2')[0].value = element.data.screenSize || '-';
    document.getElementsByName('generation2')[0].value = element.data.generation || '-';
    document.getElementsByName('price2')[0].value = element.data.price || '-';

    $('#popUp').dialog({
        closeText: ''
    }).css('font-size', '16px');
}

function deleteElement(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        removeElement(id)
            .then((response) => {
                console.log('Element successfully deleted:', response);
                
                // Remove the element from the DOM
                removeElementFromDOM(id);

                // Remove the element from the localElements array
                localElements = localElements.filter(element => element.id !== id);

                getElement(); // Reload the element list after deletion
            })
            .catch(error => {
                console.error('Error deleting element:', error);
            });
    }
}

function removeElementFromDOM(id) {
    var rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        var idCell = row.cells[0];
        if (idCell && idCell.innerHTML == id) {
            row.parentNode.removeChild(row); // Remove the row from the table
        }
    });
}

function updateElement() {
    const id = document.getElementById('id2').value;
    const name = document.getElementById('name2').value.trim();
    const capacity = document.getElementById('capacity2').value.trim();
    const screenSize = document.getElementById('screenSize2').value.trim();
    const generation = document.getElementById('generation2').value.trim();
    const price = document.getElementById('price2').value.trim();

    if (name && capacity && screenSize && generation && price) {
        const updatedElement = {
            name,
            data: {
                capacity,
                screenSize,
                generation,
                price
            }
        };

        console.log('Attempting to update element:', updatedElement);

        modifyElement(id, updatedElement)
            .then((response) => {
                console.log('Element successfully updated:', response);
                getElement(); // Reload the element list after updating an element
                $('#popUp').dialog('close'); // Close the popup after update
            })
            .catch(error => {
                console.error('Error updating element:', error);
            });
    } else {
        console.warn('Incomplete form');
    }
}

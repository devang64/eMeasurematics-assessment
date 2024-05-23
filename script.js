var data = [
    { id: 10, name: "PARCEL1", sequence: 1, group: "Mumbai" },
    { id: 11, name: "PARCEL2", sequence: 2, group: "Mumbai" },
    { id: 13, name: "PARCEL3", sequence: 3, group: "Mumbai" },
    { id: 19, name: "PARCEL4", sequence: 4, group: "Delhi" },
    { id: 18, name: "PARCEL5", sequence: 5, group: "Delhi" },
    { id: 21, name: "PARCEL6", sequence: 6, group: "Kolkata" },
    { id: 12, name: "PARCEL7", sequence: 7, group: "Kolkata" },
    { id: 22, name: "PARCEL8", sequence: 8, group: "Kolkata" },
    { id: 23, name: "PARCEL9", sequence: 9, group: "Kolkata" },
    { id: 24, name: "PARCEL10", sequence: 10, group: "Mumbai" },
    { id: 25, name: "PARCEL11", sequence: 11, group: "Mumbai" },
    { id: 31, name: "PARCEL12", sequence: 12, group: "Mumbai" },
    { id: 34, name: "PARCEL13", sequence: 13, group: "Mumbai" },
    { id: 35, name: "PARCEL14", sequence: 14, group: "Delhi" },
    { id: 41, name: "PARCEL15", sequence: 15, group: "Delhi" },
    { id: 42, name: "PARCEL16", sequence: 16, group: "Delhi" },
    { id: 43, name: "PARCEL17", sequence: 17, group: "Delhi" },
    { id: 44, name: "PARCEL18", sequence: 18, group: "Kolkata" },
    { id: 53, name: "PARCEL19", sequence: 19, group: "Kolkata" },
    { id: 57, name: "PARCEL20", sequence: 20, group: "Kolkata" }
];


var colorList = [
    '#f0155e',
    '#f1c232',
    '#3c79d8',
    '#e67e22',
    '#2ecc71',
    '#e74c3c',
    '#3498db',
    '#9b59b6',
    '#1abc9c'
];
var groupColors = {};

function getGroupColor(group) {
    if (!groupColors[group]) {
        var colorIndex = Object.keys(groupColors).length % colorList.length;
        groupColors[group] = colorList[colorIndex];
    }
    return groupColors[group];
}

var selectedParcel = null;

function resetForm() {
    var selectedParcelSpan = document.querySelector('#selectedParcel');
    selectedParcelSpan.textContent = '';
    document.getElementById('parcelNameInput').value = '';
    document.getElementById('parcelGroupInput').value = '';
    document.getElementById('selectedParcelContainer').innerHTML = '';
    var selectedElements = document.querySelectorAll('.parcel .selected');
    selectedElements.forEach(function (element) {
        element.classList.remove('selected');
    });
}

function renderParcels() {
    data.sort(function (a, b) {
        return a.sequence - b.sequence;
    });
    var appContainer = document.getElementById('app');
    appContainer.innerHTML = '';

    var currentGroup = null;
    data.forEach((parcel) => {
        if (parcel.group !== currentGroup) {
            var groupContainer = document.createElement('div');
            groupContainer.classList.add('group-container');

            var groupHeader = document.createElement('div');
            groupHeader.classList.add('group-header');
            groupHeader.textContent = parcel.group;
            groupContainer.appendChild(groupHeader);

            appContainer.appendChild(groupContainer);
            groupHeader.style.backgroundColor = getGroupColor(parcel.group);
            currentGroup = parcel.group;
        }
        var parcelElement = document.createElement('div');
        var parcelNameDiv = document.createElement('div');
        var parcelsequenceDiv = document.createElement('div');
        parcelElement.classList.add('parcel');
        parcelElement.appendChild(parcelNameDiv);
        parcelNameDiv.classList.add('parcelNameDiv');
        parcelElement.appendChild(parcelsequenceDiv);
        parcelsequenceDiv.classList.add('parcelSequence');
        parcelNameDiv.textContent = parcel.name;
        parcelsequenceDiv.textContent = parcel.sequence;
        parcelsequenceDiv.style.backgroundColor = getGroupColor(parcel.group);

        var currentGroupContainer = appContainer.lastElementChild;
        currentGroupContainer.appendChild(parcelElement);
        currentGroupContainer.appendChild(parcelElement);
        parcelElement.addEventListener('click', function () {
            selectParcel(parcel.id);
        });
        if (selectedParcel && selectedParcel.id === parcel.id) {
            parcelElement.classList.add('selected');
        }
    });
    var visibleParcelCount = 9;
    var containerWidth = visibleParcelCount * 110;
    document.getElementById('app').style.width = containerWidth + 'px';

    renderParcelLegends();
}

function renderParcelGroups() {
    var selectElement = document.getElementById('parcelGroupInput');
    selectElement.innerHTML = '';
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Location';
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    var uniqueGroups = [...new Set(data.map(parcel => parcel.group))];

    uniqueGroups.forEach(group => {
        var option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        selectElement.appendChild(option);
    });
}

function selectParcel(parcelId) {
    if (selectedParcel && selectedParcel.id === parcelId) {
        selectedParcel = null;
    } else {
        selectedParcel = data.find(parcel => parcel.id === parcelId);
    }
    document.getElementById('selectedParcelContainer').innerHTML = selectedParcel
        ? `<span id="selectedParcel">${selectedParcel.name}</span>`
        : '';

    renderParcels();
}

function addParcel(position) {
    if (!selectedParcel) {
        alert('Please select a parcel first.');
        return;
    }
    var name = document.getElementById('parcelNameInput').value;
    var group = document.getElementById('parcelGroupInput').value;
    if (!name || !group) {
        alert('Please enter the parcel name and select a group.');
        return;
    }
    var newParcel = {
        id: Date.now(),
        name: name,
        group: group
    };

    var index = data.findIndex(parcel => parcel.id === selectedParcel.id);
    if (position === 'after') {
        newParcel.sequence = data[index].sequence + 0.5;
    } else if (position === 'before') {
        newParcel.sequence = data[index].sequence - 0.5;
    }

    data.push(newParcel);
    normalizeSequence();
    renderParcels();
    document.getElementById('parcelNameInput').value = '';
    document.getElementById('parcelGroupInput').value = '';
    document.getElementById('selectedParcelContainer').innerHTML = '';
    var selectedElements = document.querySelectorAll('.parcel .selected');
    selectedElements.forEach(function (element) {
        element.classList.remove('selected');
    });
}

function replaceParcel() {
    if (!selectedParcel) {
        alert('Please select a parcel first.');
        return;
    }
    var name = document.getElementById('parcelNameInput').value;
    var group = document.getElementById('parcelGroupInput').value;
    if (!name || !group) {
        alert('Please enter the parcel name and select a group.');
        return;
    }
    var newParcel = {
        id: Date.now(),
        name: name,
        group: group,
        sequence: selectedParcel.sequence
    };
    var index = data.findIndex(parcel => parcel.id === selectedParcel.id);
    data[index] = newParcel;
    selectedParcel = newParcel;
    document.getElementById('parcelNameInput').value = '';
    document.getElementById('parcelGroupInput').value = '';
    resetForm();
    document.getElementById('selectedParcelContainer').innerHTML = `<span id="selectedParcel">${newParcel.name}</span>`
    renderParcels();

}

function deleteParcel() {
    if (!selectedParcel) {
        alert('Please select a parcel first.');
        return;
    }

    data = data.filter(parcel => parcel.id !== selectedParcel.id);
    selectedParcel = null;
    normalizeSequence();
    renderParcels();
    resetForm();
}

function refreshParcels() {
    selectedParcel = null;
    document.getElementById('parcelNameInput').value = '';
    document.getElementById('parcelGroupInput').value = '';
    renderParcels();
    resetForm();
}

function showFinalData() {
    console.log(data);
}

function normalizeSequence() {
    data.sort((a, b) => a.sequence - b.sequence);

    data.forEach((parcel, index) => {
        parcel.sequence = index + 1;
    });
}

function renderParcelLegends() {
    var legendsContainer = document.querySelector('.parcelLegends');
    legendsContainer.innerHTML = ''
    var uniqueGroups = [...new Set(data.map(parcel => parcel.group))];
    uniqueGroups.forEach(group => {
        var legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');
        var legendGroupName = document.createElement('p');
        var legendGroupColor = document.createElement('div');
        legendGroupColor.classList.add('legend-box');
        legendGroupName.textContent = group;
        legendGroupColor.style.backgroundColor = getGroupColor(group);
        legendsContainer.appendChild(legendItem);
        legendItem.appendChild(legendGroupName);
        legendItem.appendChild(legendGroupColor);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderParcels();
    renderParcelGroups();
});

window.onload = main();

function main() {
  loadCityList();
  var cityList = document.getElementById('city-list');
  var generationList = document.getElementById('generation-list');
  cityList.addEventListener('change', loadGeneneration);
  generationList.addEventListener('change', loadStudentList);
}

function loadCityList() {
  var cityList = document.getElementById('city-list');
  for (city in data) {
    var name = getCityName(city);
    var value = city;
    var cityItem = document.createElement('option');
    cityItem.value = value;
    cityItem.innerText = name;
    cityList.appendChild(cityItem);
  }
}

function getCityName(code) {
  var cities = {
      'AQP': 'Arequipa',
      'CDMX': 'Cidade do México',
      'LIM': 'Lima',
      'SCL': 'Santiago do Chile'
  };
  return cities[code];
}

function loadGeneneration() {
  var cityList = document.getElementById('city-list');
  var generationList = document.getElementById('generation-list');
  generationList.innerHTML = '';
  var generationItem = document.createElement('option');
  generationItem.innerText = 'Selecione a turma';
  generationList.appendChild(generationItem);
  //popula o select
  for (generation in data[cityList.value]) {
    generationItem = document.createElement('option');
    generationItem.value = generation;
    generationItem.innerText = generation;
    generationList.appendChild(generationItem);
  }
}

function loadStudentList() {
  var city = document.getElementById('city-list').value;
  var generation = document.getElementById('generation-list').value;
  var studentsList = document.getElementById('students-list');
  studentsList.innerHTML = '';
  var students = data[city][generation]['students'];
  for (i = 0; i < students.length; i++) {
    var student = students[i];
    addStudentInfo(studentsList, students[i]);
  }
}

function addStudentInfo(list, student) {
  var studentItem = document.createElement('li');
  var studentPhoto = document.createElement('img');
  studentItem.innerText = student.name;
  studentPhoto.src = student.photo;
  studentPhoto.setAttribute('width', 40);
  studentPhoto.setAttribute('height', 40);
  list.appendChild(studentItem);
  studentItem.appendChild(studentPhoto);
}

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

// Funções que obtem os dados e cálculos

// funcao que conta o numero de estudantes por sede
function countStudents(place, year) {
  var count = 0;
  for (i in data[place][year]['students']) {
    if (isEmpty(data[place][year]['students'][i])===false) {
      count += 1;
    }
  }
  return (count);
}

// funcao que verifica se um objeto é vazio
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

// funcao que conta o numero de estudanetes ativas ou nao por sede
function studentsActiveOrNot(place, year) {
  var countActive = 0;
  var countInactive = 0;
  for (i in data[place][year]['students']) {
    if (data[place][year]['students'][i]['active'] === true) {
      countActive += 1;
    }
    else {
      countInactive += 1;
    }
    if (isEmpty(data[place][year]['students'][i]) === true) {
      countInactive -= 1;
    }
  }
  var countActivePerc = ((countActive / (countStudents(place, year))) * 100).toFixed(2);
  return [countActive, countActivePerc, countInactive, 100 - countActivePerc];
}

// funcao que conta o numero de estudantes que alcancaram a meta de 70% em hse e tech por sprint
// e separadamente por tech e hse

function targetAll(place, year) {
  var targetSprint = [];
  var targetHSE = [];
  var targetTech = [];
  for (k in data[place][year]['students'][0]['sprints']) {
    targetSprint[k] = 0;
    targetHSE[k] = 0;
    targetTech[k] = 0;
  }
  for (i in data[place][year]['students']) {
    for (j in data[place][year]['students'][i]['sprints']) {
      if (data[place][year]['students'][i]['sprints'][j]['score']['tech'] >= 1260 && data[place][year]['students'][i]['sprints'][j]['score']['hse'] >= 840) {
        targetSprint[j] += 1;
      }
      if (data[place][year]['students'][i]['sprints'][j]['score']['tech'] >= 1260) {
        targetTech[j] += 1;
      }
      if (data[place][year]['students'][i]['sprints'][j]['score']['hse'] >= 840) {
        targetHSE[j] += 1;
      }

    }
  }
  for (var i = 0, sum = 0; i < targetSprint.length; sum += targetSprint[i++]) { }
  var averageSprint = sum / targetSprint.length;
  var averagePercAll = ((averageSprint * 100) / (countStudents(place, year))).toFixed(2);
  for (var i = 0, sum = 0; i < targetTech.length; sum += targetTech[i++]) { }
  var averageTech = sum / targetTech.length;
  var averageTechPercAll = ((averageTech * 100) / (countStudents(place, year))).toFixed(2);
  for (var i = 0, sum = 0; i < targetHSE.length; sum += targetHSE[i++]) { }
  var averageHSE = sum / targetHSE.length;
  var averageHSEPercAll = ((averageHSE * 100) / (countStudents(place, year))).toFixed(2);

  //retorna array com numero de estudantes que conseguiram alcancar a meta por sprint (targetSprint)
  // retorna também a media de alunas que alcancaram a meta por sprint(averageSprint) e a porcentagem em relaco ao total de alunas (averagePercAll)
  return [targetSprint, averageSprint, averagePercAll, targetTech, averageTech, averageTechPercAll, targetHSE, averageHSE, averageHSEPercAll];
}

//funcao que retorna NPS pela turma por sprints, media de nps e nps (tudo em percentagem)

function returnNPS(place,year) {
  var promoters = [];
  var passive = [];
  var detractors = [];
  for (i in data[place][year]['ratings']) {
      promoters[i] = (data[place][year]['ratings'][i]['nps']['promoters']);
      passive[i] = (data[place][year]['ratings'][i]['nps']['passive']);
      detractors[i] = (data[place][year]['ratings'][i]['nps']['detractors']);
  }

  for (var i = 0, sumPromoters = 0; i < promoters.length; sumPromoters += promoters[i++]) { }
  for (var i = 0, sumPassive = 0; i < promoters.length;  sumPassive += passive[i++]) { }
  for (var i = 0, sumDetractors = 0; i < promoters.length; sumDetractors += detractors[i++]) { }

  var averagePromoters = sumPromoters / promoters.length;
  var averagePassive = sumPassive / passive.length;
  var averageDetractors = sumDetractors / detractors.length;
  var nps = averagePromoters - averageDetractors;
  return [promoters, passive, detractors, averagePromoters, averagePassive, averageDetractors,nps];
}

//funcao que retorna a avaliacao das estudantes sobre a laboratória
function returnStudentsRating(place,year) {
  var overExpectation = [];
  var onExpectation= [];
  var underExpectation= [];
  for (i in data[place][year]['ratings']) {
    overExpectation[i] = (data[place][year]['ratings'][i]['student']['supera']);
    onExpectation[i] = (data[place][year]['ratings'][i]['student']['cumple']);
    underExpectation[i] = (data[place][year]['ratings'][i]['student']['no-cumple']);
  }
  for (var i = 0, sumOverExpectation = 0; i < overExpectation.length; sumOverExpectation += overExpectation[i++]) { }
  for (var i = 0, sumOnExpectation = 0; i < onExpectation.length; sumOnExpectation += onExpectation[i++]) { }
  for (var i = 0, sumUnderExpectation = 0; i < underExpectation.length; sumUnderExpectation += underExpectation[i++]) { }
  var averageOverExpectation = sumOverExpectation / overExpectation.length;
  var averageOnExpectation = sumOnExpectation / onExpectation.length;
  var averageUnderExpectation = sumUnderExpectation / underExpectation.length;
  return [overExpectation, onExpectation, underExpectation, averageOverExpectation, averageOnExpectation, averageUnderExpectation];
}

//funcao que retorna a pontuacao media de mentores e Jedis
function returnTeachersJedisRating(place, year) {
  var jedi = [];
  var teacher = [];

  for (i in data[place][year]['ratings']) {
    jedi[i] = (data[place][year]['ratings'][i]['jedi']);
    teacher[i] = (data[place][year]['ratings'][i]['teacher']);
  }
  for (var i = 0, sumJedi = 0; i < jedi.length; sumJedi += jedi[i++]) { }
  for (var i = 0, sumTeacher = 0; i < teacher.length; sumTeacher += teacher[i++]) { }
  var averageJedi = (sumJedi / jedi.length).toFixed(2);
  var averageTeacher = (sumTeacher / teacher.length).toFixed(2);
  return [jedi, teacher, averageJedi, averageTeacher];
}

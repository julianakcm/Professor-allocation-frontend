const allocationsUrl = 'http://localhost:8080/allocations/';

const table = document.getElementById('table');
const tableBody = document.getElementById('table-body');

async function getAllocations() {
  const response = await fetch(allocationsUrl);
  if (response.ok) {
    const allocations = await response.json();

    if (allocations.length > 0) {
      table.removeAttribute('hidden');
      allocations.forEach((allocation) => {
        createRow(allocation);
      })
    }
    
  }
}

function createRow(allocation) {
  const row = document.createElement('tr');
  const idCollumn = document.createElement('th');
  const professorCollumn = document.createElement('td');
  const cursoCollumn = document.createElement('td');
  const diaCollumn = document.createElement('td');
  const horarioCollumn = document.createElement('td');

  idCollumn.textContent = allocation.id;
  idCollumn.setAttribute("scope", "row");

  professorCollumn.textContent = allocation.professor.name;

  cursoCollumn.textContent = allocation.course.name;

  diaCollumn.textContent = allocation.dayOfWeek;

  const horario = `${allocation.startHour} - ${allocation.endHour}`;

  horarioCollumn.textContent = horario;

  row.appendChild(idCollumn);
  row.appendChild(professorCollumn);
  row.appendChild(cursoCollumn);
  row.appendChild(diaCollumn);
  row.appendChild(horarioCollumn);

  tableBody.appendChild(row);
}


getAllocations();

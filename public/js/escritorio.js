const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  window.location.href = 'index.html';
}

const escritorio = searchParams.get('escritorio');
console.log(escritorio)

if (!isNaN(escritorio) && escritorio > 0) {
  lblEscritorio.innerText = `Escritorio ${escritorio}`;
  document.title = `Escritorio ${escritorio}`;
} else {
  window.location.href = 'index.html';
}

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
  btnAtender.disabled = false;
});

socket.on('disconnect', () => {
  btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (payload) => {
  mostrarTickets(payload);
});

btnAtender.addEventListener('click', () => {
  socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, pendientes }) => {
    if (!ok) {
      lblTicket.innerText = "Nadie";
      divAlerta.style.display = '';
    } else {
      lblTicket.innerText = "Ticket " + ticket.numero;
      mostrarTickets(pendientes);
    }
  });
});

function mostrarTickets(numero) {
  if (numero === 0) {
    divAlerta.style.display = '';
    lblPendientes.style.display = 'none';
  } else {
    divAlerta.style.display = 'none';
    lblPendientes.style.display = '';
    lblPendientes.innerText = numero + " Tickets";
  }
}

// Referencias a elementos del DOM

const inputDNI = document.getElementById('dni');
const inputMonto = document.getElementById('monto');
const inputCuotas = document.getElementById('cuotas');
const spanResultado = document.getElementById('resultado');

/** @type {HTMLFormElement} */
const formularioPrestamo = document.getElementById('formularioPrestamo');
const botonCalcular = document.getElementById('botonCalcular');
const botonEliminarGuardados = document.getElementById('botonEliminarGuardados');

// Utilizacion de local storage

function obtenerPrestamosGuardados() {
  const prestamosGuardados = localStorage.getItem('prestamos');

  if (prestamosGuardados === null) {
    return [];
  }

  return JSON.parse(prestamosGuardados);
}

function guardarPrestamo(prestamo) {

  prestamos.push(prestamo);

  localStorage.setItem('prestamos', JSON.stringify(prestamos));
}

const prestamos = obtenerPrestamosGuardados();

function actualizarPrestamos() {
  let prestamosExistentes = '';

  for (const prestamo of prestamos) {
    const texto = `El cliente con DNI ${prestamo.dni} tiene que pagar ${prestamo.total} en ${prestamo.cuotas} cuotas.\n`;
    prestamosExistentes += texto;
  }

  spanResultado.innerText = prestamosExistentes;
}


// Calculo de prestamo

function calcularPrestamo(monto, cuotas) {
  if (monto < 0 || cuotas < 0) {
    return 0;
  }
  if (cuotas == 1) {
    return monto;
  }
  if (cuotas == 3) {
    return monto * 1.3;
  }
  if (cuotas == 6) {
    return monto * 1.6;
  }
  if (cuotas == 9) {
    return monto * 1.9;
  }
  if (cuotas == 12) {
    return monto * 2.2;
  }
  return monto * 2.5;
}

function enCalcular() {
  if (inputDNI.value === '' || inputMonto.value === '' || inputCuotas.value === '') {
    Toastify({
      text:"Complete todos los campos",
      duration:2300,
      gravity:"bottom",
      position:"left",
      style:{
          fontSize:"25px",
          fontFamily:"Verdana",
          color:"yellow",
          background:"black"
      }
    }).showToast();
    return;
  }

  const dni = parseInt(inputDNI.value);
  const monto = parseInt(inputMonto.value);
  const cuotas = parseInt(inputCuotas.value);
  if (!dni || !monto || !cuotas) {
    return;
  }

  const total = calcularPrestamo(monto, cuotas);
  const prestamo = {
    dni,
    monto,
    cuotas,
    total,
  };
  guardarPrestamo(prestamo);
  actualizarPrestamos();

  // Utilizacion de Toastify
  Toastify({
      text:"Prestamo solicitado",
      duration:2300,
      gravity:"bottom",
      position:"left",
      style:{
          fontSize:"25px",
          fontFamily:"Verdana",
          color:"yellow",
          background:"black"
      }

  }).showToast();
}

formularioPrestamo.addEventListener('submit', (evento) => {
  evento.preventDefault();
  enCalcular();
});


// Eliminacion de prestamos guardados

function eliminarPrestamosGuardados() {
  localStorage.removeItem('prestamos');
  prestamos.length = 0;
  spanResultado.innerText = '';
}

botonEliminarGuardados.addEventListener('click', eliminarPrestamosGuardados);


// Inicializacion con prestamos guardados

actualizarPrestamos();


//Utilizacion de una API(OPENWEATHER) y FETCH

function mostrarPosicion( posicion ){
  const lat = posicion.coords.latitude;
  const long = posicion.coords.longitude;
  const key = "c27be3ccd3f443a5ea83fadd1f1861ee";

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metric&lang=es`)
    .then(response => response.json())
    .then(data =>{
      console.log(data);
      const contenedor=document.getElementById("contenedorGeolocalizacion")
      contenedor.innerHTML = 
      `<h2>Clima actual:</h2>
      <p>Ciudad: ${data.name}</p>
      <p>Temperatura: ${data.main.temp}</p>
      <p>Maxima: ${data.main.temp_max}</p>
      <p>Minima: ${data.main.temp_min}</p>
      <p>Clima: ${data.weather[0].description}</p>
      <p>Humedad: ${data.main.humidity}</p>`                            
    })
}

function errorEnMostrarPosicion(error) {
  Toastify({
    text:"Error al obtener la ubicacion",
    duration:2300,
    gravity:"bottom",
    position:"left",
    style:{
      fontSize:"24px",
      fontFamily:"Verdana",
      color:"white",
      background:"rgb(69, 125, 173)",
      padding:"0.75rem 1.5rem"
    }
  }).showToast();
}


navigator.geolocation.getCurrentPosition(
  mostrarPosicion,
  errorEnMostrarPosicion
);

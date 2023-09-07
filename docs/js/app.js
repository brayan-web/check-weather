const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
    e.preventDefault();
    //Validar
    const ciudades = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudades === '' || pais === ''){
        mostrarAlertas("Ambos campos son obligatorios");
        return;
    }

    //Consultar la api
    consultarAPI(ciudades, pais);
}

function mostrarAlertas(msg){
    const alert = document.querySelector('.alert');
      
    if(!alert){
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-200', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alert')
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <strong class="block">${msg}</strong>
        `

        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2000)
    }
      
}

function consultarAPI(ciudades, pais){
    const appId = 'e27e4f57675938e647d07332c8d16956';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudades},${pais}&appid=${appId}`
    
    Spinner();
    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        limpiarHtml();
        if(data.cod === '404'){
            mostrarAlertas('Ciudad no encontrada');
            return;
        }

        //Imprime la respuesta en el html
        mostrarClima(data);
    })
}

function mostrarClima(data){
    const {name, main:{temp, temp_max, temp_min} } = data;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')
    
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`
    actual.classList.add('font-bold', 'text-bold', 'txt-clima-actual');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`
    tempMaxima.classList.add('text-xl');

    
    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`
    tempMinima.classList.add('text-xl');


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);

    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

function kelvinACentigrados(gradosKelvin){
    return parseInt(gradosKelvin - 273.15)
}

function limpiarHtml(){
        while(resultado.firstChild){
            resultado.removeChild(resultado.firstChild);
        }
}

function Spinner(){
    limpiarHtml();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
    
    `;

    resultado.appendChild(divSpinner);
}
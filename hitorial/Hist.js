
document.addEventListener('DOMContentLoaded', function() {


    
    document.getElementById('formularioDetareas').onsubmit = function(e) {
        e.preventDefault();
       
        // Crear tarea
        var tarea = {
            id: Date.now(),
            fecha: document.getElementById('FechaTarea').value,
            descripcion: document.getElementById('descripcionTarea').value,
            completada: false
        };
       
        // Guardar en localStorage
        var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        tareas.push(tarea);
        localStorage.setItem('tareas', JSON.stringify(tareas));
       
        // Limpiar y actualizar
        document.getElementById('descripcionTarea').value = '';
        mostrarTareas();
    };
   
    //  Búsqueda y filtro
    document.getElementById('busqueda').oninput = mostrarTareas;
    document.getElementById('filtro-tarea').onchange = mostrarTareas;
//    Mostrar tareas al inicio
    mostrarTareas();
});


//  mostrar todo
function mostrarTareas() {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    var buscar = document.getElementById('busqueda').value.toLowerCase();
    var filtro = document.getElementById('filtro-tarea').value;
    var lista = document.getElementById('contenedor-tareas');
   
    // Filtrar
    var tareasFiltradas = tareas.filter(function(t) {
        var coincideTexto = t.descripcion.toLowerCase().includes(buscar);
        var coincideFiltro = filtro === 'todas' ||
                            (filtro === 'completadas' && t.completada) ||
                            (filtro === 'pendientes' && !t.completada);
        return coincideTexto && coincideFiltro;
    });
   
    // Ordenar por fecha
    tareasFiltradas.sort(function(a, b) {
        return new Date(b.fecha) - new Date(a.fecha);
    });
   
    // Contadores
    var completadas = tareas.filter(function(t) { return t.completada; }).length;
    document.getElementById('pendientes-total').textContent = tareas.length - completadas;
    document.getElementById('completadas-total').textContent = completadas;
   
    // Mostrar en lista
    lista.innerHTML = '';
    tareasFiltradas.forEach(function(t) {
        var li = document.createElement('li');
        if (t.completada) li.style.textDecoration = 'line-through';
       
        li.innerHTML = '<div><strong>' + new Date(t.fecha).toLocaleDateString() +
                      '</strong><p>' + t.descripcion + '</p></div>' +
                      '<div><button onclick="marcar(' + t.id + ')">' +
                      (t.completada ? 'Desmarcar' : 'Completar') +
                      '</button> <button onclick="eliminar(' + t.id + ')">Eliminar</button></div>';
       
        lista.appendChild(li);
    });
}


// para marcar y eliminar tareas
function marcar(id) {
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    for (var i = 0; i < tareas.length; i++) {
        if (tareas[i].id === id) {
            tareas[i].completada = !tareas[i].completada;
            break;
        }
    }
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
}


function eliminar(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
   
    var tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas = tareas.filter(function(t) { return t.id !== id; });
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
}


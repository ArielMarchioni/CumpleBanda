// https://docs.google.com/spreadsheets/d/e/2PACX-1vTLfN8R5dKbfYz8vOCRoW3hyB4CRguhL8Z1qhOStJrptJtstAeeFocKtDusMqcNGIzfoeI4_GZ8ANFD/pub?gid=0&single=true&output=csv
const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTLfN8R5dKbfYz8vOCRoW3hyB4CRguhL8Z1qhOStJrptJtstAeeFocKtDusMqcNGIzfoeI4_GZ8ANFD/pub?gid=0&single=true&output=csv';

document.addEventListener('DOMContentLoaded', () => {
    fetch(googleSheetUrl)
        .then(response => response.text())
        .then(csvText => parseCSV(csvText));
});

function parseCSV(csvText) {
    const rows = csvText.split('\n').slice(1);
    const hoy = new Date();
    const cumpleanosHoy = [];
    const cumpleanosEsteMes = [];
    let proximoCumpleano = null;

    rows.forEach(row => {
        const [nombre, fechaNacimiento] = row.split(',');
        const cumpleDate = new Date(fechaNacimiento.trim());

        if (!isNaN(cumpleDate)) {
            const cumpleMes = cumpleDate.getMonth();
            const cumpleDia = cumpleDate.getDate();
            const edad = hoy.getFullYear() - cumpleDate.getFullYear();

            // Verificar si cumple hoy
            if (cumpleMes === hoy.getMonth() && cumpleDia === hoy.getDate()) {
                cumpleanosHoy.push({ nombre, edad });
            }
            // Verificar si cumple en el mismo mes pero no hoy
            else if (cumpleMes === hoy.getMonth()) {
                cumpleanosEsteMes.push({ nombre, edad, fecha: `${cumpleDia}/${cumpleMes + 1}` });
            }

            // Calcular el cumpleaños más próximo
            const cumpleanoFuturo = new Date(hoy.getFullYear(), cumpleMes, cumpleDia);
            if (cumpleanoFuturo < hoy) {
                cumpleanoFuturo.setFullYear(hoy.getFullYear() + 1); // Para considerar el próximo año
            }
            const diferenciaDias = Math.ceil((cumpleanoFuturo - hoy) / (1000 * 60 * 60 * 24));
            if (!proximoCumpleano || diferenciaDias < proximoCumpleano.dias) {
                proximoCumpleano = { nombre, edad, fecha: `${cumpleDia}/${cumpleMes + 1}`, dias: diferenciaDias };
            }
        }
    });

    // Mostrar cumpleaños hoy
    if (cumpleanosHoy.length > 0) {
        mostrarCumpleanos(cumpleanosHoy, 'cumpleanos-hoy');
    } else {
        document.getElementById('cumpleanos-hoy').innerHTML = "<p>La Banda no Festeja Hoy 😢</p>";
    }

    // Mostrar cumpleaños este mes
    if (cumpleanosEsteMes.length > 0) {
        mostrarCumpleanos(cumpleanosEsteMes, 'cumpleanos-este-mes');
    } else {
        document.getElementById('este-mes').style.display = 'none';
    }

    // Mostrar el cumpleaños más próximo
    if (proximoCumpleano) {
        mostrarCumpleanos([proximoCumpleano], 'cumpleanos-proximo');
        document.getElementById('titulo-proximos-cumpleanos').textContent =
            `Próximo Cumpleaños`;
    } else {
        document.getElementById('proximos-cumpleanos').style.display = 'none';
    }
}

function mostrarCumpleanos(lista, elementoId) {
    const container = document.getElementById(elementoId);
    container.innerHTML = '';

    lista.forEach(persona => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="https://em-content.zobj.net/thumbs/240/apple/325/party-popper_1f389.png" alt="emoji de cumpleaños">
            <h3>${persona.nombre}</h3>
            <p>🎂 ¡Te deseamos feliz cumpleaños!</p>
            <p>🎉 ${persona.edad} años</p>
            ${persona.fecha ? `<p>🎁 Fecha: ${persona.fecha}</p>` : ''}
        `;
        container.appendChild(card);
    });
}

function obtenerNombreMes(indiceMes) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[indiceMes];
}

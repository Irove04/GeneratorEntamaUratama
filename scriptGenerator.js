// 🌸 ARRAY BASE DE PATRONES PARA GENERAR CÓDIGOS
var patrones = [
    'Bxxxx0xSAxxDxC',
    'Bxxxx1xSAxxDxC',
    'xABxx2xSCxxxxD',
    'xABxx3xSCxxxxD',
    'xxxDS4xCxxABxx',
    'xxxDS5xCxxABxx',
    'xDCxx6xxxxxSBA',
    'xDCxx7xxxxxSBA',
    'xSDxC8xxBxAxxx',
    'xSDxC9xxBxAxxx'
];

//COMPROVACIONES

// Comprueba si un valor es un número
function esNumero(valor) {
    return /^\d+$/.test(String(valor).trim());
}

// Comprueba si la longitud de un texto es igual a la esperada
function comprobarLongitud(valor, longitud) {
    return String(valor).length === longitud;
}


//CUANDO SE ELIGE ENTAMA O URATAMA
$('#rbEntama, #rbUratama').change(function() {

    // Comprobamos qué radio está activado
    var esEntama = $('#rbEntama').is(':checked');
    var esUratama = $('#rbUratama').is(':checked');

    // Quitamos clases antiguas
    $('body').removeClass('entama uratama');

    // Cambiamos fondo según elección
    if (esEntama) {
        $('body')
            .addClass('entama')
            .css({
                'background': 'url("img/EntaBack.jpg")',
                'background-size': 'auto'
            });
    } else if (esUratama) {
        $('body')
            .addClass('uratama')
            .css({
                'background': 'url("img/UraBack.webp")',
                'background-size': 'auto'
            });
    }

    // Mostramos el selector correcto
    if (esEntama) {
        $('#itemsURATAMA').hide();
        $('#itemsENTAMA').stop(true, true).fadeIn(250);
    } else {
        $('#itemsENTAMA').hide();
        $('#itemsURATAMA').stop(true, true).fadeIn(250);
    }
});

//GENERADOR DE PASSCODE
$('#btnGetStuff').click(function() {

    // Guardamos los valores que mete el usuario
    var codigo1 = $('#txtLoginNumber1').val().trim();
    var codigo2 = $('#txtLoginNumber2').val().trim();

    var esEntama = $('#rbEntama').is(':checked');
    var esUratama = $('#rbUratama').is(':checked');

    // Validaciones básicas
    if (!esEntama && !esUratama) {
        alert("Primero elige si es un Entama o un Uratama 🩷");
        return;
    }

    if (!esNumero(codigo1) || !esNumero(codigo2)) {
        alert("Introduce ambos códigos correctamente (solo números).");
        return;
    }

    if (!comprobarLongitud(codigo1, 7) || !comprobarLongitud(codigo2, 7)) {
        alert("Cada código debe tener exactamente 7 dígitos.");
        return;
    }

    // Unimos ambos códigos
    var login = codigo1 + codigo2; // total 14 dígitos

    // Tomamos el sexto dígito (sirve para elegir el patrón)
    var sexto = parseInt(login[5], 10);
    if (isNaN(sexto)) sexto = 0;
    sexto = sexto % patrones.length;

    // Obtenemos el patrón correcto según ese número
    var patron = patrones[sexto];

    // Guardamos el ítem seleccionado
    var objetoElegido = esEntama
        ? $('#itemsENTAMA').val()
        : $('#itemsURATAMA').val();

    // Aseguramos que tenga 4 dígitos (relleno con ceros)
    var numeroCodigo = String(objetoElegido || '0000').padStart(4, '0');

    // Construimos el código final letra por letra
    var codigoFinal = "";
    for (var i = 0; i < patron.length; i++) {
        if (patron[i] === 'x') {
            codigoFinal += login[i] || '0';
        } else {
            codigoFinal += patron[i];
        }
    }

    // Reemplazamos letras A–D por los números del código
    codigoFinal = codigoFinal
        .replace('A', numeroCodigo[0])
        .replace('B', numeroCodigo[1])
        .replace('C', numeroCodigo[2])
        .replace('D', numeroCodigo[3]);

    // Cálculo del checksum (suma de dígitos)
    var codigoParaSuma = codigoFinal.replace(/S/g, '0');
    var suma = 0;
    for (var j = 0; j < codigoParaSuma.length; j++) {
        var digito = parseInt(codigoParaSuma[j], 10);
        suma += isNaN(digito) ? 0 : digito;
    }
    var digitoControl = (suma % 10).toString();

    // Reemplazamos la S con el dígito del checksum
    codigoFinal = codigoFinal.replace('S', digitoControl);

    // Mostramos el resultado final en pantalla
    var mensaje = "Introduce este código en tu "
        + (esEntama ? "Entama" : "Uratama") + ":\n\n"
        + codigoFinal.substring(0, 7) + "\n"
        + codigoFinal.substring(7);

    $('#resultado').text(mensaje);
});

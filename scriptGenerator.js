// Patrones base
const arrCodes = [
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

// util helpers
function isNumber(value) {
    return /^\d+$/.test(String(value).trim());
}

function checkLength(input, len) {
    return String(input).length === len;
}

// on load: hide selects and reset background
$(function () {
    $('#itemsENTAMA, #itemsURATAMA').hide();
    $('#rbEntama, #rbUratama').prop('checked', false);
    $('body').removeClass('entama uratama').css({
        'background': 'url("img/NeutralBack.webp") no-repeat center center fixed',
        'background-size': 'cover'
    });
});

// when user chooses version: show only the corresponding select and change background
$('#rbEntama, #rbUratama').change(function () {
    const isEntama = $('#rbEntama').is(':checked');
    const isUratama = $('#rbUratama').is(':checked');

    $('body').removeClass('entama uratama');

    if (isEntama) {
        $('body')
            .addClass('entama')
            .css({
                'background': 'url("img/EntaBack.jpg")',
                'background-size': 'auto'
            });
    } else if (isUratama) {
        $('body')
            .addClass('uratama')
            .css({
                'background': 'url("img/UraBack.webp")',
                'background-size': 'auto'
            });
    }

    if (isEntama) {
        $('#itemsURATAMA').hide();
        $('#itemsENTAMA').stop(true, true).fadeIn(250);
    } else {
        $('#itemsENTAMA').hide();
        $('#itemsURATAMA').stop(true, true).fadeIn(250);
    }
});

// Generate passcode
$('#btnGetStuff').click(function () {
    const n1 = $('#txtLoginNumber1').val().trim();
    const n2 = $('#txtLoginNumber2').val().trim();
    const isEntama = $('#rbEntama').is(':checked');
    const isUratama = $('#rbUratama').is(':checked');

    if (!isEntama && !isUratama) {
        alert('Elige si es Entama o Uratama');
        return;
    }
    if (!isNumber(n1) || !isNumber(n2)) {
        alert('Introduce el passcode');
        return;
    }
    if (!checkLength(n1, 7) || !checkLength(n2, 7)) {
        alert('Ambos códigos deben tener 7 dígitos cada uno');
        return;
    }

    const login = n1 + n2; // 14 digits
    let sixth = parseInt(login[5], 10);
    if (isNaN(sixth)) sixth = 0;
    sixth = sixth % arrCodes.length;
    const pattern = arrCodes[sixth];

    const selectedItem = isEntama
        ? $('#itemsENTAMA').val()
        : $('#itemsURATAMA').val();

    const codeNumber = String(selectedItem || '0000').padStart(4, '0');

    // build code from pattern
    let finalCode = '';
    for (let i = 0; i < pattern.length; i++) {
        finalCode += pattern[i] === 'x' ? (login[i] || '0') : pattern[i];
    }

    // replace A-D with digits from codeNumber
    finalCode = finalCode
        .replace('A', codeNumber[0])
        .replace('B', codeNumber[1])
        .replace('C', codeNumber[2])
        .replace('D', codeNumber[3]);

    // checksum
    const checkSumVal = finalCode.replace(/S/g, '0');
    let sum = 0;
    for (let i = 0; i < checkSumVal.length; i++) {
        const d = parseInt(checkSumVal[i], 10);
        sum += isNaN(d) ? 0 : d;
    }
    const checksumDigit = (sum % 10).toString();
    finalCode = finalCode.replace('S', checksumDigit);

    // show result
    const display =
        `Introduce este código en tu ${isEntama ? 'Entama' : 'Uratama'}:\n\n` +
        finalCode.substring(0, 7) +
        '\n' +
        finalCode.substring(7);

    $('#resultado').text(display);
});

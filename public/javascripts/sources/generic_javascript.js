function getYear() {
    return new Date().getFullYear();
}

function copyWrite() {
    var year = getYear()
    var copyWrite = document.getElementById('footer_c');
    copyWrite.innerHTML = '© Copyright 2018 - ' + year + '<a href="https://fantipper.com.au"> fantipper.com.au</a>';
}

$(window).on('load', function() {
    copyWrite();
});
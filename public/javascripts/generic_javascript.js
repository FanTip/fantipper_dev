
function getYear(){
    return new Date().getFullYear();
}

function copyWrite(){
    var year = getYear()
    var copyWrite = document.getElementById('footer_c');
    copyWrite.innerHTML ='©' + year + ' Copyright'  + '<a href="https://fantipper.com"> fantipper.com</a>';

}

$(window).on('load',function(){
    copyWrite();
});
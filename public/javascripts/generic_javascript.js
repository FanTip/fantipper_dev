


$('#tipCreator').on('shown', function(e){
    console.log('loaded');
    var creditCardOption = document.getElementById('cardYear');
    e.preventDefault();
    
    creditCardOption.innerHTML = getYear();
    console.log('fdgfdfdgfdg');
}, Modernizr.passiveeventlisteners ? {passive: true} : false);


function getYear(){
    return new Date().getFullYear();
}

function creditCardYear(){
    

    
    // $creditCardOption.empty();
    // var year = getYear();
    // console.log(year + 7);

    // // for(var i=0; i < 10; i++){
    // //     $('<option>').val(year + i).text(year + i).appendTo($creditCardOption);
    // // }


    // creditCardOption.addEventListener('wheel', function(e){
    //     // e.preventDefault();
    //     for(var i = 0; i < 7; i++){
    //         var options = document.createElement('option');
    //         options.setAttribute('value', year + i);
    //         console.log(year+i);
    //         options.text(year + i);
    //         creditCardOption.appendChild(options);
    //     }
    // }, {capture : true, passive : true})

    
}

function copyWrite(){
    var year = getYear()
    var copyWrite = document.getElementById('footer_c');
    copyWrite.innerHTML ='©' + year + ' Copyright'  + '<a href="https://fantipper.com"> fantipper.com</a>';

}

$(window).on('load',function(){
    copyWrite();
    creditCardYear();
});
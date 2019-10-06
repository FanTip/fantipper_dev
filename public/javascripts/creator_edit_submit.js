$(document).ready(function(){

    let submit = $("#submit_creator_edit");

    submit.on('click', function(event){

        event.preventDefault();

        console.log("0nvifvnfivfvnifdnvidfni");

        var categories = [{}];
        
        let full_name = $("#fullname").val();
        let user_name = $("#username").val();
        let short_desc = $("#shortdesc").val();
        let main_text = $("#maintext").val();

        $(":checkbox:checked").each(function(){
            categories.push($(this).val());
        });

        let formdata = {
            fullname : full_name,
            username : user_name,
            shortdesc : short_desc,
            maintext : main_text,
            categories : categories
        };

        let xhr = $.ajax({
            url :"/selectactivecreator",
            crossDomain:false,
            method:'POST',
            headers : {
                'CSRF-Token' : $('meta[name="csrf-token"]').attr('content')
            },
            data : formdata
        })

        console.log(categories);

    });

});
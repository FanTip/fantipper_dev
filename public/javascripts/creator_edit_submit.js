function initEditor() {
    return new Quill('#editor-container', {
        modules: {
            history: {
                delay: 2000,
                maxStack: 500,
                userOnly: true
            }
        },
        theme: 'snow'
    });
}

function getAboutYou(quill) {
    let content = quill.getText();
    let delta = JSON.stringify(quill.getContents());
    let editorWindow = document.getElementById('editor-container').getElementsByClassName('ql-editor')[0];

    let formattedContent = quill.getText();

    return {
        content: content,
        delta: delta,
        formattedContent: formattedContent
    }
}


$(document).ready(function() {


    let quill = initEditor();


    let submit = $("#submit_creator_edit");

    submit.on('click', function(event) {

        event.preventDefault();

        let about_you = getAboutYou(quill);
        var categories = [{}];

        let full_name = $("#fullname").val();
        let user_name = $("#username").val();
        let short_desc = $("#shortdesc").val();
        let main_text = about_you.content;
        let creator_location = $('#location_now').val();
        let facebook_url = $('#facebook-url').val();
        let twitter_url = $('#twitter-url').val();

        $(":checkbox:checked").each(function() {
            categories.push($(this).val());
        });

        let formdata = {
            fullname: full_name,
            username: user_name,
            shortdesc: short_desc,
            maintext: main_text,
            categories: categories,
            location: creator_location,
            facebookURL: facebook_url,
            twitterURL: twitter_url
        };

        let xhr = $.ajax({
            url: "/selectactivecreator",
            crossDomain: false,
            method: 'POST',
            headers: {
                'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            data: formdata
        })

        xhr.done(function(response) {
            if (xhr.status == 200)
                toastr.success('Creator page updated sucessfully!')

        })
    });
});
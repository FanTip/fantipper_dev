/**
 * 
 * Quill editor initialization
 */
let toolbarOptions = [
    ['bold', 'italic', 'underline'], // toggled buttons

    [{ 'header': 1 }, { 'header': 2 }], // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],

    [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown

    // [{ 'font': [] }],

    ['clean'] // remove formatting button
];

function initEditor() {
    return new Quill('#editor-container', {
        modules: {
            toolbar: toolbarOptions,
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

    let about_you;

    let submit_button = $('#Submit_profile');

    submit_button.on('click', function() {
        let creatorname = $('#creator_name_create').val();
        let staticURL = $('#staticURL').val();
        let short_desc = $('#short_desc').val();
        let location_now = $('#location_now').val();

        about_you = getAboutYou(quill);

        var categories = [{}];

        $(":checkbox:checked").each(function() {
            categories.push($(this).val());
        });


        let formdata = {
            name: creatorname,
            url: staticURL,
            desc: short_desc,
            username: staticURL,
            location: location_now,
            about: about_you.content,
            categories: categories
        }

        let xhr = $.ajax('/test/formsubmission', {
            method: 'POST',
            headers: {
                'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            data: formdata,
            crossDomain: false
        });

        xhr.done(function() {
            toastr.options = {
                "closeButton": true,
                "positionClass": "toast-top-full-width",
                "preventDuplicates": true,
            }

            toastr.success('You have successfully created a Fantipper creator account!');
            setTimeout($(location).attr('href', '/creatorprofile/preview'), 9000);

        });
    });

});
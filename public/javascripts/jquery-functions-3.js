// // Implemetations for the creatorProfileCreate

window.addEventListener('DOMContentLoaded', function(){

    /**
     * Cropping image functions
     */
    var avatar = document.getElementById('avatar');
    var image = document.getElementById('image');
    var input = document.getElementById('input');

    var $progress = $('.progress');
    var $progressBar = $('.progress-bar');
    var $alert = $('.alert');
    var $modal = $('#modal');
    
    
    $progress.hide();

    var cropper;

    $('[data-toggle = "tooltip"]').tooltip();

    input.addEventListener('change', function(e){
        var files = e.target.files;
        if(files[0].size > 10000000){
            sizeCheck = true;
            toastr.error('File too large.');
            e.stopImmediatePropagation();
        }else{
            var done = function(url){
                input.value = '';
                image.src = url;
                $alert.hide();
                $modal.modal('show');
            }
            var reader;
            var file;
            var url;
            if(files && files.length > 0){
               
                file = files[0];
                if(url) {
                    done(URL.createObjectURL(file));
                } else if (FileReader) {
                    reader = new FileReader();
                    reader.onload = function(e) {
                        done(reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
        
    });

    
        $modal.on('shown.bs.modal', function(){
            cropper = new Cropper(image, {
                aspectRatio : 1,
                viewMode : 1,
            });
        }).on('hidden.bs.modal', function(){
            cropper.destroy();
            cropper = null;
        });

        document.getElementById('crop').addEventListener('click', function(){
            var initialAvatarURL;
            var canvas;

            $modal.modal('hide');

            if(cropper){
                canvas = cropper.getCroppedCanvas({
                    width : 200,
                    height : 200,
                });
                initialAvatarURL = avatar.src;
                avatar.src = canvas.toDataURL();
                $progress.show();
                $alert.removeClass('alert-success alert-warning');
                canvas.toBlob(function(blob){
                    var formData = new FormData();  

                    formData.append('avatar', blob, 'avatar.jpg');

                    $.ajax('/test/profile',{
                        type: "POST",
                        data: formData,
                        processData : false,
                        contentType : false,
                        headers : {
                            'CSRF-Token' : $('meta[name="csrf-token"]').attr('content')
                        },

                        xhr: function(){
                            var xhr = new XMLHttpRequest();

                            xhr.upload.onprogress = function(e){
                                var precent = '0';
                                var precentage = '0%';

                                if(e.lengthComputable){
                                    precent = Math.round((e.loaded / e.total) * 100);
                                    precentage = precent + '%';
                                    $progressBar.width(precentage).attr('aria-valuenow', precent).text(precentage);
                                }
                            };
                            return xhr;
                        },
                        success : function(){
                            toastr.success('Upload Complete');
                        },
                        error : function(){
                            avatar.src = initialAvatarURL;
                            toastr.error('Upload Error');
                        },
                        complete : function(){
                            $progress.hide();
                        }

                    });
                });
            }
        });
/**
 * End of cropping images for Creator profile image
 */

 

}); 



/**
         * 
         * Quill editor initialization
         */
        var toolbarOptions = [
            ['bold', 'italic', 'underline'],        // toggled buttons
            
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        
            // [{ 'font': [] }],
        
            ['clean']                                         // remove formatting button
        ];
        
        function initEditor(){
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


function getStory(quill){
    var content = quill.getText();
    var delta = JSON.stringify(quill.getContents());
    var editorWindow = document.getElementById('editor-container').getElementsByClassName('ql-editor')[0];

    // var formattedContent = editorWindow.innerHTML.toString();

    var formattedContent = quill.getText();

    return{
        content : content,
        delta : delta,
        formattedContent : formattedContent
    }
}

$(document).ready(function() {

    var quill = initEditor();

    var about_you;

    var submit_button = $('#Submit_profile');
    submit_button.on('click', function(){
        var creatorname = $('#creator_name_create').val();
        var staticURL = $('#staticURL').val();
        var short_desc = $('#short_desc').val();
        var location_now = $('#location_now').val();

        about_you = getStory(quill);

        console.log(about_you);

        var formdata = {
            name : creatorname,
            url : staticURL,
            desc : short_desc,
            username : staticURL,
            location : location_now,
            about : about_you.content
        }

        var xhr = $.ajax('/test/formsubmission',{
            method : 'POST', 
            headers : {
                'CSRF-Token' : $('meta[name="csrf-token"]').attr('content')
            },
            data : formdata,
            crossDomain : false
        });

        xhr.done(function(){
            toastr.options = {
                "closeButton": true,
                "positionClass": "toast-top-full-width",
                "preventDuplicates": true,
            }

            toastr.success('You have successfully created a Fantipper creator account!');
            setTimeout( $(location).attr('href', '/creatorprofile/preview'), 9000);
            
        });
    });

});
























































// Implemetations for the creatorProfileCreate
Dropzone.autoDiscover = false; 
$(function(){
    $('#creator_profile_create').on('submit', function(event){
        event.preventDefault();
        var creator_name = $('#creator_name_create').val();
        
        console.log(creator_name);
    });

    var myDropzone = new Dropzone('#profileImageCanvas', {
        url : '/upload',
        maxFiles : 1,
        thumbnailWidth : 200,
        thumbnailHeight : 200,
        autoQueue : false
    });

    
    var image = $('#imageTest');
    var cropper = new Cropper(image, {
        aspectRatio : 12/9,
        crop(event){
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
        }
    });


});

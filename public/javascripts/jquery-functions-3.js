// Implemetations for the creatorProfileCreate
Dropzone.autoDiscover = false; 
$(function(){
    // $('#creator_profile_create').on('submit', function(event){
    //     event.preventDefault();
    //     var creator_name = $('#creator_name_create').val();
        
    //     console.log(creator_name);
    // });

    var myDropzone1 = new Dropzone('#profileImageCanvas', {
        url : '/upload/profileImages',
        maxFiles : 1,
        thumbnailWidth : 200,
        thumbnailHeight : 200,
        autoQueue : false
        
    });
    

    var myDropzone2 = new Dropzone('#backgrundImageCanvas',{
        url : '/upload/BackgroundImage',
        maxFiles : 1,
        thumbnailWidth : 200,
        thumbnailHeight : 200,
        autoQueue : false
    });

    var myDropzone2 = new Dropzone('#ImageGallery',{
        url : '/upload/BackgroundImage',
        maxFiles : 12,
        thumbnailWidth : 200,
        thumbnailHeight : 200,
        autoQueue : false
    });

    // Investigate further
    // myDropzone.options = {
    //     addedfile : function(file){
    //         file.previewTemplate = $(this.options.previewTemplate);
    //         this.element.find('.preview').append(file.previewTemplate);
    //         file.previewTemplate.find('.filename span').text(file.name);

    //     }
    // }

    

});

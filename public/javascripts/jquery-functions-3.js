// Implemetations for the creatorProfileCreate








    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        console.log(sliceSize);
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

    var csrf = $('#_csrf').val();
        var $canvas = $('#canvas');
    var context = $canvas.get(0).getContext('2d');

    $('#img_file').on('change', function(){
        if(this.files && this.files[0]){
            if(this.files[0].type.match(/^image\//)){
            var cropper;
            var filename = this.files[0].name;
                console.log(this.files[0])
                var reader = new FileReader();
                reader.onload = function(e){
                    var img = new Image();
                    img.onload = function(){
                        context.canvas.width = img.width;
                        context.canvas.height = img.height;
                        context.drawImage(img, 0, 0);

                        cropper = $canvas.cropper({});
                    };
                    img.src = e.target.result;
                };

                

                $('#crop').click(function(){
                    var croppedImage = $canvas.cropper('getCroppedCanvas').toDataURL('image/jpg');
                    $('#result').append($('<img>').attr('src', croppedImage));
                    $('#uploadImage').removeAttr('disabled');
                    // console.log(croppedImage);
                    var processedImage = croppedImage.split(',', 2)[1];
                    console.log(processedImage);
                    // var image = Base64.decode(processedImage);
                    console.log('atob',atob(processedImage))
                    var img = atob(processedImage);
                    

                    $('#croppedImage').attr('value', croppedImage);



                    // $('#uploadImage').click(function () { 
                        
                    //     var formData = new FormData();
                    //     formData.append('filename',img);
                        
                    //     console.log(formData);
                        

                    //     var xhr = new XMLHttpRequest();
                    //     xhr.open('POST', '/creator/application', true);
                    //     xhr.setRequestHeader('CSRF-Token' , csrf)
                    //     xhr.onreadystatechange = function(response){};
                    //     xhr.send(formData);
    
                    //     var xhr = $.ajax({
                    //         type : 'POST',
                    //         url : '/creator/application',
                    //         processData : false,
                            // headers : {
                            //     'CSRF-Token' : csrf
                            // },
                    //         data : formData,
                    //         crossDomain : false,
                            
                    //         // xhr : function(){
                    //         //     var xhr = new XMLHttpRequest();
                    //         //     xhr.upload.onprogress = function(e){

                    //         //     };
                    //         //     return xhr;
                    //         // }
                    //     })
                        
                        
                    //  });
    
                });

                $('#uploadImage').click(function(){

                    var reader = new FileReader();

                    var image = $('#croppedImage').val();

                    var block = image.split(";");
                    var contentType = block[0].split(":")[1];
                    var realData = block[1].split(",")[1];

                    var blob = b64toBlob(realData, contentType);
                   
                    console.log(blob);
                    // var formData = new FormData(document.getElementById("profileImageForm"));
                    var formData = new FormData();
                    console.log(formData);
                    // formData.append("image", blob);
                    formData.append('file', blob, 'file.png');
                    var temp = reader.readAsDataURL(blob);
                    console.log('teml',temp);
                    console.log(formData);
                    $.ajax({
                        url : '/creator/application',
                        type : 'POST',
                        contentType:false,
                        processData:false,
                        cache:false,
                        files : formData,
                        data : formData,
                        headers : {
                            'CSRF-Token' : csrf
                        },
                        dataType : "json",
                        error : function(err){
                            console.log(err);
                        },success:function(data){
                            console.log(data);
                        },
                        complete:function(){
                            console.log("Request finished.");
                        }
                    });
                });



                

                reader.readAsDataURL(this.files[0]);

            }else{
                toastr.options.showMethod = 'slideDown';
                toastr.options.hideMethod = 'slideUp';
                toastr.options.closeButton = true;
                toastr.error("Incorrect image format!")
            }
        }else{
            toastr.info("Sorry! You must select a profile image!")
        }
    });


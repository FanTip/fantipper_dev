window.addEventListener('DOMContentLoaded', function() {

    $('[data-toggle="tooltip"]').tooltip();
    /**
     * Cropping image functions
     */
    let avatar = document.getElementById('fan-avatar');
    let image = document.getElementById('image');
    let input = document.getElementById('fan-input');

    let $progress = $('.progress');
    let $progressBar = $('.progress-bar');
    let $alert = $('.alert');
    let $modal = $('#modal');

    let csrf_field = document.getElementById('csrf_field');

    $progress.hide();

    let cropper;

    input.addEventListener('change', function(e) {
        let files = e.target.files;
        if (files[0].size > 10000000) {
            sizeCheck = true;
            toastr.error('File too large.');
            e.stopImmediatePropagation();
        } else {
            let done = function(url) {
                $modal.modal({ backdrop: 'static', keyboard: false });
                input.value = '';
                image.src = url;
                $alert.hide();
                $modal.modal('show');
            }
            let reader;
            let file;
            let url;
            if (files && files.length > 0) {

                file = files[0];
                if (url) {
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

    // $modal.modal({backdrop : 'static', keyboard:false});
    $modal.on('shown.bs.modal', function() {
        cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1,
        }), { backdrop: 'static', keyboard: false }
    });
    // $modal.modal({backdrop : 'static', keyboard:false});
    $modal.on('hidden.bs.modal', function() {
        cropper.destroy();
        cropper = null;
    });


    document.getElementById('crop').addEventListener('click', function() {
        let initialAvatarURL;
        let canvas;

        $modal.modal('hide');

        if (cropper) {
            canvas = cropper.getCroppedCanvas({
                width: 200,
                height: 200,
            });
            initialAvatarURL = avatar.src;
            avatar.src = canvas.toDataURL();
            $progress.show();
            $alert.removeClass('alert-success alert-warning');
            canvas.toBlob(function(blob) {
                let formData = new FormData();

                formData.append('avatar', blob, 'avatar.jpg');

                $.ajax('/upload', {
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    headers: {
                        'CSRF-Token': csrf_field.value
                    },
                    success: function() {
                        toastr.success('Upload Complete');
                    },
                    error: function() {
                        avatar.src = initialAvatarURL;
                        toastr.error('Upload Error');
                    },
                    complete: function() {
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
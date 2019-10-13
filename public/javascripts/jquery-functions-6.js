/**
 * implementation for the background image upload functionality
 * 
 */
window.addEventListener('DOMContentLoaded', function() {

    var background = document.getElementById("background");
    var backgroundImage = document.getElementById("background-image");
    var backgroundInput = document.getElementById("background-input");

    var $backProgress = $('.background-progress');
    var $backProgressBar = $("#background-progress-bar");
    var $backAlert = $('.background-alert');
    var $backModal = $('#background-modal');

    $backProgress.hide();

    backgroundInput.addEventListener('change', function(e) {
        var files = e.target.files;
        if (files[0].size > 10000000) {
            sizeCheck = true;
            toastr.error('File too large.');
            e.stopImmediatePropagation();
        } else {
            var done = function(url) {
                backgroundInput.value = '';
                backgroundImage.src = url;
                $backAlert.hide();
                $backModal.modal('show');
            }

            var reader;
            var file;
            var url;

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

    $backModal.on('shown.bs.modal', function() {
        cropper = new Cropper(backgroundImage, {
            viewMode: 1,
            checkCrossOrigin: false,
            background: false,
        });
    }).on('hidden.bs.modal', function() {
        cropper.destroy();
        cropper = null;
    });

    document.getElementById('backcrop').addEventListener('click', function() {
        var initialAvatarURL;
        var canvas;

        $backModal.modal('hide');

        if (cropper) {
            canvas = cropper.getCroppedCanvas({
                width: 900,
                height: 600,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });
            initialAvatarURL = background.src;
            background.src = canvas.toDataURL();
            $backProgress.show();
            // $backAlert.removeClass()
            canvas.toBlob(function(blob) {
                var formData = new FormData();

                formData.append('background', blob, 'background.jpg');
                $.ajax('/test/background', {
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    headers: {
                        'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                    },

                    xhr: function() {
                        var xhr = new XMLHttpRequest();
                        xhr.upload.onprogress = function(e) {
                            var precent = '0';
                            var precentage = '0%';

                            if (e.lengthComputable) {
                                precent = Math.round((e.loaded / e.total) * 100);
                                precentage = precent + '%';
                                $backProgressBar.width(precentage).attr('aria-valuenow', precent).text(precentage);
                            }
                        };
                        return xhr;
                    },
                    success: function() {
                        toastr.success('Background image uploaded')
                    },
                    error: function() {
                        avatar.src = initialAvatarURL;
                        toastr.error('Problem uploading Background image');
                    },
                    complete: function() {
                        $backProgress.hide();
                    }
                });
            })
        }

    });
});
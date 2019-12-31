$(document).ready(function () {
  let creator_url = $('#creatorUrl').val();
  let xhr = $.ajax({
    url: `/api/fetch_fans/` + creator_url,
    method: 'GET',
    crossDomain: false,
    headers: {
      'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
    },
  });

  xhr.done(function (response) {
    let total_fans = $('#total_fans');
    response.fans_all.length > 0 ? total_fans.append(response.fans_all.length) : total_fans.append('0');

    let all_fans_gallery = $('#all_fans_gallery');

    for (let i = 0; i < response.fans_all.length; i++) {
      let figure = $("<figure class='col-md-4'>");
      let img = $('<img src="' + response.fans_all[i].pic + '" height="50" width="50" class="rounded-circle" />');
      figure.append(img);
      all_fans_gallery.append(figure);
    }

    console.log(response.fans_all.length);
  });

})
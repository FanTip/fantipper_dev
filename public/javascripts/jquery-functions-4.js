// Autocomplete the location
$(window).load(function(){
  var cities_au = new Bloodhound({
    datumTokenizer : Bloodhound.tokenizers.whitespace,
    queryTokenizer : Bloodhound.tokenizers.whitespace,
    remote : {
      url : '/api/cities/search?city=%CITY',
      wildcard : '%CITY'
    }
  });

  cities_au.initialize();


  $('#location_now').typeahead(
    {
      hint: true,
      highlight: true,
      minLength: 1,
    },
    {
      displayKey : 'value',
      source: cities_au.ttAdapter(),
      display : function (item){
        return item.city + "," + item.admin + "," + item.country;
      },
      templates : {
        notFound : function(){
          return '<p">Your location is not available</p>'
        },
        pending : function(){
          return '<p>Loading...</p>'
        }
      }

    }
  );

  $('#location').typeahead(
    {
      hint: true,
      highlight: true,
      minLength: 1,
    },
    {
      displayKey : 'value',
      source: cities_au.ttAdapter(),
      display : function (item){
        return item.city + "," + item.admin + "," + item.country;
      },
      templates : {
        notFound : function(){
          return '<p">Your location is not available</p>'
        },
        pending : function(){
          return '<p>Loading...</p>'
        }
      }

    }
  );

});
  
  
    








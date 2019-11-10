// Autocomplete the location
$(document).ready(function(){
    console.log("bloodhound");
    var cities_au = new Bloodhound({
      datumTokenizer : Bloodhound.tokenizers.whitespace,
      queryTokenizer : Bloodhound.tokenizers.whitespace,
      remote : {
        url : '/api/username/search?username=%USERNAME',
        wildcard : '%USERNAME'
      }
    });
  
    cities_au.initialize();
  
  
    $('#username').typeahead(
      {
        hint: true,
        highlight: true,
        minLength: 1,
      },
      {
        displayKey : 'value',
        source: cities_au.ttAdapter(),
        display : function (item){
          return 'Username is already used!';
        },
        templates : {
          notFound : function(){
            return 'Your username is available!';
          },
          pending : function(){
            return '<p>Searching...</p>';
          }
        }
  
      }
    );
});

  
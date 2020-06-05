getData = function(endpoint, call) {
    return $.ajax({
        type: "GET",
        url: endpoint,
        dataType: "json",
        contentType: "application/json;charset=utf-8"
      });
  }
  makeGet = function(endpoint, call) {
    (call === 'joke') ? $('#jb').attr('hidden', true) : $('#bb').attr('hidden', true);
    getData(endpoint, call)
      .done((data) => {
        handleTable(data, call);
      })
      .fail((sender, message, details) => {
        
      });
  }
  handleTable = (data, call) => {
    data = JSON.parse(data);
    if (call === "joke") {
      $('#joke_message').html(data.contents.jokes[0].joke.text);
      $('#jod_table').attr('hidden',false);
      $('#jb').attr('hidden', false);
      $('#jb').html("Again?");
    }
    else {
      for (var i = 0; i <= 3; i++) {
        $('#name'+i).html(data[i].name); a
        $('#type'+i).html(data[i].brewery_type); 
        $('#address'+i).html(data[i].street); 
      }
      $('#brew_message').html(data);
      $('#brew_table').attr('hidden',false);
      $('#bb').attr('hidden', false);
      $('#bb').html("Again?");
    }
    
  };
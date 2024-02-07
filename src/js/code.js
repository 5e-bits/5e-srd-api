// eslint-disable-next-line no-unused-vars
function update(call) {
  $('#interactive').val(call);
  interactive_call();
}

function interactive_call() {
  var content = $('#interactive').val();

  if (content == '') {
    content = 'spells/acid-arrow/';
  }

  var call_url = 'api/' + content;

  $.ajax({
    dataType: 'json',
    url: call_url,
    context: document.body,
    complete: (data) => {
      if (data['status'] == 200) {
        var d = $.parseJSON(data['responseText']);
        $('#interactive_name').html(d['name'] + ':');
        if (d['name'] === undefined) {
          $('#interactive_name').html('this request:');
        }
        $('#interactive_output').text(JSON.stringify(d, null, '\t'));
      } else if (data['status'] == 404) {
        $('#interactive_output').text(data['status'] + ' ' + data['statusText']);
      }
    },
  });
}

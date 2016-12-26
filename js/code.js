function update(call){
    jQuery('#interactive').val(call);
    interactive_call();
}

function interactive_call(){
    var content = jQuery('#interactive').val();

    if (content == ''){
        content = 'spells/1/';
    }

    var call_url = 'api/' + content;

    jQuery.ajax({
        dataType: 'json',
        url: call_url,
        context: document.body,
        complete: (data) => {
            if (data['status'] == 200){
                var d = $.parseJSON(data['responseText']);
                jQuery('#interactive_name').html(d['name']);
                $('#interactive_output').text(JSON.stringify(d, null, '\t'));
            }
            else if (data['status'] == 404) {
                $('#interactive_output').text(data['status'] + ' ' + data['statusText']);
            }
        }
    })
}


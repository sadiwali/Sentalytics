var colors; // the colors for chart and blocks

$(window).scroll((event) => {

});

$(window).resize(() => {
    resize_respond_button()
});

$(document).ready(() => {
    resize_respond_button()
    // get saved responses for each tone block

    $.post("/analyze/get_colors", data => {
        // data received, update response_element
        colors = data;
        $.post('/analyze/get_responses', data => {

            for (var i in data) {
                var tone_block = $('#' + data[i].id);
                for (var k in data[i].messages) {
                    var msg = data[i].messages[k];

                    tone_block.children('.response').children('ul').children('li')
                        .last().before('<li><textarea disabled id="entered_response" '
                            + 'placeholder="Write here...">' + msg
                            + '</textarea><ul><li onclick="enableEdit(this);">Edit</li>' +
                            '<li onclick="deleteResponse(this)">Delete</li></ul></li>')
                }
            }
            // all of the responses populated, so begin color setting
            setupColours();
            setupChart();
        });
    });
});

function setupColours() {
    $('.tone').each((index, elem) => {
        var col = $(elem).children('.tone_header').children('.col').css('backgroundColor');

        $(elem).children('.response').children('ul').children('li').each((index_a, elem_a) => {
            $(elem_a).children('ul').children('li').first().css({
                'border-color': col,
                'color': col
            });

            $(elem_a).children('ul').children('li').first().mouseenter(function () {
                $(this).css({
                    'background-color': col,
                    'color': 'white'
                });
            }).mouseleave(function () {
                $(this).css({
                    'background-color': 'transparent',
                    'color': col
                });
            });
        });

        $(elem).children('.response').children('.new_response_btn').css({
            'background-color': col
        });
    });
}

function enableEdit(element) {
    var textArea = $(element).parent().parent().children("textarea");
    var btn = $(element);

    if (btn.text().toLowerCase() == "edit") {
        // edit, set to editable
        btn.text("Save");
        textArea.prop("disabled", false);

    } else {
        // save, set to uneditable
        var id = $(element).parent().parent().parent().parent().parent().attr('id');
        var ind = $(element).parent().parent().index();
        var message = textArea.val();
        $.post('/analyze/update_response', {
            id: id, ind: ind,
            message: message
        }, res => {
            if (res) {
                // saved
                showToast("Saved!", 3000);
            } else {
                // could not save
                showToast("Uh oh. Something happend while trying to save.", 3000);
            }
        })
        btn.text("Edit");
        textArea.prop("disabled", true);
    }
}

function deleteResponse(element) {
    var id = $(element).parent().parent().parent().parent().parent().attr('id');
    var ind = $(element).parent().parent().index();
    var mainUl = $(element).parent().parent().parent();

    if (mainUl.children('li').length - 1 > 1) {
        $.post('/analyze/delete_response', { id: id, ind: ind }, res => {
            if (res) {
                // deleted successfully
                $(element).parent().parent().remove();
            } else {
                // could not delete
                showToast("Uh oh. Something happend while trying to delete.", 3000);

            }
        });
    } else {
        showToast("You can't delete that. There must be at least one.", 3000);

    }
}

function createNewResponse(element) {
    var textArea = $(element).parent().children('ul').children('li').last().children('textarea');

    if (textArea.css('display') == 'block') {
        // add, then hide 
        $(element).html('<i class="fas fa-plus"></i> &nbsp; Add a new response');
        var message = textArea.val().trim();
        if (message) {
            // user entered text
            // add in firestore, then update visually
            var id = $(element).parent().parent().attr('id');
            $.post('/analyze/new_response', { id: id, message: message }, res => {
                if (res) {

                    // added 
                    showToast("Added!", 3000);

                } else {
                    // could not add
                    showToast("Uh oh. Something happend while trying to insert.", 3000);
                }
            });
            $(element).parent().children('ul').children('li')
                .last().before('<li><textarea disabled id="entered_response" '
                    + 'placeholder="Write here...">' + message
                    + '</textarea><ul><li onclick="enableEdit(this);">Edit</li>' +
                    '<li onclick="deleteResponse(this)">Delete</li></ul></li>');
            textArea.val('');
            setupColours();
        }
        textArea.css({
            'display': 'none'
        });
    } else {
        // just show for adding
        textArea.css({
            'display': 'block'
        });

        $(element).html('<i class="fas fa-plus"></i> &nbsp; Submit');
    }
}

function resize_respond_button() {

    let val = $('#entered_response').innerWidth() - 38;


    $('.new_response_btn').css({
        'width': val.toString() + 'px'
    });

    $('.new_response').css({
        'width': (val + 40).toString() + 'px'
    });
}

function setupChart() {
    var color_names = Object.keys(colors);
    var color_codes = [];

    for (var key in color_names) {
        color_codes.push(colors[color_names[key]]);
    }

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: color_names,
            datasets: [{
                label: 'Tonal Association with BMO',
                data: [12, 19, 3, 5, 2, 3, 5],
                backgroundColor: color_codes,
                borderWidth: 2
            }]
        },
        options: {}
    });
}

function analyzeDemoMessage(what) {
    var message = $(what).parent().children('.demo_text').val();
    var response_element = $(what).parent().children('.auto_res').children('p');
    var auto_res = $(what).parent().children('.auto_res');
    $.post("/analyze/analyze_single", { message: message }, (data) => {
        // data received, update response_element
        $('.auto_res').css({
            'display': 'block'
        });
        console.log(data);
        response_element.html("\"" + data + "\"");
    });
}

function showToast(message, duration) {
    $('.toast').children('.toast_message').html(message);
    $('.toast').css({
        'bottom': '20px'
    });
    setTimeout(() => {
        $('.toast').css({
            'bottom': '-60px'
        });
    }, duration);
}


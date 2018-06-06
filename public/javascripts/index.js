var colors = {
    "anger": "#FF6383",
    "fear": "#FF9F40",
    "joy": "#FFCD56",
    "sadness": "#36A2EB",
    "analytical": "#4BC0C0",
    "confident": "#7ED321",
    "tentative": "#8163FF"
};

$(window).scroll((event) => {

});

$(window).resize(() => {
    resize_respond_button()
});

$(document).ready(() => {
    console.log('start');
    resize_respond_button()
    setupChart();
    setupColours();
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
        btn.text("Edit");
        textArea.prop("disabled", true);
    }
    console.log($(element).parent().parent().children("textarea").val());
}

function deleteResponse(element) {
    var mainUl = $(element).parent().parent().parent();
    console.log(mainUl.children('li').length);
    if (mainUl.children('li').length - 1 > 1) {
        $(element).parent().parent().remove();
    } else {
        console.log("can't delete this");
    }
}

function createNewResponse(element) {
    var textArea = $(element).parent().children('ul').children('li').last().children('textarea');

    if (textArea.css('display') == 'block') {
        // add, then hide 
        $(element).html('<i class="fas fa-plus"></i> &nbsp; Add a new response');
        if (textArea.val().trim()) {

            $(element).parent().children('ul').children('li').last().before('<li><textarea disabled id="entered_response" placeholder="Write here...">' + textArea.val() + '</textarea><ul><li onclick="enableEdit(this);">Edit</li><li onclick="deleteResponse(this)">Delete</li></ul></li>');
            textArea.val('');
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
    console.log('resiixn');
    let val = $('#entered_response').innerWidth() - 38;

    console.log(val);
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
    console.log(color_names);
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



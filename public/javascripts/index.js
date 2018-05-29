var lastScrollTop = 0; // for detecting scroll direction
var MIN_SCROLL_AMT = 150; // minimum scroll amount before scrolling menu
var scrollingDown = false; // for detecting scroll direction
var menuShowing = false; // is menu showing?

var GRID_ITEM_WIDTH = 210; // 100px each cell in grid
var GRID_GAP = 10; // 10 px grid gap for packery

// set only one of these to true to force day or night
var bg_force_day = false;
var bg_force_night = false;


$(window).scroll((event) => {
    var st = $(this).scrollTop();

    fixMenuBars();

    if (st > lastScrollTop) {
        // downscroll
        scrollingDown = true;
        showTopButton();
        hideHeader();
    } else {
        // upscroll code
        scrollingDown = false;
        showHeader();
    }
    if (st == 0) {
        hideTopButton();
    }

    lastScrollTop = st;
});

$(window).resize(() => {
    fixMenuBars();
    setGridBodyWidth();
});

$(document).ready(() => {
    $('.grid').packery({
        itemSelector: '.grid-item',
        gutter: GRID_GAP,
        stagger: 30,
        transitionDuration: '0.2s',
    });

    fixMenuBars();
    $('#bars').hover(function () {
        $('.bars_container').css({
            'opacity': '1'
        });
    });

    $('#bars').mouseleave(function () {
        if ($(window).scrollTop() >= MIN_SCROLL_AMT && scrollingDown) {
            setTimeout(() => {
                $('.bars_container').css({
                    'opacity': '0.1'
                });
            }, 500);
        }
    });
    setGridBodyWidth();
    installImageViewHandler();

    if ($('#copy_link').length) {
        $('#copy_link').html(window.location.toString());
    }

    // set the landing page bg based on date
    var time_hours = (new Date()).getHours();
    var config_to_use = '';
    if ((time_hours >= 7 && time_hours <= 19 && !bg_force_night) || bg_force_day) {
        // if between 7am and 8pm (day)
        config_to_use = 'particles_day.json';
        $('#particles-js').css({
            'background-color': '#bce0ff'
        });
        $('#quote').css({
            'color': 'black'
        });
    } else {
        config_to_use = 'particles_night.json';
        $('#particles-js').css({
            'background-color': 'black'
        });
        $('#quote').css({
            'color': 'white'
        });
    }

    console.log(time_hours, config_to_use);

    particlesJS.load('particles-js', '/assets/' + config_to_use, function () {
        console.log('callback - particles.js config loaded');
    });
});

function installImageViewHandler() {
    $('.previewable').click((event) => {

        $('#img').attr('src', event.target.src);
        $('.image_view').show();
    });
}

// set the grid body width so it is tightest, for centering
function setGridBodyWidth() {
    var howManyCanFit = Math.floor($('.grid_wrapper').width() / (GRID_ITEM_WIDTH + GRID_GAP));
    $('.grid').css({
        'width': (howManyCanFit * (GRID_ITEM_WIDTH + GRID_GAP) - GRID_GAP).toString() + 'px'
    });
}

function fixMenuBars() {
    var st = $(this).scrollTop();
    if (st <= $('#title').outerHeight() + 5 && !menuShowing) {
        $('.bars_container').css({
            'transition': 'none',
            'top': Math.abs(st - $('#title').outerHeight() - 20).toString() + 'px',
        });
    } else {
        $('.bars_container').css({
            'top': '0px',
            'transition': 'all 0.3s ease',
        });
    }
}

function hideHeader() {
    $('.bars_container').css({
        'opacity': '0.1',
        'background-color': 'transparent',
        'pointer-events': 'none'
    });
}

function showHeader() {
    $('.bars_container').css({
        'opacity': '1',
        'background-color': 'white',
        'pointer-events': 'all'
    });
}

function showTopButton() {
    $('#top_btn').show();
}

function hideTopButton() {
    $('#top_btn').hide();
}

function toggleMenu() {
    if (!menuShowing) {
        showMenu();
    } else {
        hideMenu();
    }
}

function showMenu() {
    menuShowing = true;
    $('.circle').css({
        'height': (Math.sqrt(Math.pow(screen.width, 2) + Math.pow(screen.height, 2))).toString() + 'px',
        'width': (Math.sqrt(Math.pow(screen.width, 2) + Math.pow(screen.height, 2))).toString() + 'px',
    });
    $('.footer_contents').addClass('fixed_footer_contents');
    $('#title').css({
        'transform': 'translateY(-60px)'
    });
    fixMenuBars();
}

function hideMenu() {
    menuShowing = false;

    $('.circle').css({
        'height': '0px',
        'width': '0px',
    });

    $('.footer_contents').removeClass('fixed_footer_contents');
    $('#title').css({
        'transform': 'translateY(0)'
    });
    fixMenuBars();
}

// scroll to top function
function topFunction() {
    $('html, body').animate({
        scrollTop: '0px'
    });
}

function hideImageView() {
    $('.image_view').hide();
}

function copyToClipboard(element) {
    var text = document.getElementById(element);
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("Copy");
    selection.removeAllRanges();
}

function copyLink(event) {
    copyToClipboard('copy_link');

    var duplicate = $('#clone');

    duplicate.animate({
        'top': '-10px',
        'opacity': '0'
    }, 100, () => {
        duplicate.css({
            'top': '2px',
            'opacity': '1'
        });
    })
}

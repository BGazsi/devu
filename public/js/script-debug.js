$(document).ready(function() {
    $('[data-toggle="popover"]').popover();

    if($('.container').hasClass('home') && sessionStorage.getItem('search') !== null) {
        searchByTags();
        searchInit();
    }

    favoriteInit();
    removeTagInit();

    //admin tabok
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        localStorage.setItem('lastTab', $(this).attr('href'));
    });

    //hely hozzaadasa post
    $('[data-component="upload"]').on('click', function (e) {
        $(document).trigger('gtm', {
            event: 'General Event',
            eventAction: 'recommendPlace',
            eventCategory: 'recommend',
            eventLabel: $('input[name="name"]').val()
        })
    });

    //hely hozzaadasa post
    $('[data-component="favorites-list"]').on('click', function (e) {
        $(document).trigger('gtm', {
            event: 'General Event',
            eventAction: 'favoritesList',
            eventCategory: 'favorite'
        })
    });

    //kijelentkezes
    $('[data-component="logout"]').on('click', function (e) {
        $(document).trigger('gtm', {
            event: 'General Event',
            eventAction: 'logout',
            eventCategory: 'userInteraction'
        })
    });

    //bejelentkezes
    $('[data-component="login"]').on('click', function (e) {
        $(document).trigger('gtm', {
            event: 'General Event',
            eventAction: 'login',
            eventCategory: 'userInteraction'
        })
    });

    //fb-bejelentkezes
    $('[data-component="fb-login"]').on('click', function (e) {
        $(document).trigger('gtm', {
            event: 'General Event',
            eventAction: 'facebookLogin',
            eventCategory: 'userInteraction'
        })
    });

    var lastTab = localStorage.getItem('lastTab');
    if (lastTab) {
        $('[href="' + lastTab + '"]').tab('show');
    }

    // delete-tag
    $('.delete-tag').on('click', function(e) {
        if(!confirm('Biztosan törlöd?')) {
            return false;
        } else {
            $(e.currentTarget).next('form').submit();
        }
    });

    //gradiens klikk
    $('.img-gradient').on('click', function(event) {
        window.location.replace(($(event.target).find('a').attr('href')));
    });

    //ertekeles hover
    var $ratingLabel = $('.rating-radio-label');
    $ratingLabel.on('mouseover', function(event) {
        $(event.currentTarget).find('i').addClass('hovered');
        $(event.currentTarget).prevAll('.rating-radio-label').find('i').addClass('hovered');
    });

    //ertekeles hover remove
    $ratingLabel.on('mouseleave', function(event) {
        $(event.currentTarget).find('i').removeClass('hovered');
        $(event.currentTarget).prevAll('.rating-radio-label').find('i').removeClass('hovered');
    });

    //ertekeles mentese
    $('[data-component="rating-click-listener"]').on('click', function(event) {
        var $input = $(event.currentTarget).closest('label').next();
        $input.parent().find('i').removeClass('selected');
        $input.prop('checked', true);
        $input.prevAll('.rating-radio-label').find('i').addClass('selected');
        $('#rating-form').submit();
    });

    for(var i = 0; i <= $('.rate-yourself').data('rated-value'); i++) {
        $('.rating-radio-label:nth-of-type(' + i + ')').find('i').addClass('selected');
    }

    //ertekeles kuldese backendnek
    $( "#rating-form" ).submit(function(e) {
        e.preventDefault();
        var placeid = $('.devu-container').data('place-id');
        var value = $(e.currentTarget).find('input[name="rating_value"]:checked').val();
        var posting = $.post({
            url: '/place/rate/' + placeid,
            error: function(){
                $.growl.error({ title: "Hiba!", message: "Értékeléshez be kell jelentkezned!" });
            },
            success: function(result) {
                result = JSON.parse(result);
                $('.male > span').html(result.maleRating.toFixed(1));
                $('.female > span').html(result.femaleRating.toFixed(1));
                $('.main-rating').html(result.aggregateRating.toFixed(1));
                $.growl({ title: "Köszönjük!", message: "Sikeres értékelés!" });
                $(document).trigger('gtm', {
                    event: 'General Event',
                    eventAction: 'saveRating',
                    eventCategory: 'ratings',
                    eventLabel: value
                });
            },
            data: {value: value}
        });
    });

    //tagek hozzaadasa szureskor
    $('[data-component~="add-to-filter"]').on('click', function(e) {
        var selected = $('#tags').find(":selected");
        if(!selected.text()) {
            return false;
        }
        var before = '<div class="btn-group"><button type="button" class="btn btn-xs btn-default btn-tag" data-value="' + selected.val() + '">';
        var after = '</button><button type="button" class="btn btn-xs btn-default" data-component="remove-tag"><i class="fa fa-times" aria-hidden="true"></i></button></div>';

        $('.added-tags').append(before + selected.text() + after);

        selected.remove();
        removeOldSubscribes($('[data-component~="remove-tag"]'));
        removeTagInit();
    });

    //tagekre keresés
    $('[data-component~="filter-button"]').on('click', function() {

        var addedTags = {};
        var labels = '';
        $('.added-tags .btn-tag').each(function(i, value) {
            addedTags[i] = $(value).data('value');
            labels += labels.length ? ' | ' + $(value).text() : $(value).text();
        });

        sessionStorage.setItem('search', JSON.stringify(addedTags));

        searchByTags();
        $(document).trigger('gtm', {
            event: 'General Event',
            eventAction: 'searchByTags',
            eventCategory: 'search',
            eventLabel: labels
        });
    });

    //hely feltoltesenel tag hozzaadasa
    $('[data-component~="add-tag-on-upload"]').on('click', function() {
        $('.added-tags').find('.btn-tag').each(function(i, tag) {
            $('#added-tags option').each(function(j, option) {
                if($(option).val() == $(tag).data('value')) {
                    $(option).prop('selected', 'selected');
                }
            });
        });
    });

    $('.top-place-item.place-favoritable').on('click', function(e) {
        window.location.replace('/place/' + $(e.currentTarget).data('place-id'));
    });

    $('.img-small').on('click', function(e) {
        var $currentTarget = $(e.currentTarget);
        var newSrc = $currentTarget.find('img').attr('src');
        $('.main-img').find('img').attr('src', newSrc);
    })
});

function toggleClass($element, className) {
    if($element.hasClass(className)) {
        $element.removeClass(className);
    } else {
        $element.addClass(className);
    }
}

function changeFavoriteIcon($currentTarget) {
    toggleClass($currentTarget.find('.icon-fav i'), 'fa-heart');
    toggleClass($currentTarget.find('.icon-fav i'), 'fa-heart-o');
}

function changeFavoriteText($currentTarget) {
    $.each($currentTarget.find('.favorite-text'), function(key, value) {
        toggleClass($(value), 'invisible');
    });
}

function setFavoriteIcons($favoriteIconsArray) {

    //kedvencek beallitasa
    $favoriteIconsArray.each(function(key, value) {
        if( $(value).data('is-favorite') < 0 ) {
            var $icon = $('i', $(value));
            $icon.removeClass('fa-heart');
            $icon.addClass('fa-heart-o');
        }
    });
}

function favoriteInit() {

    //kedvencek ajax
    var $favoriteIconsArray = $('[data-component~="favorite"]');
    setFavoriteIcons($favoriteIconsArray);

    $favoriteIconsArray.on('click', function(event) {
        event.stopImmediatePropagation();
        var $currentTarget = $(event.currentTarget).children('i');
        var changedPlaces = [];
        $('.place-favoritable').each(function(i, value) {
            if($(value).data('place-id') == $currentTarget.closest('.place-favoritable').data('place-id')) {
                changedPlaces.push($(value));
            }
        });

        $.post({
            url: '/user/addFavorite/' + $currentTarget.closest('.place-favoritable').data('place-id'),
            error: function(){
                $.growl.error({ title: "Hiba!", message: "Kedvencnek jelöléshez be kell jelentkezned!" });
            },
            success: function() {
                if($currentTarget.data('component') == 'changeIcon') {
                    $(changedPlaces).each(function(i, value) {
                        changeFavoriteIcon($(value));
                        if(i === 0) {
                            $(document).trigger('gtm', {
                                event: 'General Event',
                                eventAction: $(value).find('.icon-fav i').hasClass('fa-heart-o') ? 'removeFavorite' : 'addFavorite',
                                eventCategory: 'favorite',
                                eventLabel: $(value).find('h4').text()
                            });
                        }
                    });
                }
                if($currentTarget.data('component') == 'changeText') {
                    $(changedPlaces).each(function(i, value) {
                        changeFavoriteText($(value).parent());
                        if(i === 0) {
                            $(document).trigger('gtm', {
                                event: 'General Event',
                                eventAction: $currentTarget.next('.add-text').hasClass('invisible') ? 'addFavorite' : 'removeFavorite',
                                eventCategory: 'favorite',
                                eventLabel: $('h3[itemprop~="name"]').text()
                            });
                        }
                    });
                }
                $.growl({ title: "Köszönjük!", message: "Sikeres mentés!" });
            }
        });
    });
}

function searchByTags() {
    $.post({
        url: '/place/search',
        error: function(error){
            console.log(error);
            sessionStorage.removeItem('search');
        },
        success: function(html) {
            $('.list').html(html);
            favoriteInit();
        },
        data:{
            tags: JSON.parse(sessionStorage.getItem('search'))
        }
    });
}

function removeOldSubscribes($element) {
    $element.off('click');
}

function searchInit() {
    $('#tags').find('option').each(function(i, option) {
        if(sessionStorage.getItem('search').indexOf($(option).val()) !== -1) {
            var before = '<div class="btn-group"><button type="button" class="btn btn-xs btn-default btn-tag" data-value="' + $(option).val() + '">';
            var after = '</button><button type="button" class="btn btn-xs btn-default" data-component="remove-tag"><i class="fa fa-times" aria-hidden="true"></i></button></div>';
            $('.added-tags').append(before + $(option).text() + after);
            $(option).remove();
        }
    });
}

function removeTagInit() {
    //tag torlese a keresesrol
    $('[data-component~="remove-tag"]').on('click', function(e) {
        $('#tags').append('<option value="' + $(e.currentTarget).prev('.btn').data('value') + '">' + $(e.currentTarget).prev('.btn').text() + '</option>');
        $(e.currentTarget).closest('.btn-group').remove();
        if($('[data-component~="add-tag-on-upload"]').length > 0) {
            $('#added-tags option').each(function(j, option) {
                if($(option).val() == $(e.currentTarget).prev('.btn-tag').data('value')) {
                    $(option).prop("selected", false);
                }
            });
        }
    });
}
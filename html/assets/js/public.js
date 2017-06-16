
$(".bar-tab").on('click', ".tab-item", function(event) {
    var th = $(this);
    var ss = $(this).siblings('.tab-item');
    var dtClass = th.data('class');
    $(this).find(".icon").prop('className', 'icon ' + dtClass + '-active');
    $.each(ss, function(index, val) {
        var pard = $(this).data('class');
        $(this).find('.icon').removeClass().addClass('icon ' + pard);

    });
});

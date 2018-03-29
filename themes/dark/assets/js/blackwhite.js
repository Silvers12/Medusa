function generateBlackWhiteList() { // eslint-disable-line no-unused-vars
    let realvalues = [];

    $('#white option').each((i, selected) => {
        realvalues[i] = $(selected).val();
    });
    $('#whitelist').val(realvalues.join(','));

    realvalues = [];
    $('#black option').each((i, selected) => {
        realvalues[i] = $(selected).val();
    });
    $('#blacklist').val(realvalues.join(','));
}

function updateBlackWhiteList(showName) { // eslint-disable-line no-unused-vars
    $('#pool').children().remove();

    $('#blackwhitelist').show();
    if (showName) {
        $.getJSON('home/fetch_releasegroups', {
            show_name: showName // eslint-disable-line camelcase
        }, data => {
            if (data.result === 'success') {
                $.each(data.groups, (i, group) => {
                    const option = $('<option>');
                    option.prop('value', group.name);
                    option.html(group.name + ' | ' + group.rating + ' | ' + group.range);
                    option.appendTo('#pool');
                });
            }
        });
    }
}

$(document).ready(() => {
    $(document.body).on('#removeW', 'click', event => {
        !$('#white option:selected').remove().appendTo('#pool');  // eslint-disable-line no-unused-expressions
    });

    $(document.body).on('#addW', 'click', event => {
        !$('#pool option:selected').remove().appendTo('#white');  // eslint-disable-line no-unused-expressions
    });

    $(document.body).on('#addB', 'click', event => {
        !$('#pool option:selected').remove().appendTo('#black');  // eslint-disable-line no-unused-expressions
    });

    $(document.body).on('#removeP', 'click', event => {
        !$('#pool option:selected').remove();  // eslint-disable-line no-unused-expressions
    });

    $(document.body).on('#removeB', 'click', event => {
        !$('#black option:selected').remove().appendTo('#pool');  // eslint-disable-line no-unused-expressions
    });

    $(document.body).on('#addToWhite', 'click', event => {
        const group = $('#addToPoolText').val();
        if (group !== '') {
            const option = $('<option>');
            option.prop('value', group);
            option.html(group);
            option.appendTo('#white');
            $('#addToPoolText').val('');
        }
    });

    $(document.body).on('#addToBlack', 'click', event => {
        const group = $('#addToPoolText').val();
        if (group !== '') {
            const option = $('<option>');
            option.prop('value', group);
            option.html(group);
            option.appendTo('#black');
            $('#addToPoolText').val('');
        }
    });
});

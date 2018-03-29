$(document).ready(() => {
    // Perform an API call
    $(document.body).on('[data-action=api-call]', 'click', event => {
        const parameters = $('[data-command=' + $(event.currentTarget).data('command-name') + ']');
        const profile = $('#option-profile').is(':checked');
        const targetId = $(event.currentTarget).data('target');
        const timeId = $(event.currentTarget).data('time');
        let url = $('#' + $(event.currentTarget).data('base-url')).text();
        const urlId = $(event.currentTarget).data('url');

        $.each(parameters, (index, item) => {
            const name = $(item).attr('name');
            let value = $(item).val();

            if (name !== undefined && value !== undefined && name !== value && value) {
                if ($.isArray(value)) {
                    value = value.join('|');
                }

                url += '&' + name + '=' + value;
            }
        });

        if (profile) {
            url += '&profile=1';
        }

        const requestTime = new Date().getTime();
        $.get(url.replace('/api/', 'api/'), (data, textStatus, jqXHR) => {
            const responseTime = new Date().getTime() - requestTime;
            const jsonp = $('#option-jsonp').is(':checked');
            const responseType = jqXHR.getResponseHeader('content-type') || '';
            const target = $(targetId);

            $(timeId).text(responseTime + 'ms');
            $(urlId).text(url + (jsonp ? '&jsonp=foo' : ''));

            if (responseType.slice(0, 6) === 'image/') {
                target.html($('<img/>').prop('src', url));
            } else {
                const json = JSON.stringify(data, null, 4);

                if (jsonp) {
                    target.text('foo(' + json + ');');
                } else {
                    target.text(json);
                }
            }

            target.parents('.result-wrapper').removeClass('hidden');
        });
    });

    // Remove the result of an API call
    $(document.body).on('[data-action=clear-result]', 'click', event => {
        $($(event.currentTarget).data('target')).html('').parents('.result-wrapper').addClass('hidden');
    });

    // Update the list of episodes
    $(document.body).on('[data-action=update-episodes', 'change', event => {
        const command = $(event.currentTarget).data('command');
        const select = $('[data-command=' + command + '][name=episode]');
        const season = $(event.currentTarget).val();
        const show = $('[data-command=' + command + '][name=indexerid]').val();

        if (select !== undefined) {
            select.removeClass('hidden');
            select.find('option:gt(0)').remove();

            for (const episode in episodes[show][season]) { // eslint-disable-line no-undef
                if ({}.hasOwnProperty.call(episodes[show][season], episode)) {  // eslint-disable-line no-undef
                    select.append($('<option>', {
                        value: episodes[show][season][episode], // eslint-disable-line no-undef
                        label: 'Episode ' + episodes[show][season][episode] // eslint-disable-line no-undef
                    }));
                }
            }
        }
    });

    // Update the list of seasons
    $(document.body).on('[data-action=update-seasons', 'change', event => {
        const command = $(event.currentTarget).data('command');
        const select = $('[data-command=' + command + '][name=season]');
        const show = $(event.currentTarget).val();

        if (select !== undefined) {
            select.removeClass('hidden');
            select.find('option:gt(0)').remove();

            for (const season in episodes[show]) { // eslint-disable-line no-undef
                if ({}.hasOwnProperty.call(episodes[show], season)) {  // eslint-disable-line no-undef
                    select.append($('<option>', {
                        value: season,
                        label: (season === 0) ? 'Specials' : 'Season ' + season
                    }));
                }
            }
        }
    });

    // Enable command search
    $('#command-search').typeahead({
        source: commands // eslint-disable-line no-undef
    });
    $(document.body).on('#command-search', 'change', event => {
        const command = $(event.currentTarget).typeahead('getActive');

        if (command) {
            const commandId = command.replace('.', '-');
            $('[href=#command-' + commandId + ']').click();
        }
    });
});

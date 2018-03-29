MEDUSA.manage.subtitleMissed = function() {
    $(document.body).on('.allCheck', 'click', event => {
        const seriesId = $(this).attr('data-indexer-id') + '-' + $(this).attr('data-series-id');
        $('.' + seriesId + '-epcheck').prop('checked', $(this).prop('checked'));
    });

    $(document.body).on('.get_more_eps', 'click', event => {
        const indexerId = $(this).attr('data-indexer-id');
        const seriesId = $(this).attr('data-series-id');
        const checked = $('#allCheck-' + indexerId + '-' + seriesId).prop('checked');
        const lastRow = $('tr#' + indexerId + '-' + seriesId);
        const clicked = $(this).data('clicked');
        const action = $(this).attr('value');

        if (clicked) {
            if (action === 'Collapse') {
                $('table tr').filter('.show-' + indexerId + '-' + seriesId).hide();
                $(this).prop('value', 'Expand');
            } else if (action === 'Expand') {
                $('table tr').filter('.show-' + indexerId + '-' + seriesId).show();
                $(this).prop('value', 'Collapse');
            }
        } else {
            $.getJSON('manage/showSubtitleMissed', {
                indexer: indexerId, // eslint-disable-line camelcase
                seriesid: seriesId, // eslint-disable-line camelcase
                whichSubs: $('#selectSubLang').val()
            }, data => {
                $.each(data, (season, eps) => {
                    $.each(eps, (episode, data) => {
                        lastRow.after($.makeSubtitleRow(indexerId, seriesId, season, episode, data.name, data.subtitles, checked));
                    });
                });
            });
            $(this).data('clicked', 1);
            $(this).prop('value', 'Collapse');
        }
    });

    // Selects all visible episode checkboxes.
    $(document.body).on('.selectAllShows', 'click', event => {
        $('.allCheck').each(function() {
            this.checked = true;
        });
        $('input[class*="-epcheck"]').each(function() {
            this.checked = true;
        });
    });

    // Clears all visible episode checkboxes and the season selectors
    $(document.body).on('.unselectAllShows', 'click', event => {
        $('.allCheck').each(function() {
            this.checked = false;
        });
        $('input[class*="-epcheck"]').each(function() {
            this.checked = false;
        });
    });
};

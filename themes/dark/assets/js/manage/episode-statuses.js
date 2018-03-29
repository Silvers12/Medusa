MEDUSA.manage.episodeStatuses = function() {
    $(document.body).on('.allCheck', 'click', event => {
        const seriesId = $(event.currentTarget).attr('data-indexer-id') + '-' + $(event.currentTarget).attr('data-series-id');
        $('.' + seriesId + '-epcheck').prop('checked', $(event.currentTarget).prop('checked'));
    });

    $(document.body).on('.get_more_eps', 'click', event => {
        const indexerId = $(event.currentTarget).attr('data-indexer-id');
        const indexerName = MEDUSA.config.indexers.indexerIdToName(indexerId);
        const seriesId = $(event.currentTarget).attr('data-series-id');
        const checked = $('#allCheck-' + indexerId + '-' + seriesId).prop('checked');
        const lastRow = $('tr#' + indexerId + '-' + seriesId);
        const clicked = $(event.currentTarget).data('clicked');
        const action = $(event.currentTarget).attr('value');

        if (clicked) {
            if (action.toLowerCase() === 'collapse') {
                $('table tr').filter('.show-' + indexerId + '-' + seriesId).hide();
                $(event.currentTarget).prop('value', 'Expand');
            } else if (action.toLowerCase() === 'expand') {
                $('table tr').filter('.show-' + indexerId + '-' + seriesId).show();
                $(event.currentTarget).prop('value', 'Collapse');
            }
        } else {
            $.getJSON('manage/showEpisodeStatuses', {
                indexername: indexerName,
                seriesid: seriesId, // eslint-disable-line camelcase
                whichStatus: $('#oldStatus').val()
            }, data => {
                $.each(data, (season, eps) => {
                    $.each(eps, (episode, name) => {
                        lastRow.after($.makeEpisodeRow(indexerId, seriesId, season, episode, name, checked));
                    });
                });
            });
            $(event.currentTarget).data('clicked', 1);
            $(event.currentTarget).prop('value', 'Collapse');
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

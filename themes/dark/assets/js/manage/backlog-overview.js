MEDUSA.manage.backlogOverview = function() {
    checkForcedSearch();

    function checkForcedSearch() {
        let pollInterval = 5000;
        const searchStatusUrl = 'home/getManualSearchStatus';
        const indexerName = $('#indexer-name').val();
        const seriesId = $('#series-id').val();
        const url = seriesId === undefined ? searchStatusUrl : searchStatusUrl + '?indexername=' + indexerName + '&seriesid=' + seriesId;
        $.ajax({
            url,
            error() {
                pollInterval = 30000;
            },
            type: 'GET',
            dataType: 'JSON',
            complete() {
                setTimeout(checkForcedSearch, pollInterval);
            },
            timeout: 15000 // Timeout every 15 secs
        }).done(data => {
            if (data.episodes) {
                pollInterval = 5000;
            } else {
                pollInterval = 15000;
            }
            updateForcedSearch(data);
        });
    }

    function updateForcedSearch(data) {
        $.each(data.episodes, (name, ep) => {
            const el = $('a[id=' + ep.indexer_id + 'x' + ep.series_id + 'x' + ep.season + 'x' + ep.episode + ']');
            const img = el.children('img[data-ep-search]');
            const episodeStatus = ep.status.toLowerCase();
            const episodeSearchStatus = ep.searchstatus.toLowerCase();
            if (el) {
                if (episodeSearchStatus === 'searching' || episodeSearchStatus === 'queued') {
                    // El=$('td#' + ep.season + 'x' + ep.episode + '.search img');
                    img.prop('src', 'images/loading16.gif');
                } else if (episodeSearchStatus === 'finished') {
                    // El=$('td#' + ep.season + 'x' + ep.episode + '.search img');
                    if (episodeStatus.indexOf('snatched') >= 0) {
                        img.prop('src', 'images/yes16.png');
                        setTimeout(() => {
                            img.parent().parent().parent().remove();
                        }, 3000);
                    } else {
                        img.prop('src', 'images/search16.png');
                    }
                }
            }
        });
    }

    $(document.body).on('#pickShow', 'change', event => {
        const id = $(event.currentTarget).val();
        if (id) {
            $('html,body').animate({ scrollTop: $('#show-' + id).offset().top - 25 }, 'slow');
        }
    });

    $(document.body).on('#backlog_period', 'change', event => {
        api.patch('config/main', {
            backlogOverview: {
                period: $(event.currentTarget).val()
            }
        }).then(response => {
            log.info(response);
            window.location.reload();
        }).catch(err => {
            log.error(err);
        });
    });

    $(document.body).on('#backlog_status', 'change', event => {
        api.patch('config/main', {
            backlogOverview: {
                status: $(event.currentTarget).val()
            }
        }).then(response => {
            log.info(response);
            window.location.reload();
        }).catch(err => {
            log.error(err);
        });
    });

    $(document.body).on('.forceBacklog', 'click', event => {
        $.get($(event.currentTarget).attr('href'));
        $(event.currentTarget).text('Searching...');
        return false;
    });

    $('.epArchive').on('click', function(event) {
        event.preventDefault();
        const img = $(event.currentTarget).children('img[data-ep-archive]');
        img.prop('title', 'Archiving');
        img.prop('alt', 'Archiving');
        img.prop('src', 'images/loading16.gif');
        const url = $(event.currentTarget).prop('href');
        $.getJSON(url, data => {
            // If they failed then just put the red X
            if (data.result.toLowerCase() === 'success') {
                img.prop('src', 'images/yes16.png');
                setTimeout(() => {
                    img.parent().parent().parent().remove();
                }, 3000);
            } else {
                img.prop('src', 'images/no16.png');
            }
            return false;
        });
    });

    $('.epSearch').on('click', function(event) {
        event.preventDefault();
        const img = $(event.currentTarget).children('img[data-ep-search]');
        img.prop('title', 'Searching');
        img.prop('alt', 'Searching');
        img.prop('src', 'images/loading16.gif');
        const url = $(event.currentTarget).prop('href');
        $.getJSON(url, data => {
            // If they failed then just put the red X
            if (data.result.toLowerCase() === 'failed') {
                img.prop('src', 'images/no16.png');
            }
            return false;
        });
    });
};

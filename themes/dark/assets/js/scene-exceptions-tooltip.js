$(() => {
    $('.title a').each(function() {
        const indexerName = $(event.currentTarget).parent().attr('data-indexer-name');
        const seriesId = $(event.currentTarget).parent().attr('data-series-id');
        $(event.currentTarget).qtip({
            content: {
                text: 'Loading...',
                ajax: {
                    url: 'home/sceneExceptions',
                    type: 'GET',
                    data: {
                        indexername: indexerName,
                        seriesid: seriesId
                    },
                    success(data) {
                        this.set('content.text', data);
                    }
                }
            },
            show: {
                solo: true
            },
            position: {
                my: 'bottom center',
                at: 'top center',
                adjust: {
                    y: 10,
                    x: 0
                }
            },
            style: {
                tip: {
                    corner: true,
                    method: 'polygon'
                },
                classes: 'qtip-rounded qtip-shadow ui-tooltip-sb'
            }
        });
    });
});

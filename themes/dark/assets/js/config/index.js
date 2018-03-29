MEDUSA.config.index = function() {
    if ($('input[name="proxy_setting"]').val().length === 0) {
        $('input[id="proxy_indexers"]').prop('checked', false);
        $('label[for="proxy_indexers"]').hide();
    }

    $(document.body).on('#theme_name', 'change', event => {
        api.patch('config/main', {
            theme: {
                name: $(event.currentTarget).val()
            }
        }).then(response => {
            log.info(response);
            window.location.reload();
        }).catch(err => {
            log.error(err);
        });
    });

    $(document.body).on('input[name="proxy_setting"]', 'input', event => {
        if ($(event.currentTarget).val().length === 0) {
            $('input[id="proxy_indexers"]').prop('checked', false);
            $('label[for="proxy_indexers"]').hide();
        } else {
            $('label[for="proxy_indexers"]').show();
        }
    });

    $('#log_dir').fileBrowser({
        title: 'Select log file folder location'
    });
};

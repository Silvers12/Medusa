$(document).ready(() => {
    $(document.body).on('.seriesCheck', 'click', event => {
        const serCheck = this;

        $('.seasonCheck:visible').each(function() {
            this.checked = serCheck.checked;
        });

        $('.epCheck:visible').each(function() {
            this.checked = serCheck.checked;
        });
    });

    $(document.body).on('.seasonCheck', 'click', event => {
        const seasCheck = this;
        const seasNo = $(seasCheck).attr('id');

        $('.epCheck:visible').each(function() {
            const epParts = $(event.currentTarget).attr('id').split('x');

            if (epParts[0] === seasNo) {
                this.checked = seasCheck.checked;
            }
        });
    });

    $(document.body).on('input[type=submit]', 'click', event => {
        const epArr = [];

        $('.epCheck').each(function() {
            if (this.checked === true) {
                epArr.push($(event.currentTarget).attr('id'));
            }
        });

        if (epArr.length === 0) {
            return false;
        }

        window.location.href = $('base').attr('href') + 'home/doRename?indexername=' + $('#indexer-name').attr('value') +
            '&seriesid=' + $('#series-id').attr('value') + '&eps=' + epArr.join('|');
    });
});

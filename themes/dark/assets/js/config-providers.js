$(document).ready(function() { // eslint-disable-line max-lines
    console.log('This function need to be moved to config/providers.js but can\'t be as we\'ve got scope issues currently.');
    $.fn.showHideProviders = function() {
        $('.providerDiv').each(function() {
            const providerName = $(event.currentTarget).prop('id');
            const selectedProvider = $('#editAProvider :selected').val();

            if (selectedProvider + 'Div' === providerName) {
                $(event.currentTarget).show();
            } else {
                $(event.currentTarget).hide();
            }
        });
    };

    const ifExists = function(loopThroughArray, searchFor) {
        let found = false;

        loopThroughArray.forEach(rootObject => {
            if (rootObject.name === searchFor) {
                found = true;
            }
            console.log(rootObject.name + ' while searching for: ' + searchFor);
        });
        return found;
    };

    /**
     * Gets categories for the provided newznab provider.
     * @param {String} isDefault
     * @param {Array} selectedProvider
     * @return no return data. Function updateNewznabCaps() is run at callback
     */
    $.fn.getCategories = function(isDefault, selectedProvider) {
        const name = selectedProvider[0];
        const url = selectedProvider[1];
        const key = selectedProvider[2];

        if (!name || !url || !key) {
            return;
        }

        const params = { url, name, api_key: key }; // eslint-disable-line camelcase

        $('.updating_categories').wrapInner('<span><img src="images/loading16' + MEDUSA.config.themeSpinner + '.gif"> Updating Categories ...</span>'); // eslint-disable-line no-undef
        const jqxhr = $.getJSON('config/providers/getNewznabCategories', params, function(data) {
            $(event.currentTarget).updateNewznabCaps(data, selectedProvider);
            console.debug(data.tv_categories);
        });
        jqxhr.always(() => {
            $('.updating_categories').empty();
        });
    };

    const newznabProviders = [];
    const torrentRssProviders = [];

    $.fn.addProvider = function(id, name, url, key, cat, isDefault, showProvider) { // eslint-disable-line max-params
        url = $.trim(url);
        if (!url) {
            return;
        }

        if (!/^https?:\/\//i.test(url)) {
            url = 'http://' + url;
        }

        if (url.match('/$') === null) {
            url += '/';
        }

        const newData = [isDefault, [name, url, key, cat]];
        newznabProviders[id] = newData;

        $('#editANewznabProvider').append('<option value=' + id + '>' + name + '</option>');
        $('select#editANewznabProvider').prop('selectedIndex', 0);

        if ($('#provider_order_list > #' + id).length === 0 && showProvider !== false) {
            const toAdd = '<li class="ui-state-default" id="' + id + '"> <input type="checkbox" id="enable_' + id + '" class="provider_enabler" CHECKED> <a href="' + MEDUSA.config.anonURL + url + '" class="imgLink" target="_new"><img src="images/providers/newznab.png" alt="' + name + '" width="16" height="16"></a> ' + name + '</li>'; // eslint-disable-line no-undef

            $('#provider_order_list').append(toAdd);
            $('#provider_order_list').sortable('refresh');
        }

        $(event.currentTarget).makeNewznabProviderString();
    };

    $.fn.addTorrentRssProvider = function(id, name, url, cookies, titleTag) { // eslint-disable-line max-params
        const newData = [name, url, cookies, titleTag];
        torrentRssProviders[id] = newData;

        $('#editATorrentRssProvider').append('<option value=' + id + '>' + name + '</option>');
        $(event.currentTarget).populateTorrentRssSection();

        if ($('#provider_order_list > #' + id).length === 0) {
            $('#provider_order_list').append('<li class="ui-state-default" id="' + id + '"> <input type="checkbox" id="enable_' + id + '" class="provider_enabler" CHECKED> <a href="' + MEDUSA.config.anonURL + url + '" class="imgLink" target="_new"><img src="images/providers/torrentrss.png" alt="' + name + '" width="16" height="16"></a> ' + name + '</li>'); // eslint-disable-line no-undef
            $('#provider_order_list').sortable('refresh');
        }

        $(event.currentTarget).makeTorrentRssProviderString();
    };

    $.fn.updateProvider = function(id, url, key, cat) {
        newznabProviders[id][1][1] = url;
        newznabProviders[id][1][2] = key;
        newznabProviders[id][1][3] = cat;

        $(event.currentTarget).populateNewznabSection();

        $(event.currentTarget).makeNewznabProviderString();
    };

    $.fn.deleteProvider = function(id) {
        $('#editANewznabProvider option[value=' + id + ']').remove();
        delete newznabProviders[id];
        $(event.currentTarget).populateNewznabSection();
        $('li').remove('#' + id);
        $(event.currentTarget).makeNewznabProviderString();
    };

    $.fn.updateTorrentRssProvider = function(id, url, cookies, titleTag) {
        torrentRssProviders[id][1] = url;
        torrentRssProviders[id][2] = cookies;
        torrentRssProviders[id][3] = titleTag;
        $(event.currentTarget).populateTorrentRssSection();
        $(event.currentTarget).makeTorrentRssProviderString();
    };

    $.fn.deleteTorrentRssProvider = function(id) {
        $('#editATorrentRssProvider option[value=' + id + ']').remove();
        delete torrentRssProviders[id];
        $(event.currentTarget).populateTorrentRssSection();
        $('li').remove('#' + id);
        $(event.currentTarget).makeTorrentRssProviderString();
    };

    $.fn.populateNewznabSection = function() {
        const selectedProvider = $('#editANewznabProvider :selected').val();
        let data = '';
        let isDefault = '';
        let rrcat = '';

        if (selectedProvider === 'addNewznab') {
            data = ['', '', ''];
            isDefault = 0;
            $('#newznab_add_div').show();
            $('#newznab_update_div').hide();
            $('#newznab_cat').prop('disabled', true);
            $('#newznab_cap').prop('disabled', true);
            $('#newznab_cat_update').prop('disabled', true);
            $('#newznabcapdiv').hide();

            $('#newznab_cat option').each(function() {
                $(event.currentTarget).remove();
            });

            $('#newznab_cap option').each(function() {
                $(event.currentTarget).remove();
            });
        } else {
            data = newznabProviders[selectedProvider][1];
            isDefault = newznabProviders[selectedProvider][0];
            $('#newznab_add_div').hide();
            $('#newznab_update_div').show();
            $('#newznab_cat').prop('disabled', false);
            $('#newznab_cap').prop('disabled', false);
            $('#newznab_cat_update').prop('disabled', false);
            $('#newznabcapdiv').show();
        }

        $('#newznab_name').val(data[0]);
        $('#newznab_url').val(data[1]);
        $('#newznab_api_key').val(data[2]);

        // Check if not already array
        if (typeof data[3] === 'string') {
            rrcat = data[3].split(',');
        } else {
            rrcat = data[3];
        }

        // Update the category select box (on the right)
        const newCatOptions = [];
        if (rrcat) {
            rrcat.forEach(cat => {
                if (cat !== '') {
                    newCatOptions.push({
                        text: cat,
                        value: cat
                    });
                }
            });
            $('#newznab_cat').replaceOptions(newCatOptions);
        }

        if (selectedProvider === 'addNewznab') {
            $('#newznab_name').prop('disabled', false);
            $('#newznab_url').prop('disabled', false);
        } else {
            $('#newznab_name').prop('disabled', true);

            if (isDefault) {
                $('#newznab_url').prop('disabled', true);
                $('#newznab_delete').prop('disabled', true);
            } else {
                $('#newznab_url').prop('disabled', false);
                $('#newznab_delete').prop('disabled', false);
            }

            // Get Categories Capabilities
            if (data[0] && data[1] && data[2] && !ifExists($.fn.newznabProvidersCapabilities, data[0])) {
                $(event.currentTarget).getCategories(isDefault, data);
            }
            $(event.currentTarget).updateNewznabCaps(null, data);
        }
    };

    /**
     * Updates the Global array $.fn.newznabProvidersCapabilities with a combination of newznab prov name
     * and category capabilities. Return
     * @param {Array} newzNabCaps, is the returned object with newznabprovider Name and Capabilities.
     * @param {Array} selectedProvider
     * @return no return data. The multiselect input $("#newznab_cap") is updated, as a result.
     */
    $.fn.updateNewznabCaps = function(newzNabCaps, selectedProvider) {
        if (newzNabCaps && !ifExists($.fn.newznabProvidersCapabilities, selectedProvider[0])) {
            $.fn.newznabProvidersCapabilities.push({
                name: selectedProvider[0],
                categories: newzNabCaps.tv_categories // eslint-disable-line camelcase
            });
        }

        // Loop through the array and if currently selected newznab provider name matches one in the array, use it to
        // update the capabilities select box (on the left).
        $('#newznab_cap').empty();
        if (selectedProvider[0]) {
            $.fn.newznabProvidersCapabilities.forEach(newzNabCap => {
                if (newzNabCap.name && newzNabCap.name === selectedProvider[0] && Array.isArray(newzNabCap.categories)) {
                    const newCapOptions = [];
                    newzNabCap.categories.forEach(categorySet => {
                        if (categorySet.id && categorySet.name) {
                            newCapOptions.push({
                                value: categorySet.id,
                                text: categorySet.name + '(' + categorySet.id + ')'
                            });
                        }
                    });
                    $('#newznab_cap').replaceOptions(newCapOptions);
                }
            });
        }
    };

    $.fn.makeNewznabProviderString = function() {
        const provStrings = [];

        for (const id in newznabProviders) {
            if ({}.hasOwnProperty.call(newznabProviders, id)) {
                provStrings.push(newznabProviders[id][1].join('|'));
            }
        }

        $('#newznab_string').val(provStrings.join('!!!'));
    };

    $.fn.populateTorrentRssSection = function() {
        const selectedProvider = $('#editATorrentRssProvider :selected').val();
        let data = '';

        if (selectedProvider === 'addTorrentRss') {
            data = ['', '', '', 'title'];
            $('#torrentrss_add_div').show();
            $('#torrentrss_update_div').hide();
        } else {
            data = torrentRssProviders[selectedProvider];
            $('#torrentrss_add_div').hide();
            $('#torrentrss_update_div').show();
        }

        $('#torrentrss_name').val(data[0]);
        $('#torrentrss_url').val(data[1]);
        $('#torrentrss_cookies').val(data[2]);
        $('#torrentrss_title_tag').val(data[3]);

        if (selectedProvider === 'addTorrentRss') {
            $('#torrentrss_name').prop('disabled', false);
            $('#torrentrss_url').prop('disabled', false);
            $('#torrentrss_cookies').prop('disabled', false);
            $('#torrentrss_title_tag').prop('disabled', false);
        } else {
            $('#torrentrss_name').prop('disabled', true);
            $('#torrentrss_url').prop('disabled', false);
            $('#torrentrss_cookies').prop('disabled', true);
            $('#torrentrss_title_tag').prop('disabled', false);
            $('#torrentrss_delete').prop('disabled', false);
        }
    };

    $.fn.makeTorrentRssProviderString = function() {
        const provStrings = [];
        for (const id in torrentRssProviders) {
            if ({}.hasOwnProperty.call(torrentRssProviders, id)) {
                provStrings.push(torrentRssProviders[id].join('|'));
            }
        }

        $('#torrentrss_string').val(provStrings.join('!!!'));
    };

    $.fn.refreshProviderList = function() {
        const idArr = $('#provider_order_list').sortable('toArray');
        const finalArr = [];
        $.each(idArr, (key, val) => {
            const checked = $('#enable_' + val).is(':checked') ? '1' : '0';
            finalArr.push(val + ':' + checked);
        });

        $('#provider_order').val(finalArr.join(' '));
        $(event.currentTarget).refreshEditAProvider();
    };

    $.fn.refreshEditAProvider = function() {
        $('#provider-list').empty();

        const idArr = $('#provider_order_list').sortable('toArray');
        const finalArr = [];
        $.each(idArr, (key, val) => {
            if ($('#enable_' + val).prop('checked')) {
                finalArr.push(val);
            }
        });

        if (finalArr.length > 0) {
            $('<select>').prop('id', 'editAProvider').addClass('form-control input-sm').appendTo('#provider-list');
            for (let i = 0, len = finalArr.length; i < len; i++) {
                const provider = finalArr[i];
                $('#editAProvider').append($('<option>').prop('value', provider).text($.trim($('#' + provider).text()).replace(/\s\*$/, '').replace(/\s\*\*$/, '')));
            }
        } else {
            document.getElementsByClassName('component-desc')[0].innerHTML = 'No providers available to configure.';
        }

        $(event.currentTarget).showHideProviders();
    };

    $(event.currentTarget).on('change', '.newznab_api_key', function() {
        let providerId = $(event.currentTarget).prop('id');
        providerId = providerId.substring(0, providerId.length - '_hash'.length);

        const url = $('#' + providerId + '_url').val();
        const cat = $('#' + providerId + '_cat').val();
        const key = $(event.currentTarget).val();

        $(event.currentTarget).updateProvider(providerId, url, key, cat);
    });

    $(document.body).on('#newznab_api_key,#newznab_url', 'change', event => {
        const selectedProvider = $('#editANewznabProvider :selected').val();

        if (selectedProvider === 'addNewznab') {
            return;
        }

        const url = $('#newznab_url').val();
        const key = $('#newznab_api_key').val();

        const cat = $('#newznab_cat option').map((i, opt) => {
            return $(opt).text();
        }).toArray().join(',');

        $(event.currentTarget).updateProvider(selectedProvider, url, key, cat);
    });

    $(document.body).on('#torrentrss_url,#torrentrss_cookies,#torrentrss_title_tag', 'change', event => {
        const selectedProvider = $('#editATorrentRssProvider :selected').val();

        if (selectedProvider === 'addTorrentRss') {
            return;
        }

        const url = $('#torrentrss_url').val();
        const cookies = $('#torrentrss_cookies').val();
        const titleTag = $('#torrentrss_title_tag').val();

        $(event.currentTarget).updateTorrentRssProvider(selectedProvider, url, cookies, titleTag);
    });

    $('body').on('change', '#editAProvider', function() {
        $(event.currentTarget).showHideProviders();
    });

    $(document.body).on('#editANewznabProvider', 'change', event => {
        $(event.currentTarget).populateNewznabSection();
    });

    $(document.body).on('#editATorrentRssProvider', 'change', event => {
        $(event.currentTarget).populateTorrentRssSection();
    });

    $(event.currentTarget).on('click', '.provider_enabler', function() {
        $(event.currentTarget).refreshProviderList();
    });

    $(document.body).on('#newznab_cat_update', 'click', event => {
        // Maybe check if there is anything selected?
        $('#newznab_cat option').each(function() {
            $(event.currentTarget).remove();
        });

        const newOptions = [];

        // When the update botton is clicked, loop through the capabilities list
        // and copy the selected category id's to the category list on the right.
        $('#newznab_cap option:selected').each(function() {
            const selectedCat = $(event.currentTarget).val();
            console.debug(selectedCat);
            newOptions.push({
                text: selectedCat,
                value: selectedCat
            });
        });

        $('#newznab_cat').replaceOptions(newOptions);

        const selectedProvider = $('#editANewznabProvider :selected').val();
        if (selectedProvider === 'addNewznab') {
            return;
        }

        const url = $('#newznab_url').val();
        const key = $('#newznab_api_key').val();

        const cat = $('#newznab_cat option').map((i, opt) => {
            return $(opt).text();
        }).toArray().join(',');

        $('#newznab_cat option:not([value])').remove();

        $(event.currentTarget).updateProvider(selectedProvider, url, key, cat);
    });

    $(document.body).on('#newznab_add', 'click', event => {
        const name = $.trim($('#newznab_name').val());
        const url = $.trim($('#newznab_url').val());
        const key = $.trim($('#newznab_api_key').val());
        // Var cat = $.trim($('#newznab_cat').val());

        const cat = $.trim($('#newznab_cat option').map((i, opt) => {
            return $(opt).text();
        }).toArray().join(','));

        if (!name || !url || !key) {
            return;
        }

        const params = { name };

        // Send to the form with ajax, get a return value
        $.getJSON('config/providers/canAddNewznabProvider', params, function(data) {
            if (data.error !== undefined) {
                alert(data.error); // eslint-disable-line no-alert
                return;
            }
            $(event.currentTarget).addProvider(data.success, name, url, key, cat, 0);
        });
    });

    $(document.body).on('.newznab_delete', 'click', event => {
        const selectedProvider = $('#editANewznabProvider :selected').val();
        $(event.currentTarget).deleteProvider(selectedProvider);
    });

    $(document.body).on('#torrentrss_add', 'click', event => {
        const name = $('#torrentrss_name').val();
        const url = $('#torrentrss_url').val();
        const cookies = $('#torrentrss_cookies').val();
        const titleTag = $('#torrentrss_title_tag').val();
        const params = {
            name,
            url,
            cookies,
            title_tag: titleTag // eslint-disable-line camelcase
        };

        // @TODO: Move to the API
        // send to the form with ajax, get a return value
        $.getJSON('config/providers/canAddTorrentRssProvider', params, function(data) {
            if (data.error !== undefined) {
                alert(data.error); // eslint-disable-line no-alert
                return;
            }

            $(event.currentTarget).addTorrentRssProvider(data.success, name, url, cookies, titleTag);
            $(event.currentTarget).refreshEditAProvider();
        });
    });

    $(document.body).on('.torrentrss_delete', 'click', event => {
        $(event.currentTarget).deleteTorrentRssProvider($('#editATorrentRssProvider :selected').val());
        $(event.currentTarget).refreshEditAProvider();
    });

    $(event.currentTarget).on('change', '[class="providerDiv_tip"] input', function() {
        $('div .providerDiv [name=' + $(event.currentTarget).prop('name') + ']').replaceWith($(event.currentTarget).clone());
        $('div .providerDiv [newznab_name=' + $(event.currentTarget).prop('id') + ']').replaceWith($(event.currentTarget).clone());
    });

    $(event.currentTarget).on('change', '[class="providerDiv_tip"] select', function() {
        $(event.currentTarget).find('option').each(function() {
            if ($(event.currentTarget).is(':selected')) {
                $(event.currentTarget).prop('defaultSelected', true);
            } else {
                $(event.currentTarget).prop('defaultSelected', false);
            }
        });
        $('div .providerDiv [name=' + $(event.currentTarget).prop('name') + ']').empty().replaceWith($(event.currentTarget).clone());
    });

    $(event.currentTarget).on('change', '.enabler', function() {
        if ($(event.currentTarget).is(':checked')) {
            $('.content_' + $(event.currentTarget).prop('id')).each(function() {
                $(event.currentTarget).show();
            });
        } else {
            $('.content_' + $(event.currentTarget).prop('id')).each(function() {
                $(event.currentTarget).hide();
            });
        }
    });

    $('.enabler').each(function() {
        if ($(event.currentTarget).is(':checked')) {
            $('.content_' + $(event.currentTarget).prop('id')).show();
        } else {
            $('.content_' + $(event.currentTarget).prop('id')).hide();
        }
    });

    $.fn.makeTorrentOptionString = function(providerId) {
        const seedRatio = $('.providerDiv_tip #' + providerId + '_seed_ratio').prop('value');
        const seedTime = $('.providerDiv_tip #' + providerId + '_seed_time').prop('value');
        const processMet = $('.providerDiv_tip #' + providerId + '_process_method').prop('value');
        const optionString = $('.providerDiv_tip #' + providerId + '_option_string');

        optionString.val([seedRatio, seedTime, processMet].join('|'));
    };

    $(event.currentTarget).on('change', '.seed_option', function() {
        const providerId = $(event.currentTarget).prop('id').split('_')[0];
        $(event.currentTarget).makeTorrentOptionString(providerId);
    });

    $.fn.replaceOptions = function(options) {
        let $option;

        this.empty();
        const self = this;

        $.each(options, (index, option) => {
            $option = $('<option></option>').prop('value', option.value).text(option.text);
            self.append($option);
        });
    };

    // Initialization stuff
    $.fn.newznabProvidersCapabilities = [];

    $(event.currentTarget).showHideProviders();

    $(() => {
        $('#provider_order_list').sortable({
            placeholder: 'ui-state-highlight',
            update() {
                $(event.currentTarget).refreshProviderList();
            }
        });
    });

    if ($('#editANewznabProvider').length !== 0) {
        $(event.currentTarget).populateNewznabSection();
    }
});

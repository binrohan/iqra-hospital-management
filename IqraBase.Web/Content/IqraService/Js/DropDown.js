(function (that, none) {
    Global.Free();
    LazyLoading.LoadCss([IqraConfig.Url.Css.DropDown]);
    var self = { Models: [] };
    function onSetValue(options, value) {
        var model;
        for (var i = 0; i < options.data.length; i++) {
            //console.log(options.data[i][options.valuefield]);
            if (options.data[i][options.valuefield] == value) {
                model = options.data[i];
                break;
            }
        }
        if (model) {
            onSelect(options, model);
        } else {
            options.Container.find('.k-input').text(' Select ');
            options.Selected && options.Selected.elm.removeClass('selected');
            options.value = null;
            options.elm.val(null);
        }
    };
    function onOpen(options) {
        if (!options.enable)
            return;
        if (options.IsOpened) {
            closeItem(options);
            return false;
        }
        closeAll();
        if (options.IsLoading) { alert('Data is loading.'); return false; }
        options.IsOpened = true;
        var width = options.Container.width() - 4;
        options.ItemTemplate.css({ width: width + 'px' }).find('.dropdown_item_container').css({ width: width + 'px' });
        options.ItemTemplate.slideToggle(100);
        var offset = options.Container.offset();
        offset.top += 30;
        options.ItemTemplate.offset(offset);
        options.Container.addClass('opened');
    };
    function onSelect(options, item) {
        options.Container.find('.k-input').text(item[options.textfield]);
        item.elm.addClass('selected');
        options.Selected = options.Selected || { elm: { removeClass: function () { } } };
        options.Selected.elm.removeClass('selected');
        var selected = options.Selected;
        options.Selected = item;
        options.value = item[options.valuefield];
        console.log(['', options.value, options.valuefield, item]);
        options.ItemTemplate.hide();
        options.elm.val(options.value);
        closeItem(options);
        selected[options.valuefield] != item[options.valuefield] && options.change && options.change.call(options, options.Selected, selected);
    };
    function setTemplate(options) {
        options.width = options.width || options.elm.width();
        //console.log(options.width);
        options.ItemTemplate = $('<div class="dropdown_item_template">').click(function (evt) { evt.stopPropagation(); });
        options.ItemTemplate.append('<div class="field_container"></div><div class="dropdown_item_container"><div class="k-list-scroller"><ul class="k-list k-reset"></ul></div></div>').css({ width: (options.width - 4) + 'px' });
        options.ItemContainer = options.ItemTemplate.find('ul');
        $(document.body).append(options.ItemTemplate);

        var container = $('<span class="k-widget k-dropdown k-header" title="" style="width: 100%"><span class="k-dropdown-wrap k-state-default"><span class="k-input">Select</span>' +
        '<span class="k-select"><span class="k-icon k-i-arrow-s">select</span></span></span></span>').click(function (evt) { evt.stopPropagation(); });
        options.elm.after(container).hide().data('dropdown', options);
        container.find('.k-dropdown-wrap').click(function () { onOpen(options); return false; });
        options.Container = container;
        self.Models.push(options);
        options.onviewcreated && options.onviewcreated(options);
    }
    function closeItem(options) {
        options.IsOpened = false;
        options.ItemTemplate.hide();
        options.Container.removeClass('opened');
    };
    function closeAll(isOutSide) {
        self.Models.each(function () {
            this.IsOpened = false;
            this.ItemTemplate.hide();
            this.Container.removeClass('opened');
        });
        if (!isOutSide) {
            Global.AutoComplete.CloseAll && Global.AutoComplete.CloseAll('DropDown');
            Global.MultiSelect.CloseAll && Global.MultiSelect.CloseAll('DropDown');
        }
    };
    function enable(options) {
        options.enable = true;
        options.Container.removeClass('disabled');
    };
    function disable(options) {
        options.Container.addClass('disabled');
        options.enable = false;
    };
    (function (that) {
        function create(options) {
            $(options.data).each(function () {
                this.value = this[options.valuefield] + '';
                this.text = this[options.textfield] + '';
                var model = this;
                model.elm = $('<li class="k-item">' + this[options.textfield] + '</li>').click(function () { onSelect(options, model); }).data('model', model);
                options.ItemContainer.append(model.elm);
            });
            var value = options.selectedValue || options.elm.val();
            value && options.val(value);
            console.log(['value && options.val(value) =>', value]);
        };
        that.Load = function (options) {
            options.ItemContainer.empty();
            options.valuefield = options.valuefield;
            options.textfield = options.textfield;
            if (options.datasource) {
                options.data = options.datasource;
                create(options);
            } else {
                options.Container.addClass('loading');
                options.IsLoading = true;
                options.onpost && options.onpost();
                var dataUrl = typeof options.url == 'function' ? options.url.call(options) : options.url;
                Global.CallServer(dataUrl, function (response) {
                    options.ondatabinding && options.ondatabinding(response);
                    if (typeof response.each == 'function') {
                        options.data = response;
                    } else {
                        options.data = response.Data;
                    }
                    options.Container.removeClass('loading');
                    options.IsLoading = false;
                    create(options);
                }, function (response) {
                }, null, 'GET', null, false);
            }
        };
    })(self);
    (function (service) {
        that.CloseAll = function () {
            closeAll(true);
        };
        service.Bind = function (options) {
            if (options.elm.data('dropdown')) {
                var model = options.elm.data('dropdown');
                for (var key in options) { options[key.toLowerCase()] = options[key.toLowerCase()] || options[key]; }
                model.url = options.url;
                self.Load(model);
            } else {
                for (var key in options) { options[key.toLowerCase()] = options[key.toLowerCase()] || options[key]; }
                options.IsDropDownBind = true;
                options.textfield = options.textfield || IqraConfig.DropDown.TextField;
                options.valuefield = options.valuefield || IqraConfig.DropDown.ValuField;
                setTemplate(options);
                options.data = [];
                options.Enabled = true;
                options.enable = typeof (options.enable) == typeof (none) ? true : options.enable;
                options.val = function (value) {
                    if (arguments.length < 1)
                        return options.value;
                    else
                        onSetValue(options, value);
                };
                self.Load(options);
                options.Reload = function () {
                    self.Load(options);
                };
                options.SetEnable = function (enbl) {
                    enbl ? enable(options) : disable(options);
                }
                options.SetEnable(options.enable);
                options.oncomplete && options.oncomplete(options);
            }
        };
    })(that.Service = {});
    $(document).click(function () {
        closeAll();
    });
})(Global.DropDown);
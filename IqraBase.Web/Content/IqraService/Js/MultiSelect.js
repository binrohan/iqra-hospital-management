

(function (that, nope, none) {
    Global.Free();
    LazyLoading.LoadCss([IqraConfig.Url.Css.DropDown]);
    var self = { Models: [] }, service = {};
    function createItem(options, data) {
        data.value = data[options.valuefield] + '';
        data.text = data[options.textfield] + '';
        var model = data;
        model.elm = $('<li class="k-item' + (options.selectedDic[data[options.valuefield]] ? ' selected' : '') + '"><input' + (options.selectedDic[data[options.valuefield]] ? ' checked="checked"' : '') + ' type="checkbox"> <span> ' + data[options.textfield] + '</span></li>').click(function () { onSelect(options, model); }).data('model', model);
        options.ItemContainer.append(model.elm);
    };
    function create(options, isFirst) {
        isFirst && options.ItemContainer.empty();
        options.page.PageNumber = options.page.PageNumber || 1;
        var len = Math.min((options.page.PageNumber).mlt(options.page.PageSize), options.CurrentList.length);//options.CurrentList.length < 100 ? options.CurrentList.length : 100;
        for (var i = (options.page.PageNumber - 1).mlt(options.page.PageSize) ; i < len; i++) {
            var data = options.CurrentList[i];
            createItem(options, data);
        }
    };
    function onSetValue(options, value) {
        var model;
        for (var i = 0; i < options.data.length; i++) {
            if (options.data[i][options.valuefield] == value) {
                model = options.data[i];
                break;
            }
        }
        if (model) {
            onSelect(options, model);
        } else if (value) {
            options.page.filter = options.page.filter.where('itm=>itm.field !="' + options.textfield + '"');
            options.page.filter.push({ field: options.valuefield, value: value, Operation: 0 });
            self.Load(options, true, function () {
                options.IsSearching = false;
                if (options.data.length > 0) {
                    onSelect(options, options.data[0]);
                } else {
                    setEmptyValue(options);
                }
            });
            options.page.filter.pop();
        } else {
            setEmptyValue(options);
        }
    };
    function onOpen(options) {
        if (options.IsOpened) {
            //closeItem(options);
            return false;
        }
        closeAll();
        //if (options.IsLoading) { alert('Data is loading.'); return false; }
        options.IsOpened = true;
        var width = options.Container.width() - 4;
        options.ItemTemplate.css({ width: width + 'px' }).find('.dropdown_item_container').css({ width: width + 'px' });
        options.ItemTemplate.slideToggle(100);
        var offset = options.Container.offset();
        offset.top += 30;
        options.ItemTemplate.offset(offset);
        options.Container.addClass('opened');
        if (options.Container.find('.k-input').val() == options.TotalSelectedItems) {
            options.Container.find('.k-input').val('');
        }
    };
    function onSelect(options, item) {
        item.selected = !item.selected;
        !item.elm && createItem(options, item);
        var list = [];
        options.selectedValues = [];
        options.selected.each(function () {
            if (this[options.valuefield] != item[options.valuefield]) {
                list.push(this);
                options.selectedValues.push(this[options.valuefield]);
            }
        });
        options.selected = options.selected.where('itm=>itm.' + options.valuefield + " != '" + item[options.valuefield] + "'");
        if (item.selected) {
            options.selected.push(item);
            item.elm.addClass('selected').find('input').prop('checked', true);
            options.selectedValues.push(item[options.valuefield]);
            options.selectedDic[item[options.valuefield]] = true;
        } else {
            item.elm.removeClass('selected').find('input').prop('checked', false);
            options.selectedDic[item[options.valuefield]] = false;
        }
        //options.Container.find('.k-input').val(item[options.textfield]);
        options.value = options.selectedValues.join(',');
        options.elm.val(options.value);
        options.change && options.change.call(options, options.selectedValues, options.selected);
        options.TotalSelectedItems = options.selectedValues.length + ' Items Selected'
    };
    function search(options, text, isForced) {
        if (!isForced && options.filter.value == text && options.Inputs.val() == text)
            return;
        options.IsLoading && options.Caller && options.Caller.abort();
        options.filter.value = text;
        var newFilter = [];
        //console.log(options.page);
        options.page.filter.each(function () {
            if (this.field != options.filter.field) {
                newFilter.push(this);
            }
        });
        Global.Copy(options.page.filter, newFilter, true);
        options.page.filter.length = newFilter.length;
        //options.page.filter
        if (text) {
            options.page.filter.push(options.filter);
        }
        //if (options.selectedValues.length) {
        //    options.notFilter.value =  options.selectedValues.join(",");
        //    options.page.filter.push(options.notFilter);
        //} else {
        //    options.notFilter.value = none;
        //}
        options.IsSearching = true;
        self.Load(options, true, function () { options.IsSearching = false; });
    };
    function onSearch(options, text) {
        if (options.SearchEvent) {
            clearTimeout(options.SearchEvent);
        }
        options.SearchEvent = setTimeout(function () { search(options, text.trim()) }, 150);
    };
    function onSort(options) {
        options.CurrentList = options.CurrentList || [];
        if (options.SorIndex == 2) {
            options.SorIndex = none;
            options.CurrentList = options.CurrentDefaultList;
        } else if (options.SorIndex == 1) {
            options.SorIndex = 2;
            options.CurrentList.orderBy('Name', true);
        } else {
            options.CurrentDefaultList = options.CurrentList;
            options.SorIndex = 1;
            options.CurrentList = options.CurrentList.slice().orderBy('Name');
        }
        create(options, true);
        onOpen(options);
    };
    function setTemplate(options) {
        options.width = options.width || options.elm.width();
        options.ItemTemplate = $('<div class="dropdown_item_template">').click(function (evt) { evt.stopPropagation(); });
        options.ItemTemplate.append('<div class="dropdown_item_container"><div class="k-list-header"><a class="btn_search_list active glyphicon glyphicon-search" title="Search List"></a><a class="btn_clear glyphicon glyphicon-trash" title="Clear"></a><a class="btn_selected_list glyphicon glyphicon-th-list" title="Selected List"></a></div><div class="k-list-scroller"><ul class="k-list k-reset"></ul></div><div class="k-list-footer"><label class="auto_bind" data-binding="TotalSelectedItems"></label></div></div>').css({ width: (options.width - 4) + 'px' });
        options.ItemContainer = options.ItemTemplate.find('ul');
        Global.Form.Bind(options, options.ItemTemplate.find('.k-list-footer'))
        $(document.body).append(options.ItemTemplate);
        service.Events.Bind(options);
        var container = $('<span class="k-widget k-dropdown k-header" title="" style="width: 100%"><span class="k-dropdown-wrap k-state-default"><input class="form-control k-input" style="max-height: 27px; width: 100%; padding: 0; color: inherit;" />' +
        '<span class="k-select"><span class="k-icon k-i-arrow-s">select</span></span></span></span>').click(function (evt) { evt.stopPropagation(); });
        options.elm.after(container).hide().data('dropdown', options);
        container.find('.k-dropdown-wrap').click(function () { onOpen(options); return false; });
        options.Inputs = container.find('.k-input').keyup(function () { onSearch(options, this.value); return false; }).focus(function () {
            if (this.value == options.TotalSelectedItems) {
                this.value = '';
            }
            onOpen(options);
        });
        //.blur(function () { var elm = this; setTimeout(function () { checkValue(options, elm.value); }, 150); });
        Global.Click(container.find('.k-select'), onSort, options);
        options.Container = container;
        self.Models.push(options);
        that.Service.LoadMore.Bind(options);
    };
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
            this.Container.find('.k-input').val(this.TotalSelectedItems);
        });
        if (!isOutSide) {
            Global.DropDown && Global.DropDown.CloseAll && Global.DropDown.CloseAll('MultiSelect');
            Global.AutoComplete && Global.AutoComplete.CloseAll && Global.AutoComplete.CloseAll('MultiSelect');
        }
    };
    (function (that) {
        function reloadClientSIde(options) {
            window.filterModelClientSIde = {};
            var newArray = [], exp = 'item';
            options.page.filter = options.page.filter || [];
            if (options.page.filter.length > 0) {
                options.page.filter.each(function () { filterModelClientSIde[this.field] = new RegExp(this.value, "i"); exp += ' && item.' + this.field + '.Contains(filterModelClientSIde.' + this.field + ')' });
                console.log(['exp', exp, options]);
                var b = new Function('item', 'return ' + exp);
                options.datasource.each(function () { b(this) && newArray.push(this); });
            } else {
                newArray = options.datasource;
            }
            options.page.SortBy && (newArray = newArray.orderBy(options.page.SortBy, options.page.IsDescending));
            var from = options.page.PageSize * (options.page.PageNumber - 1), to = from + options.page.PageSize;
            if (from >= newArray.length) {
                return [];
            }
            return newArray.slice(from, to);
        };
        that.Load = function (options, isFirst, func) {
            options.onload && options.onload(options);
            if (options.datasource) {
                if (isFirst) {
                    options.page.PageNumber = 1;
                    options.AllLoaded = false;
                    options.CurrentList = [];
                }
                options.data = reloadClientSIde(options);
                if (options.data.length < options.page.PageSize) {
                    options.AllLoaded = true;
                }
                options.CurrentList = options.CurrentList.concat(options.data);
                create(options, isFirst);
            } else {
                options.Container.addClass('loading');
                options.IsLoading = true;
                var page = Global.Copy({}, options.page, true);
                options.onpost && options.onpost(page);
                var dataUrl = typeof options.url == 'function' ? options.url.call(options, page) : options.url;
                options.Caller = Global.CallServer(dataUrl, function (response) {
                    options.ondatabinding && options.ondatabinding.call(options, response);
                    if (typeof response.each == 'function') {
                        options.data = response;
                    } else {
                        options.data = response.Data;
                    }
                    options.Container.removeClass('loading');
                    options.IsLoading = false;
                    if (isFirst) {
                        options.page.PageNumber = 1;
                        options.AllLoaded = false;
                        options.CurrentList = [];
                    }
                    if (options.data.length < options.page.PageSize) {
                        options.AllLoaded = true;
                    }
                    options.CurrentList = options.CurrentList.concat(options.data);
                    create(options, isFirst);
                    //options.elm.val() && options.val(options.elm.val());
                    func && func(response);
                    //console.log([options, options.onloaded]);
                    options.onloaded && options.onloaded(response.Data, options);
                }, function (response) {
                    options.IsLoading = false;
                }, page, 'POST', null, false);
            }
        };
    })(self);
    (function () {
        function setDefaultValue(options) {
            options.textfield = options.textfield || IqraConfig.MultiSelect.TextField;
            options.valuefield = options.valuefield || IqraConfig.MultiSelect.ValuField;

            options.page = options.page || Global.Copy({}, IqraConfig.MultiSelect.Page);
            options.page.filter = options.page.filter || [];
            options.filter = options.filter || { field: options.textfield, operation: IqraConfig.MultiSelect.Operation }
            options.notFilter = { field: options.valuefield, operation: 13 }
            options.selected = options.selected || [];
            options.selectedDic = {};
            options.selected.each(function () {
                options.selectedDic[this[options.valuefield] || (this + '')] = true;
            });
            options.selectedValues = [];
            console.log(['Global.MultiSelect=>', options]);
        };
        this.Bind = function (options) {
            //console.log([options]);
            if (options.elm.data('MultiSelect')) {
                var model = options.elm.data('MultiSelect');
                for (var key in options) { options[key.toLowerCase()] = options[key.toLowerCase()] || options[key]; }
                model.url = options.url;
                self.Load(model, true, function () { options.IsSearching = false; });
            } else {
                for (var key in options) { options[key.toLowerCase()] = options[key.toLowerCase()] || options[key]; }

                setDefaultValue(options);
                options.IsDropDownBind = true;
                setTemplate(options);
                options.val = function (value) {
                    if (arguments.length < 1)
                        return options.value;
                    else if (value && value[options.valuefield]) {
                        onSetValue(options, value[options.valuefield]);
                    } else {
                        onSetValue(options, value);
                    }
                };
                options.GetData = function () {
                    for (var i = 0; i < options.CurrentList.length; i++) {
                        if (options.CurrentList[i][options.valuefield] === options.value) {
                            return options.CurrentList[i];
                        }
                    }
                    return null;
                };
                options.GetText = function () {
                    for (var i = 0; i < options.CurrentList.length; i++) {
                        if (options.CurrentList[i][options.valuefield] === options.value) {
                            return options.CurrentList[i][options.textfield];
                        }
                    }
                    return '';
                };
                options.GetList = function () {
                    return options.CurrentList;
                };
                console.log(['options called ', options]);
                options.Reload = function () {
                    self.Load(options, true, function () { options.IsSearching = false; });
                };
                options.Clear = function () {
                    service.Events.Clear(options);
                };
                options.Enable = function (isEnable) {
                    if (isEnable === false) {
                        if (!options.DisabledModel) {
                            options.DisabledModel = $('<span class="drp_disabled"></span>');
                            options.Container.append(options.DisabledModel);
                        } else {
                            options.DisabledModel.show();
                        }
                    } else {
                        options.DisabledModel && options.DisabledModel.hide();
                    }
                };
                options.data = [];
                self.Load(options, true, function () {
                    options.IsSearching = false;
                });
                options.oncomplete && options.oncomplete(options);
                console.log(['options.oncomplete', options]);
            }
            return options;
        };
        that.CloseAll = function () {
            closeAll(true);
        };
        (function () {
            this.Bind = function (model) {
                model.ItemTemplate.find('.k-list-scroller').scroll(function (e) {
                    //console.log([model.IsLoading, model.ItemContainer.height(), $(this).scrollTop(), $(this).height(), (model.ItemContainer.height() - $(this).scrollTop() - $(this).height()) < 100]);
                    if (!model.AllLoaded && !model.IsLoading && (model.ItemContainer.height() - $(this).scrollTop() - $(this).scrollTop() - $(this).height()) < 60) {
                        if (model.SearchEvent) {
                            clearTimeout(model.SearchEvent);
                        }
                        model.SearchEvent = setTimeout(function () {
                            model.page.PageNumber++;
                            self.Load(model, false, function () { model.IsSearching = false; });
                        }, 150);
                    }
                });
            };
        }).call(this.LoadMore = {});
    }).call(that.Service = {});
    (function () {

        function setClear(options) {
            console.log(['setEmptyValue', options]);
            options.selected.each(function () {
                this.selected = false;
                this.elm.removeClass('selected').find('input').prop('checked', false);
            });
            options.selectedValues = [];
            options.selected = [];
            options.selectedDic = {};
            options.value = '';
            options.elm.val(options.value);
            options.change && options.change.call(options, options.selectedValues, options.selected);
            options.TotalSelectedItems = 'No Item Selected'
            options.Container.find('.k-input').val('');
            setSearchList(options);
        };
        function setSearchList(options) {
            if (options.IsSelectedList) {
                options.IsSelectedList = false;
                options.datasource = options.orginalDataSource;
                options.page.PageNumber = 1;
                options.Inputs.val('');
                search(options, '', true);
                options.Header.find('.btn_search_list').addClass('active');
                options.Header.find('.btn_selected_list').removeClass('active');
            }
        };
        function setSelectedList(options) {
            if (!options.IsSelectedList) {
                options.IsSelectedList = true;
                options.orginalDataSource = options.datasource;
                options.datasource = options.selected;
                options.page.PageNumber = 1;
                options.Inputs.val('');
                search(options, '', true);
                options.Header.find('.btn_search_list').removeClass('active');
                options.Header.find('.btn_selected_list').addClass('active');
            }
        };
        function createButtons(options) {
            options.buttons.each(function () {
                setNonCapitalisation(this);
                var html = '';
                if (this.html) {
                    html = this.html;
                } else {
                    html = '<a class="glyphicon glyphicon-' + (this.class || this.classname || '') + '" title="' + (this.title || '') + '">' + (this.text || '') + '</a>';
                }
                var elm = $(html);
                options.Header.append(elm);
                Global.Click(elm, this.click, options, false, elm);
            });
        };
        this.Clear = setClear;
        this.Bind = function (options) {
            options.Header = options.ItemTemplate.find('.k-list-header');
            Global.Click(options.Header.find('.btn_search_list'), setSearchList, options);
            Global.Click(options.Header.find('.btn_clear'), setClear, options);
            Global.Click(options.Header.find('.btn_selected_list'), setSelectedList, options);
            if (options.buttons && options.buttons.each) {
                createButtons(options);
            }
        };
    }).call(service.Events = {});
    $(document).click(function () {
        closeAll();
    });
})(Global.MultiSelect, function () { });



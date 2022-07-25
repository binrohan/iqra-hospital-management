(function (that, nope, none) {
    Global.Free();
    LazyLoading.LoadCss([IqraConfig.Url.Css.DropDown]);
    var self = { Models: [] }, currentModel, clientX, clientY;
    function mouseOver(options, model, e) {
        if (e.clientX == clientX && e.clientY == clientY) {
            return;
        }
        clientX = e.clientX;
        clientY = e.clientY;
        if (options.Focused) {
            if (options.Focused.DataIndex == model.DataIndex) {
                return;
            }
            options.Focused.elm.removeClass('selected');
        }
        options.Focused = model;
        options.Focused.elm.addClass('selected');
    };
    function createItem(options, data) {
        data.value = data[options.valuefield] + '';
        data.text = data[options.textfield] + '';
        var model = data;
        model.elm = $('<li class="k-item">' + data[options.textfield] + '</li>')
            .click(function () {
                onSelect(options, model);
                options.IsFirstTime = false;
            })
            .mouseover(function (e) { mouseOver(options, model, e); })
            .data('model', model);

        options.ItemContainer.append(model.elm);
    };
    function create(options, isFirst) {
        isFirst && options.ItemContainer.empty();
        options.page.PageNumber = options.page.PageNumber || 1;
        var len = Math.min((options.page.PageNumber).mlt(options.page.PageSize), options.CurrentList.length);//options.CurrentList.length < 100 ? options.CurrentList.length : 100;
        for (var i = (options.page.PageNumber - 1).mlt(options.page.PageSize) ; i < len; i++) {
            var data = options.CurrentList[i];
            data.DataIndex = i;
            createItem(options, data);
        }
    };
    function setEmptyValue(options) {
        options.Container.find('.k-input').val('');
        options.Selected && options.Selected.elm.removeClass('selected');
        options.value = null;
        options.elm.val('');
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
                    options.filter.value = 'a';
                    search(options, '');
                }
            });
            options.page.filter.pop();
        } else {
            setEmptyValue(options);
        }
    };
    function onOpen(options) {
        currentModel = options;
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
    };
    function onSelect(options, item) {
        !item.elm && createItem(options, item);
        options.Container.find('.k-input').val(item[options.textfield]);
        item.elm.addClass('selected');
        options.Selected = options.Selected || { elm: { removeClass: function () { } } };
        options.Selected.elm.removeClass('selected');
        var selected = options.Selected;
        options.Selected = item;
        options.Focused = item;
        options.CurrentList = [item];
        options.value = item[options.valuefield];
        options.ItemTemplate.hide();
        options.elm.val(options.value);
        selected[options.valuefield] != item[options.valuefield] && options.change && options.change.call(options, options.Selected, selected);
        closeItem(options);
        create(options, true);
    };
    function search(options, text) {
        if (options.filter.value == text)
            return;
        if (!options.IsOpened)
            onOpen(options);

        options.IsLoading && options.Caller && options.Caller.abort();
        options.filter.value = text;
        var newFilter = [];
        //console.log(options.page);
        options.page.filter.each(function () {
            if (this.field != options.filter.field) {
                newFilter.push(this);
            }
        });
        options.page.filter = newFilter;
        //options.page.filter
        if (text) {
            options.page.filter.push(options.filter);
        }
        //options.elm.val('');
        options.IsSearching = true;
        self.Load(options, true, function () { options.IsSearching = false; });
    };
    function onSearch(options, text, e) {
        if (e.keyCode == 13 || e.which == 13 || (e.keyCode > 36 && e.keyCode < 41) || (e.which > 36 && e.which < 41)) {
            return;
        }
        options.IsFirstTime = false;
        if (options.SearchEvent) {
            clearTimeout(options.SearchEvent);
        }
        options.SearchEvent = setTimeout(function () { search(options, text.trim()) }, 250);
    };
    function checkValue(options, text) {
        text = text.trim();
        if (!(options.Selected && options.Selected[options.textfield] == text) && options.data) {
            var data = options.data.filter(function (item) {
                return item[options.textfield].trim() === text;
            });

            if (data.length) {
                onSelect(options, data[0]);
            } else {
                options.Container.find('.k-input').val('');
                options.Selected && options.Selected.elm.removeClass('selected');
                options.value = null;
                options.elm.val('');
                if (options.Selected) {
                    options.Selected = none;
                    options.change && options.change.call(options, options.Selected, null);
                }
                search(options);
            }
        }
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
    function extraSearch(options) {
        //options.SearchField = [{ field: 'Phone', title: 'Phone', }];
        //options.SearchField && options.SearchField.each(function () {
        //    this.title = this.title || this.field;
        //    var elm = $('<ul class="k-list k-reset"><li class="k-item"><input class="form-control" style="max-width: 100%; padding: 0px 10px; width: calc(100% - 22px); height: 28px;" type="text" placeholder="' + (this.title) + '"></li></ul>');
        //    options.ItemContainer.before(elm);
        //});
    };

    function setButtons(options) {
        console.log(['options', options, options.add , options.grid]);
        if (options.add || options.grid) {
            var container = $('<div class="button_container row" style="padding: 5px 10px; border-top: 1px solid silver;"></div>');
            options.ItemTemplate.find('.dropdown_item_container').append(container);
            if (typeof (options.create) === 'function') {
                var elm = $('<a style="margin-bottom: 0px;padding: 3px 10px;border-radius: 3px;border-width: 1px;border-style: solid;" class="pull-right btn-round btn-default"><span class="glyphicon glyphicon-plus"></span> New</a>');
                container.append(elm);
                Global.Click(elm, function () {
                    closeItem(options);
                    options.create({
                        onSaveSuccess: function (response, model, formModel, formInputs) {
                            onSetValue(options, response.Id);
                        }});
                });
            }
            if (options.grid) {
                var elm = $('<a style="margin-bottom: 0px;padding: 3px 10px;border-radius: 3px;border-width: 1px;border-style: solid;" class="pull-left btn-round btn-default"><span class="glyphicon glyphicon-list"></span> List</a>');
                container.append(elm);
                self.List.Bind(options, elm);
            }
        }
    };

    function setTemplate(options) {
        options.width = options.width || options.elm.width();
        options.ItemTemplate = $('<div class="dropdown_item_template">').click(function (evt) { evt.stopPropagation(); });
        options.ItemTemplate.append('<div class="dropdown_item_container"><div class="k-list-scroller"><ul class="k-list k-reset"></ul></div></div>').css({ width: (options.width - 4) + 'px' });
        options.ItemContainer = options.ItemTemplate.find('ul');
        $(document.body).append(options.ItemTemplate);
        extraSearch(options);
        setButtons(options);
        var container = $('<span class="k-widget k-dropdown k-header" title="" style="width: 100%"><span class="k-dropdown-wrap k-state-default"><input class="form-control k-input" style="max-height: 27px; width: 100%; padding: 0; color: inherit;" />' +
        '<span class="k-select"><span class="k-icon k-i-arrow-s">select</span></span></span></span>').click(function (evt) { evt.stopPropagation(); });
        options.elm.after(container).hide().data('dropdown', options);
        container.find('.k-dropdown-wrap').click(function () { onOpen(options); return false; });
        options.Inputs = container.find('.k-input').keyup(function (e) { onSearch(options, this.value, e); options.onkeyup && options.onkeyup(e); })
            .blur(function () { var elm = this; setTimeout(function () { checkValue(options, elm.value); }, 150); }).focus(function () {
                onOpen(options);
            });
        Global.Click(container.find('.k-select'), onSort, options);
        options.Container = container;
        self.Models.push(options);
        that.Service.LoadMore.Bind(options);
    };
    function closeItem(options) {
        options.IsOpened = false;
        options.ItemTemplate.hide();
        options.Container.removeClass('opened');
        console.log(['closeItem', options]);
    };
    function closeAll(isOutSide) {
        self.Models.each(function () {
            this.IsOpened && checkValue(this, this.Container.find('.k-input').val());
            this.IsOpened = false;
            this.ItemTemplate.hide();
            this.Container.removeClass('opened');
        });
        if (!isOutSide) {
            Global.DropDown && Global.DropDown.CloseAll && Global.DropDown.CloseAll('AutoComplete');
            Global.MultiSelect && Global.MultiSelect.CloseAll && Global.MultiSelect.CloseAll('AutoComplete');
        }
    };
    (function (that) {
        function reloadClientSIde(options) {
            window.filterModelClientSIde = {};
            var newArray = [], exp = 'item';
            options.page.filter = options.page.filter || [];
            if (options.page.filter.length > 0) {
                options.page.filter.each(function () { filterModelClientSIde[this.field] = new RegExp(this.value, "i"); exp += ' && item.' + this.field + '.Contains(filterModelClientSIde.' + this.field + ')' });
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
                    options.Focused = none;
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
                options.onpost = options.onpost || options.onrequest;
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
                        options.Focused = none;
                    }
                    if (options.data.length < options.page.PageSize) {
                        options.AllLoaded = true;
                    }
                    options.CurrentList = options.CurrentList.concat(options.data);
                    create(options, isFirst);
                    options.IsFirstTime && options.elm.val() && options.val(options.elm.val());
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
        function getView() {
            return '<div class="">'+
    '<div class="formHeader empty_style row headerFormMenu">'+
        '<div class="col-xs-10 empty_style"><h4 data-binding="title" class="widget-title auto_bind" style="margin: 5px;"> Item Selector </h4></div>'+
        '<div class="col-xs-2 empty_style" style="padding: 0px; margin: 0px;">'+
            '<span class="pull-right button_container">'+
                '<a class="button btn_cancel"><span style="left:-2px;" class="glyphicon glyphicon-remove"></span></a>'+
            '</span>'+
        '</div>'+
    '</div>'+
    '<div class="middleForm empty_style">'+
        '<div role="form" class="form-horizontal smart-form middleForm">'+
            '<div class="item_selector_grid"></div>'+
            '<div class="row">'+
                '<div class="text-center formFooter FooterFormMenu">'+
                    '<button class="btn btn_save btn-white btn-default btn-round" type="button"><span class="glyphicon glyphicon-plus"></span> Add Items </button>'+
                    '<button class="btn btn_cancel btn-white btn-default btn-round" type="button" style="margin-left: 10px;">'+
                        '<span class="glyphicon glyphicon-remove"></span> Cancel'+
                    '</button>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';
        };
        function getAction(option) {
            if (option.actions) {
                return Global.Copy({
                    title: {
                        items: option.pagger && option.pagger.items || IqraConfig.Grid.Pagger.PageSize,
                        selected: option.page && option.page.PageSize || IqraConfig.Grid.Pagger.Selected,
                        showingInfo: option.page && option.page.showingInfo || (option.pagger && option.pagger.showingInfo) || 'Showing {0} to {1}  of {2}  items'
                    },
                    items: option.actions,
                    className: 'action'
                }, option.action || {});
            }
        };
        function setGrid(options,windowModel, grid) {
            function onSelect(model) {
                var field = options.grid.valuefield || options.valuefield;

                if (grid.selected === model) {
                    console.log(['grid.selected && grid.selected[field] === model[field]', grid.selected, grid.selected[field], model[field]]);
                    return;
                }else if (grid.selected) {
                    grid.selected.elm.removeClass('i-state-selected');
                } 
                grid.selected = model;
                grid.selected.elm = $(this);
                grid.selected.elm.addClass('i-state-selected');
                
            };
            function rowBound(elm) {
                Global.Click(elm, onSelect, this);
                var model = this;
                elm.dblclick(function () {
                    var field = options.grid.valuefield || options.valuefield;
                    if (model[field]) {
                        windowModel.Hide();
                        onSetValue(options, model[field]);
                    }
                });
            };

            //console.log(['options.grid.columns()', options.grid.columns()]);

            Global.Grid.Bind(Global.Copy(Global.Copy({
                elm: windowModel.View.find('.item_selector_grid'),
                url: options.grid.url,
                page: { 'PageNumber': 1, 'PageSize': 10, filter: options.grid.filter || [] },
                pagger: { showingInfo: '{0}-{1} of {2} Items' },
                //oncomplete: function (model) {
                //    /*gridModel = model;*/
                //},
                Action: getAction(options.grid),
                Printable: false
            }, options.grid, true), {
                elm: windowModel.View.find('.item_selector_grid'),
                rowBound: rowBound,
                //columns: options.grid.columns(),
                oncomplete: function (model) {
                    grid.gridModel = model;
                    options.grid.oncomplete && options.grid.oncomplete(model);
                }
            }, true));
        };
        this.Bind = function (options, elm,none) {
            var windowModel, grid = {}, callerOptions;
            setNonCapitalisation(options.grid);
            Global.Click(elm, function () {
                closeItem(options);
                grid.selected = none;
                //dataSource = [];
                if (windowModel) {
                    windowModel.Show();
                    grid.gridModel && grid.gridModel.Reload();
                } else {
                    windowModel = Global.Window.Bind(getView, { width: '90%' });
                    windowModel.View.find('.btn_cancel').click(function () {
                        windowModel && windowModel.Hide();
                    });
                    Global.Click(windowModel.View.find('.btn_save'), function () {
                        if (grid.selected) {
                            var field = options.grid.valuefield || options.valuefield;
                            if (grid.selected[field]) {
                                windowModel.Hide();
                                onSetValue(options, grid.selected[field]);
                            }
                        } else {
                            alert('No item selected.');
                        }
                    });
                    windowModel.Show();
                    setGrid(options, windowModel, grid);

                }
            });
        };
    }).call(self.List = {});
    (function () {
        function setDefaultValue(options) {

            options.IsDropDownBind = true;
            options.textfield = options.textfield || IqraConfig.AutoComplete.TextField||'Name';
            options.valuefield = options.valuefield || IqraConfig.AutoComplete.ValuField||'Id';
            options.operation = options.operation || IqraConfig.AutoComplete.Operation;

            options.page = options.page || Global.Copy({}, IqraConfig.AutoComplete.Page);
            options.page.filter = options.page.filter || [];
            options.filter = options.filter || { field: options.textfield || IqraConfig.AutoComplete.TextField, operation: options.operation || IqraConfig.AutoComplete.Operation }

        };
        this.Bind = function (options) {
            //console.log([options]);
            if (options.elm.data('dropdown')) {
                var model = options.elm.data('dropdown');
                for (var key in options) { options[key.toLowerCase()] = options[key.toLowerCase()] || options[key]; }
                model.url = options.url;
                self.Load(model, true, function () { options.IsSearching = false; });
            } else {
                for (var key in options) { options[key.toLowerCase()] = options[key.toLowerCase()] || options[key]; }
                setDefaultValue(options);
                setTemplate(options);
                options.val = function (value) {
                    if (arguments.length < 1)
                        return options.value;
                    else if (value && value[options.valuefield]) {
                        onSetValue(options, value[options.valuefield]);
                    } else {
                        onSetValue(options, value);
                    }
                    options.IsFirstTime = true;
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
                options.Reload = function () {
                    self.Load(options, true, function () { options.IsSearching = false; });
                };
                options.Close = function () {
                    closeItem(options);
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
                options.IsFirstTime = true;
                self.Load(options, true, function () {
                    options.IsSearching = false;

                });
                options.oncomplete && options.oncomplete(options);
                //console.log([options]);
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
        var actions, actionInterval;
        function set(options) {
            if (options.CurrentList.length < 1)
                return;
            if (options.Focused) {
                options.Focused.elm.removeClass('selected');
                options.Focused.elm.click();
            }
        };
        function setScroll(options) {
            var top = options.Focused.elm.offset().top - options.ItemTemplate.offset().top;
                min = options.ItemTemplate.find('.k-list-scroller').scrollTop(),
                height = options.ItemTemplate.height();
                
            if (top < 0) {
                options.ItemTemplate.find('.k-list-scroller').scrollTop(min + top);
                return;
            } else if ((top = top + options.Focused.elm.height()) < height) {
                return;
            }
            top += min;
            options.ItemTemplate.find('.k-list-scroller').scrollTop(top - height);
        };
        function setFocused(options, dataIndex) {
            options.Focused = options.CurrentList[dataIndex];
            options.Focused.elm.addClass('selected');
            if (options.ItemTemplate.height() < options.ItemContainer.height()) {
                setScroll(options);
            }
            
        };
        function up(options) {
            if (options.CurrentList.length < 1)
                return;
            var dataIndex = 0;
            if (options.Focused) {
                dataIndex = options.Focused.DataIndex - 1;
                if (dataIndex < 0) {
                    dataIndex = 0;
                }
                if (dataIndex == options.Focused.DataIndex) {
                    return;
                }
                options.Focused.elm.removeClass('selected');
            }
            setFocused(options, dataIndex);
        };
        function down(options) {
            if (options.CurrentList.length < 1)
                return;
            var dataIndex = 0;
            if (options.Focused) {
                dataIndex = options.Focused.DataIndex + 1;
                if (dataIndex >= options.CurrentList.length) {
                    dataIndex = options.CurrentList.length - 1;
                }
                if (dataIndex == options.Focused.DataIndex) {
                    return;
                }
                options.Focused.elm.removeClass('selected');
            }
            setFocused(options, dataIndex);
        };
        function setActions(currentModel) {
            if (actions) {
                actions(currentModel);
            }
        };
        $(document).click(function () {
            //console.log(456);
            closeAll();
        });
        $(document).keyup(function (e) {
            if (currentModel && currentModel.IsOpened) {
                if (e.keyCode == 13 || e.which == 13) {
                    set(currentModel);
                }
                actions = none;
            }
        });
        $(document).keydown(function (e) {
            if (currentModel && currentModel.IsOpened) {
                if (e.keyCode == 38 || e.which == 38) {
                    actions = up;
                    setActions(currentModel);
                } else if (e.keyCode == 40 || e.which == 40) {
                    actions = down;
                    setActions(currentModel);
                }
            }
        });
    }).call(self.Events = {});
})(Global.AutoComplete, function () { });



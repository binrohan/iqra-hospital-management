
(function (nope) {
    LazyLoading.LoadCss([IqraConfig.Url.Css.Grid]);
    var label1 = this, ctx;
    (function () {
        var c = document.createElement("canvas");
        ctx = c.getContext("2d");
        ctx.font = "14px Arial";
    })();
    function busy(model) {
        if (!model.busyLayer) {
            model.busyLayer = $('<div style="position: absolute; width: 100%; height: 100%; top: 0px; z-index: 5;"><div style="width: 100%; height: 100%; position: absolute; z-index: 1; opacity: 0.4; background-color: rgb(255, 255, 255);"></div><div style="width: 100%; height: 100%; position: absolute; z-index: 2; background-image: url(\'' + Global.BaseUrl + IqraConfig.Url.Img.Grid.Loading + '\'); background-repeat: no-repeat; background-position: center center;"></div></div>');
            model.views.container.prepend(model.busyLayer);
        }
        model.busyLayer.show();
    };
    function free(model) {
        model.busyLayer && model.busyLayer.hide();
    };
    function getTextWidth(text) {
        return ctx.measureText(text).width;
    };
    function setDefaultColumn(model) {
        var containerWidth = model.elm.width(), maxWidth = 0, columnWidth = 0, width = 0,
            actionColumnWidth = model.action ? 1 : 0, widthList = [], index = 0, activeColumns = [], hideColumns = [],
            resModel = { widthList: widthList, ActiveColumns: activeColumns, HideColumns: hideColumns, containerWidth: containerWidth };
        model.columns.each(function (i) {
            activeColumns.push(this);
        });
        model.RSModel = resModel;
        if (activeColumns.length != model.columns.length) {
            resModel.IsHide = true;
            return '<col style="width: 20px;">';
        }
        return '';
    };
    function setHideColumn(model) {
        var containerWidth = model.elm.width(), maxWidth = 0, columnWidth = 0, width = 0,
            actionColumnWidth = model.action ? 1 : 0, widthList = [], index = 0, activeColumns = [], hideColumns = [],
            resModel = { widthList: widthList, ActiveColumns: activeColumns, HideColumns: hideColumns, containerWidth: containerWidth };
        model.columns.each(function (i) {
            //width += Math.max(this.width || 0, getTextWidth(this.title || this.field), columnWidth) + 10;
            width += this.filter ? 20 : 0;
            width += this.sorting !== false ? 15 : 0;;
            columnWidth = actionColumnWidth * containerWidth / (i + 1);
            var tableWidth = 0;
            if (this.width) {
                width += this.width;
                tableWidth = width;
                //tableWidth = maxWidth * index + columnWidth + width;
            } else {
                index++;
                //maxWidth = Math.max(getTextWidth(this.title || this.field), maxWidth) + 10;//10 for padding
                //tableWidth = maxWidth * index + columnWidth + width;
                width += getTextWidth(this.title || this.field);
                tableWidth = width;
            }

            widthList.push({ width: width, column: this, tableWidth: tableWidth, maxWidth: maxWidth, columnWidth: columnWidth, width: width });
            if (i == 0 || tableWidth <= containerWidth) {
                activeColumns.push(this);
            } else {
                hideColumns.push(this);
            }
        });
        model.RSModel = resModel;
        console.log(model);
        if (activeColumns.length != model.columns.length) {
            resModel.IsHide = true;
            return '<col style="width: 20px;">';
        }
        return '';
    };
    function getColGroup(model) {
        if (model.ColGroupTemplate) return model.ColGroupTemplate;
        model.ColGroupTemplate = '<colgroup>';
        model.ColGroupTemplate += (model.Responsive || (IqraConfig.Grid.Responsive && model.Responsive !== false)) ? setHideColumn(model) : setDefaultColumn(model);
        model.RSModel.ActiveColumns.each(function () {
            var width = this.width ? ' style="width: ' + this.width + 'px;"' : '';
            var cls = this.className ? ' class="' + this.className + '"' : '';
            model.ColGroupTemplate += '<col' + width + cls + '>';
        });
        if (model.action) {
            var width = model.action.width ? ' style="width: ' + model.action.width + 'px;"' : '';
            var cls = model.action.className ? ' class="' + model.action.className + '"' : '';
            model.ColGroupTemplate += '<col' + width + cls + '>';
        }
        model.ColGroupTemplate += '</colgroup>';
        return model.ColGroupTemplate;
    };
    var report = new function () {
        var form;
        function submitReport(model, reportUrl) {
            if (model.response) {
                var Header = '', objList = [];
                if (!form) {
                    form = $('<form action="/Health/Report/ExportToCSV" method="post"></form>');
                    $(document.body).append(form);
                }

                form.html('<input type="hidden" class="column_header" name="columnHeader"/>');
                form.attr('action', reportUrl);
                var colomns = model.exportColumns || model.columns;
                colomns.each(function () {
                    Header += this.title + ',';
                });
                model.response.Data.Data.each(function (i) {
                    var data = this, column = '';
                    colomns.each(function () {
                        var text = data[this.field];
                        column += (typeof text != 'undefined' && text != null ? text : '') + ',';
                    });
                    form.append('<input type="hidden" name="columns[' + i + ']" value="' + column + '"/>');
                });
                form.find('.column_header').val(Header);
                form.submit();
            }
        };
        function exportToCSV() {
            var model = $(this).parent().data('model');
            //console.log(model.response.Data.Data);
            submitReport(model, '/Report/ExportToCSV', ',');
        };
        function exportToXl() {
            var model = $(this).parent().data('model');
            //console.log(model.response.Data.Data);
            submitReport(model, '/Health/Report/ExportToXl');
        };
        this.Bind = function (model) {
            //console.log(model.reportContainer);
            if (model.reportContainer) {
                model.reportContainer.data('model', model);
                model.reportContainer.append($('<a class="btn btn-white btn-default btn_export btn-round pull-right"><span class="glyphicon glyphicon-export"></span>Export To CSv</a>').click(exportToCSV));
                //model.reportContainer.append($('<a id="btn_Add_new" class="btn btn-white btn-default btn-round pull-right" style="margin-right: 5px;"><i class="ace-icon fa fa-save blue"></i>Export To Excel</a>').click(exportToXl));
            }
        };
    };
    var printService = new function () {
        function getRow(text) {
            return '<td style="border: 1px solid silver; padding: 5px;">' + text + '</td>';
        };
        function getTh(text) {
            return '<th style="border: 1px solid silver; padding: 5px;">' + text + '</th>';
        };
        function printData(model, mywindow) {
            model.response = model.response || {};
            model.response.Data = model.response.Data || {};
            var dataSource = model.response.Data.Data || [];
            dataSource.each(function () {
                var tr = '<tr>', data = this;
                model.columns.each(function () {
                    var text = data[this.field];
                    if (this.dateFormat && /^\/Date\(\-?\d+\)\/$/.test(text)) {
                        text = text.getDate().format(this.dateFormat);
                    }
                    text = typeof text != 'undefined' && text != null ? text : '';
                    tr += getRow(text);
                });
                tr += '</tr>';
                mywindow.document.write(tr);
            });
        }
        function printHeader(model, mywindow) {
            var tr = '<tr>';
            model.columns.each(function () {
                tr += getTh(this.title);
            });
            tr += '</tr>';
            mywindow.document.write(tr);
        };
        function PrintElem(model) {
            model.name = model.name || document.title;
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<html><head><title>' + model.name + '</title>');
            mywindow.document.write('</head><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style><body style="padding: 20px;">');
            mywindow.document.write('<h1>' + model.name + '</h1>');
            mywindow.document.write('<table style="border-collapse: collapse;">');
            printHeader(model, mywindow);
            printData(model, mywindow);
            mywindow.document.write('</table></body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
            mywindow.print();
            //mywindow.close();
            return true;
        }
        function setPrintButton(model) {
            model.Printable = typeof (model.Printable) === typeof (none) ? IqraConfig.Grid.Printable : model.Printable;
            model.Printable.html = model.Printable.html || IqraConfig.Grid.Printable.html || '<a href="#" class="btn btn-white btn-default btn-round pull-right btn_add_print"><span class="glyphicon glyphicon-print"></span> Print </a>';
            if (model.Printable) {
                var container = model.Printable.Container, btn = model.Printable.html;
                //console.log([typeof (container),typeof (nope),typeof (nope)===typeof (container)]);
                if (!container) {
                    var elm = $('<div class="empty_style button_container row">' + btn + '</div>');
                    model.elm.prepend(elm);
                    elm.find('.btn_add_print').click(model.Print);
                    return;
                } else if (typeof (container) === typeof ('')) {
                    container = $(container);

                } else if (typeof (container) === typeof (nope)) {
                    container = container(model);
                }
                var elm = $(btn);
                container.append(elm);
                elm.click(model.Print);
            }
        };
        this.Bind = function (model) {
            model.Print = function () {
                PrintElem(model);
            };
            setPrintButton(model);
        };
    };
    var columns = new function () {
        function getColumn(model) {
            var data = { title: model.title || model.field || '', className: model.className || '' };
            for (var key in model) { data[key] = model[key]; }
            return data;
        };
        this.Get = function (model) {
            var columns = [];
            model.columns.each(function () {
                columns.push(getColumn(this));
            });
            return columns;
        };
    };
    var pageSize = new function () {
        var label2 = this;
        function onChange() {
            var model = $(this).data('model');
            model.page.PageNumber = 1;
            model.page.PageSize = parseInt($(this).val());
            if (model.pagger && model.pagger.onChange) {
                model.pagger.onChange(model.page);
                return;
            }
            gridBody.Reload(model);
        }
        this.Create = function (model, items, selected, container, showingInfo) {
            selected = selected || items[parseInt(items.length / 2)];
            model.page = model.page || { PageNumber: 1, PageSize: selected, SortBy: '' };
            model.page.baseUrl = model.page.baseUrl || (model.action && model.action.title && model.action.title.baseUrl) || (model.pagger && model.pagger.baseUrl) || '/';
            model.page.showingInfo = showingInfo || 'Showing {0} to {1}  of {2}  items';
            var slt = $('<select class="form-control input-sm" style="height: auto; display: inline;">').change(onChange).data('model', model);
            console.log(items);
            items.each(function (i) {
                if (this == model.page.PageSize) {
                    slt.append('<option selected="selected">' + this + '</option>');
                } else {
                    slt.append('<option>' + this + '</option>');
                }
            });
            container.append(slt);
            model.PageSize = { view: slt }
        };
    };
    var header = new function () {
        var label2 = this, sortElm, changeType = { Type: 4 };
        var filter = new function () {
            function getFilterModel(fieldModel, value) {
                value = value.trim();
                switch (fieldModel.Operation) {
                    case "GreaterThan":
                    case "GreaterThanOrEqual":
                    case "LessThan":
                    case "LessThanOrEqual":
                        value = parseInt(value);
                        break;
                }
                return { field: fieldModel.actionfield || fieldModel.field, value: value, Operation: fieldModel.Operation };
            };
            function setPageModel(model, fieldModel, value) {
                model.page = model.page || {};
                model.page.filter = model.page.filter || [];
                var filters = [], field = fieldModel.actionfield || fieldModel.field;
                for (var i = 0; i < model.page.filter.length; i++) {
                    if (model.page.filter[i].field != field) {
                        filters.push(model.page.filter[i]);
                    }
                }
                var filterModel = getFilterModel(fieldModel, value);
                (value || value == '0') && filters.push(filterModel) && fieldModel.type &&
                (filterModel.Type = fieldModel.type, filterModel.StartDate = fieldModel.StartDate, filterModel.EndDate = fieldModel.EndDate);
                model.page.filter = filters;
            };
            function checkForCustorField(model, fieldModel, value) {
                console.log(['checkForCustorField', model, fieldModel, value]);
                if (typeof fieldModel.filter == 'function') {
                    var data = fieldModel.filter(value);
                    data && data.each(function () {
                        setPageModel(model, this, this.value);
                    });
                } else {
                    setPageModel(model, fieldModel, value);
                }
            };
            function submit(model, fieldModel, checker) {
                if (!model.onValidate || model.onValidate()) {
                    var value = this.parent().find('input').val();
                    console.log(['submit', checker, model, fieldModel, value]);
                    (checker && (checker(model, fieldModel, value, setPageModel), 1)) || checkForCustorField(model, fieldModel, value);
                    model.page.PageNumber = 1;
                    model.changing && model.changing({ Type: 5 }, model.page);
                    gridBody.Reload(model);
                    model.views.container.click();
                }
                return false;
            };
            function onKeyUp(e, model, fieldModel) {
                if (e.key == 'Enter' || e.keyCode == 13 || e.which == 13) {
                    e.preventDefault();
                    submit.call(this.parent().find('.btn_submit'), model, fieldModel);
                    return false;
                }
            };
            function onBlur(model, fieldModel) {
                checkForCustorField(model, fieldModel, this.val());
                return false;
            };
            function createDropdown(elm, model, fieldModel) {
                fieldModel.Operation = fieldModel.Operation || 0;
                for (var key in fieldModel.filter.DropDown) { fieldModel.filter.DropDown[key.toLowerCase()] = fieldModel.filter.DropDown[key]; }
                var view = $('<div class="search_container datepicker-dropdown dropdown-menu datepicker-orient-right datepicker-orient-bottom"><div class="datepicker-days" style="height: 32px;"><input type="text"></div></div>');
                elm.find('div').append(view).css('position', 'relative');
                elm.data('view', view);
                view.show().click(function (e) { e.stopPropagation() });
                Global.DropDown.Bind({
                    dataSource: fieldModel.filter.DropDown.datasource,
                    url: fieldModel.filter.DropDown.url,
                    elm: view.find('input'),
                    change: function (data) {
                        view.find('input').val(data[this.valuefield]);
                        submit.call(view.find('input'), model, fieldModel, fieldModel.onchange);
                    }
                });
                $(document).click(function () { (!view.find('input').val()) && view.hide(); });
            };
            function createView(model, fieldModel) {
                if (fieldModel.filter && fieldModel.filter.DropDown) {
                    createDropdown(this, model, fieldModel);
                    return;
                }
                var view = $('<div class="search_container datepicker datepicker-dropdown dropdown-menu datepicker-orient-right datepicker-orient-bottom"><div class="datepicker-days"><input type="text"><span class="btn_submit no_padding"><span class="search_icon" style="height: 20px; margin-top: 6px;"></span></span></div></div>');
                this.find('div').append(view).css('position', 'relative');
                this.data('view', view);
                view.show().click(function (e) { e.stopPropagation() }).find('input')
                    .keydown(function (e) {
                        if (e.key == 'Enter' || e.keyCode == 13 || e.which == 13) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    })
                    .keyup(function (e) { e.stopPropagation(); onKeyUp.call($(this), e, model, fieldModel); })
                    .blur(function (e) { onBlur.call($(this), model, fieldModel) }).focus()
                    .next().click(function () { submit.call($(this), model, fieldModel) });
                $(document).click(function () { (!view.find('input').val()) && view.hide(); });
            };
            function show(e) {
                e.stopPropagation();
                var elm = $(this).closest('th'), fieldModel = elm.data('model'), model = elm.parent().data('model');
                //console.log(fieldModel);
                var view = elm.data('view');
                view ? view.show().find('input').focus() : createView.call(elm, model, fieldModel);
                return false;
            };
            this.Bind = function () {
                this.find('.icon_container').append($('<span class="search_icon"></span>').click(show)).addClass('filter_icon_container');
            };
        };
        function sort() {
            var elm = $(this),
                    fieldModel = elm.data('model'),
                    model = elm.parent().data('model'),
                    field = fieldModel.actionfield || fieldModel.sortField || fieldModel.field;

            if (!model.onValidate || model.onValidate()) {
                model.page = model.page || {};
                if (model.page.SortBy != field) {
                    sortElm && sortElm.removeClass('desending asending');
                    elm.addClass('asending');
                    model.page.IsDescending = false;
                    model.page.SortBy = field;
                    sortElm = elm;
                } else if (model.page.SortBy == field && !model.page.IsDescending) {
                    elm.removeClass('asending').addClass('desending');
                    model.page.IsDescending = true;
                    sortElm = elm;
                } else {
                    sortElm = elm;
                    elm.removeClass('desending asending');
                    model.page.SortBy = '';
                    model.page.IsDescending = false;
                }
                model.page.PageNumber = 1;
                model.changing && model.changing(changeType, model.page);
                gridBody.Reload(model);
            }
            return false;
        };
        function setActionField(model, tr) {
            var cls = model.action.className ? ' ' + model.action.className : '';
            var th = $('<th class="i-header ' + cls + '" colspan="1" rowspan="1" ></th>');
            if (typeof model.action.title == 'object' && model.pagging) {
                pageSize.Create(model, model.action.title.items, model.action.title.selected, th, (model.action.title.showingInfo || model.pagger.showingInfo));
            } else {
                th.append(model.action.title);
            }
            return th;
        };
        this.GetTemplate = function (model, tr) {
            model.columns = columns.Get(model);
            model.RSModel.IsHide && tr.append('<th rowspan="1" scope="col" class="i-header table_header"></th>');
            model.RSModel.ActiveColumns.each(function () {
                var th;
                if (this.sorting === false) {
                    th = $('<th rowspan="1" scope="col" class="i-header table_header sorting ' + this.className + '"><div>' + this.title + '<span class="icon_container"></span></div></th>').data('model', this);
                } else {
                    th = $('<th rowspan="1" scope="col" class="i-header table_header sorting ' + this.className + '"><div><a>' + this.title + '</a><span class="icon_container"></span></div></th>').click(sort).data('model', this);
                }
                tr.append(th);
                this.filter && filter.Bind.call(th);
            });
            tr.data('model', model);
            model.action && tr.append(setActionField(model, tr));
            model.header = { view: tr };
        };
        this.Set = function (model, widget) {
            var template = $('<div class="i-grid-header" style="padding-right: 17px;"><div class="i-grid-header-wrap"><table>'
                + getColGroup(model) + '<thead><tr></tr></thead></table></div></div>');
            label2.GetTemplate(model, template.find('tr'));
            widget.append(template);
        };
    };
    var gridBody = new function () {
        var label2 = this;
        function getUrl(model) {
            if (typeof model.url == 'function') {
                return model.url();
            }
            return model.url;
        };
        function toggle(model) {
            if (!model.Template) {
                model.Template = $('<tr  role="row"><td colspan="' + model.tr.find('td').length + '" style="padding: 5px 5px 5px 20px;"></td></tr>'),
                data = model.data;
                model.tr.after(model.Template);
                var tr = model.Template.find('td');
                model.model.RSModel.HideColumns.each(function () {
                    var text = data[this.field];
                    if (this.dateFormat && /^\/Date\(\-?\d+\)\/$/.test(text)) {
                        text = data[this.field] = text.getDate().format(this.dateFormat);
                    }
                    text = typeof text != 'undefined' && text != null ? text : '';

                    var cls = this.className ? 'class="' + this.className + '"' : '', td;
                    if (typeof this.click == 'function') {
                        td = $('<div ' + cls + '><label> ' + (this.title || this.field) + '</label> : </div>').append(setAutoBindText(data, this, Global.Click($('<a>' + text + '</a>'), this.click, data)));
                    } else {
                        td = $('<div ' + cls + '><label> ' + (this.title || this.field) + '</label> : </div>').append(setAutoBindText(data, this, $('<span>' + text + '</span>')));
                    }
                    tr.append(td);
                });
                (typeof model.model.rowBound == 'function') && model.model.rowBound.call(this, tr);
            } else {
                model.Template.toggle();
            }
        }
        function setCollpasableIcon(model, data, tr) {
            var elm = $('<td class="btn_colupse" style="padding: 0px 0px 0px 3px;"><span class="icon_container"><span class="glyphicon glyphicon-plus"></span></span></td>'),
                obj = { model: model, data: data, elm: elm, tr: tr };
            Global.Click(elm.find('.icon_container'), toggle, obj);
            return elm;

        };
        function setActionField(model, tr, data) {
            var td = $('<td class="' + (model.action.className || '') + '" >');
            model.action.items.each(function () {
                var btn = this.html ? $(this.html) : $('<input type="button" value="' + (this.text || '') + '">');
                Global.Click(btn, this.click, data);
                td.append(btn);
            });
            return td;
        }
        function autoBindText(model, column, func) {
            if (column.isautobind != false) {
                var data = model[column.field];
                Object.defineProperty(model, column.field, {
                    get: function () {
                        return data;
                    },
                    set: function (val) {
                        data = val;
                        func(val);
                    },
                    configurable: true
                });
            }
        };
        function setAutoBindText(model, column, elm) {
            column.autobind != false && autoBindText(model, column, function (val) {
                elm.html(val);
            });
            return elm;
        };
        function getColumnElm(model, column, text) {
            var cls = column.className ? 'class="' + column.className + '"' : '';
            if (typeof column.click == 'function') {
                return $('<td ' + cls + '></td>').append(setAutoBindText(model, column, Global.Click($('<a>' + text + '</a>'), column.click, model)));
            } else {
                return setAutoBindText(model, column, $('<td ' + cls + '>' + text + '</td>'));
            }
        };
        function createRow(model) {
            var tr = $('<tr  role="row">').data('model', this), data = this;
            model.RSModel.IsHide && tr.append(setCollpasableIcon(model, this, tr));
            model.RSModel.ActiveColumns.each(function () {
                var text = data[this.field];
                if (this.dateFormat && /^\/Date\(\-?\d+\)\/$/.test(text)) {
                    text = data[this.field] = text.getDate().format(this.dateFormat);
                }
                text = typeof text != 'undefined' && text != null ? text : '';
                tr.append(getColumnElm(data, this, text));
            });

            model.action && tr.append(setActionField(model, tr, data));
            (typeof model.rowBound == 'function') && model.rowBound.call(this, tr);
            return tr;
        }
        function createBody(model) {
            model.Body.view.empty();
            model.response.Data.Data.each(function () {
                model.Body.view.append(createRow.call(this, model));
            });
            (model.PageSize || model.pagger) && pagging.SetPagging(model);
        };
        function reloadClientSIde(model, func) {
            window.filterModel = {};
            var newArray = [], exp = 'item';
            model.page = model.page || { PageNumber: 1, PageSize: 9999999 };
            model.page.filter = model.page.filter || [];
            if (model.page.filter.length > 0) {
                model.page.filter.each(function () { filterModel[this.field] = new RegExp(this.value, "i"); exp += ' && item.' + this.field + '.Contains(filterModel.' + this.field + ')' });
                var b = new Function('item', 'return ' + exp);
                model.dataSource.each(function (i) { b(this) && newArray.push(this); });
            } else {
                newArray = model.dataSource;
            }
            model.page.SortBy && (newArray = newArray.orderBy(model.page.SortBy, model.page.IsDescending));
            model.dataBinding(newArray);
            model.response = {
                Data: {
                    Data: newArray.skip((model.page.PageNumber - 1) * model.page.PageSize).take(model.page.PageSize),
                    Total: newArray.length,
                    PageSize: model.page.PageSize,
                    PageNumber: model.page.PageNumber
                }
            };
            createBody(model);
        };
        this.Add = function (item, model) {
            model.Body.view.prepend(createRow.call(item, model));
        };
        this.SaveChange = function (item) {
            if (item.tr && item.tr.find) {
                item.tr.find('td,a').each(function () {
                    this.dataset.field && (this.innerHTML = item[this.dataset.field]);
                });
            }
        };
        this.Reload = function (model, func) {
            if (model.dataSource && typeof model.dataSource == typeof []) {
                reloadClientSIde(model, func);
                model.changed && model.changed({ Type: 0, Category: 1 });
            } else if (model.isActive != false) {
                busy(model);
                var page = {
                    "SortBy": model.page.SortBy,
                    "filter": model.page.filter,
                    "IsDescending": model.page.IsDescending,
                    "PageNumber": model.page.PageNumber,
                    "PageSize": model.page.PageSize
                };
                model.onrequest && model.onrequest(page);
                Global.CallServer(getUrl(model), function (response) {
                    if (!response.IsError) {
                        model.response = response;
                        model.dataBinding(response);
                        createBody(model);
                        model.dataBound(response);
                        typeof func == 'function' && func();
                        model.changed && model.changed({ Type: 0 }, response);
                    } else {
                        typeof model.onError == 'function' && model.onError(response);
                        Global.ShowError(response.Id, { path: model.url, section: 'Grid' });
                    }
                    free(model);
                }, function (response) {
                    alert('Network error had occured.');
                    free(model);
                }, page, 'POST')
            }
        };
    };
    var footer = new function () {
        this.GetTemplate = function (model, widget) {
            if (model.pagging) {
                var template = $('<div class="i-pager-wrap i-grid-pager i-widget"><div class="pagger"></div>' +
                    '<span class="i-pager-sizes i-label"></span><span class="i-pager-info i-label"></span></div>');
                widget.append(template);
                model.footer = {
                    showingInfo: template.find('.i-pager-info'),
                    pagging: template.find('.pagger'),
                    pageSize: template.find('.i-pager-sizes')
                }
                model.footer.pagging.data('model', model);
            }
        };
        this.Set = function (model, widget) {
            if (model.pagging === false) {

            }
            footer.GetTemplate(model, widget);
            if (!model.PageSize && model.footer) {
                model.pagger = Global.Copy({ showingInfo: 'Showing {0} to {1}  of {2}  items', items: IqraConfig.Grid.Pagger.PageSize, selected: IqraConfig.Grid.Pagger.Selected }, model.pagger || {});
                pageSize.Create(model, model.pagger.items, model.pagger.selected, model.footer.pageSize, model.pagger.showingInfo);
            }
        };
    };
    var templates = new function () {
        var label2 = this;
        this.Create = function (model) {
            var template = $('<div class="i-grid i-widget">');
            header.Set(model, template);
            var table = $('<div class="i-grid-content"><table>' + getColGroup(model) + '<tbody></tbody></table></div>');
            template.append(table);
            table = table.find('table');
            model.views = { wrapper: template, table: table, tBody: table.find('tbody'), tHead: template.find('thead'), container: template };
            //console.log(model.views);
            model.Body = { view: model.views.tBody };
            //Need to be fixed
            //div.append(table).append(footer.GetTemplate(model));
            footer.Set(model, template);
            model.elm.append(template);
            report.Bind(model);
        };
    };
    var pagging = new function () {
        var totalItemToShow = 4, changeType = { Type: 3 };
        function setPageButton(model, page, cls, cls1, text) {
            model.footer.pagging.append($('<a class="i-link i-pager-nav' + cls + '" title="' + text + '" href="#"><span class="i-icon i-i-' + cls1 + '">' + text + '</span></a>')
                .click(function () { pagging.Go(model, page); return false; }));
        };
        function setPageNumber(model, page, ul) {
            ul.append($('<li><a class="i-link" href="#">' + page + '</a></li>').click(function () { pagging.Go(model, page); return false; }));
        };
        function setEmptyElm(ul, cls, text) {
            ul.append($('<li><span class="' + cls + '">' + text + '</span></li>'));
        };
        function processingPageElm(model, start, end, total) {
            var paggingContainer = model.footer.pagging, ul = $('<ul class="i-pager-numbers i-reset">');
            paggingContainer.empty()
            if (start > 1) {
                setPageButton(model, 1, ' i-pager-first', 'seek-w', 'Go to the first page');
                setPageButton(model, model.page.PageNumber - 1, '', 'arrow-w', 'Go to the previous page');
                setEmptyElm(ul, '', '...');
            } else if (model.page.PageNumber > 1) {
                setPageButton(model, model.page.PageNumber - 1, '', 'arrow-w', 'Go to the previous page');
            }
            paggingContainer.append(ul);
            for (var i = start; i <= end; i++) {
                if (i == model.page.PageNumber) {
                    setEmptyElm(ul, 'i-state-selected', i);
                } else {
                    setPageNumber(model, i, ul);
                }
            }

            if (end < total) {
                setEmptyElm(ul, '', '...');
                setPageButton(model, model.page.PageNumber + 1, '', 'arrow-e', 'Go to the next page');
                setPageButton(model, total, ' i-pager-last', 'seek-e', 'Go to the last page');

            } else if (model.page.PageNumber < total) {
                setPageButton(model, model.page.PageNumber + 1, '', 'arrow-e', 'Go to the next page');
            }
        };
        function displayShowingDataInformation(model) {
            var start = (model.response.Data.PageNumber - 1) * model.response.Data.PageSize;
            end = start + model.response.Data.Data.length;
            start = start + (end > 0 ? 1 : 0);
            var showingInfo = (model.page.showingInfo && (typeof (model.page.showingInfo) == 'function') ? model.page.showingInfo(start, end, model.response.Data.Total) : model.page.showingInfo) || 'Showing {0} to {1}  of {2}  items';
            model.footer.showingInfo.html(showingInfo.format(start, end, model.response.Data.Total));
        };
        this.Go = function (model, pageNumber) {
            model.changing && model.changing(changeType, model.page.PageNumber, pageNumber);
            model.page.PageNumber = pageNumber;
            gridBody.Reload(model);
            //model.changed && model.changed(changeType);
            return false
        };
        this.SetPagging = function (model) {
            if (model.pagging) {
                model.page.total = model.response.Data.Total;
                var totalPage = Math.ceil(model.page.total / model.page.PageSize), start, end;
                if ((totalItemToShow < totalPage) && (model.page.PageNumber > (totalItemToShow / 2))) {
                    end = Math.ceil(model.page.PageNumber + (totalItemToShow / 2));
                    end > totalPage && (end = totalPage);
                    start = end - totalItemToShow;
                } else {
                    start = 1;
                    end = totalPage > totalItemToShow ? totalItemToShow : totalPage;
                }
                //console.log(model.page);
                processingPageElm(model, start, end, totalPage);
                displayShowingDataInformation(model);
            }
        };
    };
    (function () {
        function setDefaultColumn(columns) {
            columns.each(function () {
                for (var key in this) { this[key.toLowerCase()] = this[key]; }
                this.title = this.title || this.field;
            });
        };
        function setDefaultParameter(model) {
            for (var key in model) { model[key.toLowerCase()] = model[key]; }
            model.columns = model.columns || []
            setDefaultColumn(model.columns);
        };
        this.GetFooterTemplate = function (model) {
            return footer.GetTemplate(model);
        };
        this.SetPagging = function (model) {
            return pagging.SetPagging(model);
        };
        this.Bind = function (options) {
            var model = options;
            setDefaultParameter(model);
            model.pagging = typeof model.pagging == 'undefined' ? true : model.pagging;
            model.dataBinding = model.dataBinding || noop;
            model.dataBound = model.dataBound || noop;
            templates.Create(model);
            gridBody.Reload(model);
            printService.Bind(model);
            model.elm.data('model', model)
            model.Reload = function (func) {
                if (typeof model.page == 'object') {
                    //model.page.PageNumber = 1;
                    //model.page.SortBy = ''
                }
                gridBody.Reload(model, func);
            };
            model.SetData = function (list, func) {
                model.dataSource = list;
                gridBody.Reload(model, func);
            };
            model.Add = function (item) {
                model.dataSource && model.dataSource.push(item);
                gridBody.Add(item, model);
            };
            model.SaveChange = function () {
                if (typeof model.page == 'object') {
                    model.page.PageNumber = 1;
                    model.page.SortBy = ''
                }
                gridBody.Reload(model);
            };
            model.Busy = function () { busy(model); };
            model.Free = function () { free(model); };
            return model;
        };
    }).call(this.Service = {});
}).call(Global.Grid, function () { });
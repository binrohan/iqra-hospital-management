(function (nope, wnd, gbl, none) {
    LazyLoading.LoadCss([IqraConfig.Url.Css.Grid]);
    var label1 = this, ctx, service = {}, funcType = typeof (nope);
    (function () {
        var c = document.createElement("canvas");
        ctx = c.getContext("2d");
        if ($(document).width() > 768) {
            ctx.font = "14px Arial";
        } else {
            ctx.font = "10px Arial";
        }
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
    function getWidthStyle(col) {
        var width = ' style="';
        if (col.width) {
            width += ('width: ' + (typeof col.width == 'string' ? col.width == 'fit' ? col['measuredwidth'] + 'px' : col.width : col.width + 'px') + ';');
        }
        if (col.maxwidth) {
            width += ('max-width: ' + (typeof col.maxwidth == 'string' ? col.maxwidth == 'fit' ? col['measuredmaxwidth'] + 'px' : col.maxwidth : col.maxwidth + 'px') + ';');
        }
        if (col.minwidth) {
            width += ('min-width: ' + (typeof col.minwidth == 'string' ? col.minwidth == 'fit' ? col['measuredminwidth'] + 'px' : col.minwidth : col.minwidth + 'px') + ';');
        }
        width += '"';
        //console.log([col, width, col.width]);
        return width;
    };
    function setDefaultColumn(model) {
        var containerWidth = model.elm.width(), maxWidth = 0, columnWidth = 0, width = 0,
            actionColumnWidth = model.action ? 1 : 0, widthList = [], index = 0, activeColumns = [], hideColumns = [],
            resModel = {
                widthList: widthList,
                ActiveColumns: activeColumns,
                HideColumns: hideColumns,
                containerWidth: containerWidth
            };
        model.columns.each(function (i) {
            activeColumns.push(this);
        });
        model.RSModel = resModel;
        return '';
    };
    function getArrayWidth(col, arr, containerWidth) {
        for (var i = 0; i < arr.length; i++) {
            setNonCapitalisation(arr[i]);
            if ((arr[i].max && arr[i].max >= containerWidth) || (arr[i].min && arr[i].min <= containerWidth)) {
                return arr[i].width;
            }
        }
    };
    function getColumnWidthValue(col, defaultvalue, name, containerWidth) {
        var width = col[name];
        if (!col[name]) {
            return defaultvalue;
        }
        if (typeof col[name] == 'string') {
            width = col[name] = width.trim().toLowerCase();
            if (width == 'fit') {
                width = col['measured' + name] = getTextWidth(col.title || col.field) + 10 + (col.filter ? 20 : 0) + (col.sorting !== false ? 15 : 0);
            } else if (width[width.length - 1] == '%') {
                width = parseFloat(width.replace('%', '')) * containerWidth / 100;
            } else {
                width = parseFloat(width.replace(/px/ig, ''));
            }
        }
        //console.log([width]);
        return width;
    };
    function getColumnWidth(col, width, containerWidth) {
        var wd = getColumnWidthValue(col, 0, 'width', containerWidth),
            maxWd = getColumnWidthValue(col, wd, 'maxwidth', containerWidth),
            minWd = getColumnWidthValue(col, 0, 'minwidth', containerWidth);
        if (wd > maxWd) {
            wd = maxWd;
        }
        if (wd < minWd) {
            wd = minWd;
        }
        //console.log([col, wd, width, containerWidth]);
        return wd;
    };
    function setHideColumn(model, widget) {
        //i-grid i-widget
        var containerWidth = widget.width() - 17, maxWidth = 0, columnWidth = 0, width = 0,
            actionColumnWidth = model.action ? 1 : 0, widthList = [], index = 0,
            activeColumns = [], hideColumns = [],
            resModel = { widthList: widthList, ActiveColumns: activeColumns, HideColumns: hideColumns, containerWidth: containerWidth },
            widthCol = 0, fixedWidth = 0;
        if (model.action) {
            widthCol = 1;//For Action columns
            maxWidth = 40;
        }
        //console.log([widthCol, maxWidth, resModel, model]);
        model.columns.each(function (i) {
            var tableWidth = 0;
            if (this.width && this.width.New && this.width.each) {
                this.width = getArrayWidth(this, this.width, containerWidth);
            }
            if (this.width) {
                fixedWidth += getColumnWidth(this, this.width, containerWidth);
                tableWidth = width = (fixedWidth + maxWidth * widthCol);
            } else {
                widthCol++;
                maxWidth = Math.max(getTextWidth(this.title || this.field) + 10 + (this.filter ? 20 : 0) + (this.sorting !== false ? 15 : 0), maxWidth);//10 for padding
                //fixedWidth += this.filter ? 20 : 0;
                //fixedWidth += this.sorting !== false ? 15 : 0;
                tableWidth = width = (fixedWidth + maxWidth * widthCol);
            }
            widthList.push({ width: width, column: this, tableWidth: tableWidth, maxWidth: maxWidth, columnWidth: columnWidth, width: width, textWidth: getTextWidth(this.title || this.field), widthCol: widthCol, fixedWidth: fixedWidth, Con: tableWidth <= containerWidth, containerWidth: containerWidth });
            if (i == 0 || tableWidth <= containerWidth) {
                activeColumns.push(this);
            } else {
                hideColumns.push(this);
            }
        });
        model.RSModel = resModel;
        if (activeColumns.length != model.columns.length) {
            resModel.IsHide = true;
            return '<col style="width: 20px;">';
        }
        return '';
    };
    function getColGroup(model, widget) {
        if (model.ColGroupTemplate) return model.ColGroupTemplate;
        model.ColGroupTemplate = '<colgroup>';
        model.ColGroupTemplate += (model.responsive || (IqraConfig.Grid.Responsive && model.responsive !== false)) ? setHideColumn(model, widget) : setDefaultColumn(model);
        model.RSModel.ActiveColumns.each(function () {
            var width = getWidthStyle(this);
            var cls = this.className ? ' class="' + this.className + '"' : '';
            model.ColGroupTemplate += '<col' + width + cls + '>';
        });
        if (model.action) {
            var width = model.action.width ? ' style="width: ' + model.action.width + 'px;"' : '';
            var cls = model.action.className ? ' class="' + model.action.className + '"' : '';
            model.ColGroupTemplate += '<col' + width + cls + '>';
        }
        model.ColGroupTemplate += '</colgroup>';
        //console.log(['model', model]);
        return model.ColGroupTemplate;
    };
    function getText(column, text) {
        switch (column.type && column.type[0] || column.type) {
            case 1:
                text = text || 0;
                if ((typeof text) == 'number' && text.toFloat) {
                    column.style = column.style || 'text-align: right; white-space: pre;';
                    return text.toFloat(column.type[1]);
                }
            case 2:
                text = text || 0;
                if ((typeof text) == 'number' && text.toMoney) {
                    column.style = column.style || 'text-align: right; white-space: pre;';
                    //console.log(['column.type,[1] || 2, column.type[2] || 1, column.type[3]', column.type, column.type[1], column.type[2], column.type[3]])
                    return text.toMoney(column.type[1] ?? 2, column.type[2] ?? 1, column.type[3] ?? ',');
                }
        }
        return text;
    };
    function onBodyChange(model) {
        model.header = model.header || {};
        model.header.BodyHeight = model.Body.view.height();
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
        var filterTxt = { CreatedAt: 'Created At', ExpenseAt: 'Expense At' },
            operations = ['= ', '> ', '>= ', '< ', '<= ', 'Contains - ', 'Starts With - ', 'Ends With - ', 'Sound Equals - ', 'Sound Contains - ', 'SoundStartsWith ', 'SoundEndsWith ', 'In - ', 'NotIn - '];

        function getRow(column, text) {
            var text = getText(column, text);
            return '<td style="border: 1px solid silver; padding: 5px;' + (column.style || '') + '">' + text + '</td>';
        };
        function getTh(text) {
            return '<th style="border: 1px solid silver; padding: 5px;">' + text + '</th>';
        };
        function getReportHeader(model, mywindow, elmName, txt) {
            txt = txt + '';
            if (elmName == 'header') {
                var div = $('<div>').append(txt), title = '';
                if (model.Printable.reporttitle) {
                    if (typeof (model.Printable.reporttitle) === typeof ('')) {
                        title = model.Printable.reporttitle;
                    } else if (typeof (model.Printable.reporttitle) === typeof (nope)) {
                        title = model.Printable.reporttitle(model);
                    } else if (typeof (model.Printable.reporttitle.html) === typeof (nope)) {
                        title = model.Printable.reporttitle.html(model);
                    }
                    //div.find('.report_title').append(title).addClass('active');
                    div.find('.report_title').append(title);
                }
                //setFilter
                //var filter = getFilter(model);
                //div.find('.report_filter').append(filter).addClass('active');
                txt = div.html();
            }
            return txt;
        };
        function getColumns(model) {
            if (!model.Printable.columns) {
                return model.columns;
            } else if (typeof (model.Printable.columns) === typeof (nope)) {
                header = model.Printable.columns(model);
            } else {
                return model.Printable.columns;
            }
        };
        function printData(model, mywindow,columns) {
            model.response = model.response || {};
            model.response.Data = model.response.Data || {};
            var dataSource = model.response.Data.Data || [];
            dataSource.each(function () {
                var tr = '<tr>', data = this;
                columns.each(function () {
                    var text = data[this.field];
                    if (this.dateFormat && /^\/Date\(\-?\d+\)\/$/.test(text)) {
                        text = text.getDate().format(this.dateFormat);
                    }
                    text = typeof text != 'undefined' && text != null ? text : '';
                    if (this.onprint) {
                        tr += this.onprint.call(data,this,text, getRow(this, text));
                    } else {
                        tr += getRow(this, text);
                    }
                });
                tr += '</tr>';
                mywindow.document.write(tr);
            });
        };
        function printHeader(model, mywindow, columns) {
            var tr = '<thead><tr>';
            columns.each(function () {
                tr += getTh(this.title || this.field);
            });
            tr += '</tr></thead><tbody>';
            mywindow.document.write(tr);
        };
        function setHeader(model, mywindow, elmName) {
            if (model.Printable[elmName]) {
                var header = '';
                if (typeof (model.Printable[elmName]) === typeof ('')) {
                    header = model.Printable[elmName];
                } else if (typeof (model.Printable[elmName]) === typeof (nope)) {
                    header = model.Printable[elmName](model);
                } else if (typeof (model.Printable[elmName].html) === typeof (nope)) {
                    header = model.Printable[elmName].html(model);
                }
                header = getReportHeader(model, mywindow, elmName, header);
                mywindow.document.write('<' + elmName + '>' + header + '</' + elmName + '>');
            }
        };
        function getGridTitle(model, columns) {
            var ttl = '', printable = model.Printable;
            printable.gridtitle = printable.gridtitle || IqraConfig.Grid.Printable.gridTitle || nope;
            if (typeof (printable.gridtitle) == funcType) {
                ttl = printable.gridtitle(model, columns);
            } else if (printable.gridtitle) {
                ttl = printable.gridtitle;
            }
            return ttl;
        };
        function getGridFooter(model, columns) {
            var ttl = '', printable = model.Printable;
            printable.gridfooter = printable.gridfooter || IqraConfig.Grid.Printable.gridFooter || nope;
            if (typeof (printable.gridfooter) == funcType) {
                ttl = printable.gridfooter(model, columns);
            } else if (printable.gridfooter) {
                ttl = printable.gridfooter;
            }
            return ttl;
        };
        //function getFilterHtml(fltModel) {
        //    var header = '';
        //    if (fltModel) {
        //        if (typeof (fltModel) === typeof ('')) {
        //            header = fltModel;
        //        } else if (typeof (fltModel) === typeof (nope)) {
        //            header = fltModel(model);
        //        } else if (typeof (fltModel.html) === typeof (nope)) {
        //            header = fltModel.html(model);
        //        }
        //    }
        //    return header;
        //};
        function getFilter(list) {
            var header = '';
            //if (model.Printable.filter) {
            //    //if (model.Printable.filter.each && model.Printable.filter.length) {
            //    //    model.Printable.filter.each(function () {
            //    //        header += getFilterHtml(this);
            //    //    });
            //    //}
            //    //if (typeof (model.Printable.filter) === typeof ('')) {
            //    //    header = model.Printable.filter;
            //    //} else if (typeof (model.Printable.filter) === typeof (nope)) {
            //    //    header = model.Printable.filter(model);
            //    //} else if (typeof (model.Printable.filter.html) === typeof (nope)) {
            //    //    header = model.Printable.filter.html(model);
            //    //}

            //}
            var filterModel = {};
            list.each(function () {
                Global.Copy(filterModel = {}, this, true)
                setNonCapitalisation(filterModel);
                header += '<div class="col" style="width:25%;"><div class="label"> ' + (filterModel.title || filterModel.field) + ' </div><div>' + (operations[(filterModel.operation)] || '') + (filterModel.printValue||filterModel.value) + '</div></div>';
            });
            return header;
        };
        function getSummaryWidth(summary, fildModel, list,i) {
            var width = fildModel.width || summary.itemwidth || '';
            if (typeof (width) === funcType) {
                width = width(summary, fildModel, list, i);
            }
            
            console.log(['', width, width == 'fit' && list.length > 0, width == 'fit', list.length > 0, list.length]);
            if (width) {
                width = width + '';
                if (width == 'fit' && list.length >0) {
                    width = 'calc(' + (100 / list.length) + '% - 22px)';
                } else if (!(/%|(px)/.test(width))) {
                    width = width + 'px';
                }
                width = 'style="width:' + width + ';"';
            }
            return width;
        };
        function getSummary(model, list) {
            var header = '', value, elm = '', width;

            list.each(function (i) {
                setNonCapitalisation(this);
                //console.log(['this, model.SummaryData[this.field],this.type', this, model.SummaryData[this.field], this.type]);
                width = getSummaryWidth(model.Printable, this, list, i);
                if (typeof (model.SummaryData[this.field]) != typeof (none)) {
                    //console.log(['this, model.SummaryData[this.field],this.type', this, model.SummaryData[this.field],this.type]);
                    value = getText(this, model.SummaryData[this.field]);
                    //this.type === 2 ? (model.SummaryData[this.field] || 0).toMoney() : this.type === 1 ? (model.SummaryData[this.field] || 0).toFloat() : (model.SummaryData[this.field] || 0);
                    elm = '<div class="col' + ((!width) && (i % 6) === 0 ? " first-child":"")+'"' + width + '><div class="label"> ' + (this.title || this.field) + ' </div><div>' + value + '</div></div>';
                    header += this.created && (elm = this.created(elm)) || elm;
                }
            });
            return header;
        };
        function setSummary(model, mywindow) {
            model.Printable.summary = model.Printable.summary || model.summary;
            if (model.Printable.summary) {
                var header = '';
                var list = [];
                if (model.Printable.summary === true) {
                    for (var key in model.SummaryData) {
                        if (key != 'Total') {
                            list.push({ field: key, type: 2 });
                        }
                    }
                    header = getSummary(model, list);
                } else if (typeof (model.Printable.summary) === typeof ('')) {
                    header = model.Printable.summary;
                } else if (typeof (model.Printable.summary) === typeof (nope)) {
                    header = model.Printable.summary(model);
                } else if (typeof (model.Printable.summary.html) === typeof (nope)) {
                    header = model.Printable.summary.html(model);
                } else if (typeof (model.Printable.summary) === typeof ([]) && model.Printable.summary.New) {
                    list = model.Printable.summary;
                    header = getSummary(model, model.Printable.summary);
                } else if (typeof (model.Printable.summary) === typeof (model.Printable)) {
                    setNonCapitalisation(model.Printable.summary);
                    if (model.Printable.summary.items) {
                        list = model.Printable.summary.items;
                        header = getSummary(model, model.Printable.summary.items);
                    }
                }

                var summary = model.Printable, ttl = '',ftr='';
                summary.summarytitle = summary.summarytitle || IqraConfig.Grid.Printable.summaryTitle || nope;
                if (typeof (summary.summarytitle) == funcType) {
                    ttl = summary.summarytitle(model, list);
                } else if (summary.summarytitle) {
                    ttl = summary.summarytitle;
                }

                summary.summaryfooter = summary.summaryfooter || IqraConfig.Grid.Printable.summaryFooter || nope;
                if (typeof (summary.summaryfooter) == funcType) {
                    ftr = summary.summaryfooter(model, list);
                } else if (summary.summaryfooter) {
                    ftr = summary.summaryfooter;
                }

                //console.log(['model.Printable.summary', model.Printable.summary]);
                mywindow.document.write(ttl + '<div class="row summary_container">' + header + '</div>' + ftr);
            }
        };
        function setPeriodic(model, mywindow) {
            model.Printable.periodic = model.Printable.periodic || model.periodic;
            //console.log(['model.Printable.periodic', model, model.Printable, model.Printable.periodic]);
            var header = '',fltr=[];
            if (model.Printable.periodic) {
                var periodic = model.Printable.periodic, text = filterTxt[periodic.model.field] || periodic.model.field;
                header += '<div class="col" style="width:25%;"><div class="label"> Filter By </div><div>' + text + '</div></div>';
                var from = model.page.filter.where('itm=>itm.Operation == 2 && itm.field == "' + periodic.model.field + '"').orderBy('value', true)[0];
                var to = model.page.filter.where('itm=>itm.Operation == 3&& itm.field == "' + periodic.model.field + '"').orderBy('value')[0];
                header += '<div class="col" style="width:25%;"><div class="label"> From </div><div>' + from.value.substring(1, periodic.model.format.length + 1) + '</div></div>';
                header += '<div class="col" style="width:25%;"><div class="label"> To </div><div>' + to.value.substring(1, periodic.model.format.length + 1) + '</div></div>';

            }
            if (model.page && model.page.filter && model.page.filter.length) {
                if (model.Printable.periodic) {
                    fltr = model.page.filter.where('itm=>itm.field != "' + periodic.model.field + '" && itm.printable !== false')
                } else {
                    fltr = model.page.filter.where('itm=>itm.printable !== false');
                }
                //console.log(['fltr', fltr, model.page.filter.where('itm=>itm.printable !== false')]);

                header += getFilter(fltr);
            }
            mywindow.document.write('<div class="row filter_container">' + header + '</div>');
            mywindow.document.write('<div class="report_title active"></div>');
        };

        function PrintElem(model) {
            model.name = model.name || document.title;
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<!DOCTYPE html><html><head><title>' + model.name + '</title>');
            mywindow.document.write('</head><style type="text/css">@page{size:auto;margin: 10mm;} html{background-color: #FFFFFF;margin: 0px;} .report_title.active{border-top:2px dashed #666666;margin: 5px 0;} .row:after{clear:both;content:"";display:table;} .col{border:1px solid silver;float:left;margin:2px;padding:0 2px;width:calc(16% - 6px);text-align:center;} .col:first-child, .col.first-child{margin-left:0;} .label {font-weight:bold;}</style><body style="padding: 20px;">');
            //header
            setHeader(model, mywindow, 'header');
            //Periodic
            setPeriodic(model, mywindow);
            //Summary
            setSummary(model, mywindow);


            var columns = getColumns(model);
            mywindow.document.write(getGridTitle(model, columns));
            mywindow.document.write('<table style="border-collapse: collapse;">');
            printHeader(model, mywindow, columns);
            printData(model, mywindow, columns);
            mywindow.document.write('</tbody></table>');
            mywindow.document.write(getGridFooter(model, columns));

            //footer
            setHeader(model, mywindow, 'footer');
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
            mywindow.print();
            //mywindow.close();
            return true;
        };
        function setPrintButton(model) {
            if (model.Printable) {
                var container = model.Printable.container, btn = model.Printable.html;
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
        function setDefaultOptions(model) {
            model.Printable = typeof (model.printable) === typeof (none) ? IqraConfig.Grid.Printable : model.printable;
            if (model.Printable) {
                model.Printable && setNonCapitalisation(model.Printable);
                model.Printable.html = model.Printable.html || IqraConfig.Grid.Printable.html || '<a href="#" class="btn btn-white btn-default btn-round pull-right btn_add_print"><span class="glyphicon glyphicon-print"></span> Print </a>';
                model.Printable.container = model.Printable.container || IqraConfig.Grid.Printable.Container;
                model.Printable.header = model.Printable.header || IqraConfig.Grid.Printable.header;
                model.Printable.reporttitle = model.Printable.reporttitle || IqraConfig.Grid.Printable.reportTitle;
                model.Printable.footer = model.Printable.footer || IqraConfig.Grid.Printable.footer;
                model.Printable.summary = model.Printable.summary || IqraConfig.Grid.Printable.summary;
            }
        };
        this.SetDefaultOptions = setDefaultOptions;
        this.Bind = function (model) {
            model.Print = function () {
                PrintElem(model);
            };
            setDefaultOptions(model);
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
            //console.log(items);
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
            function setOperation(fieldModel, filterModel) {
                if (typeof fieldModel.operation != typeof none) {
                    filterModel.Operation = fieldModel.operation;
                } else if (typeof IqraConfig.Grid.Operation != typeof none) {
                    filterModel.Operation = IqraConfig.Grid.Operation;
                }

                return filterModel;
            };
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
                //console.log(['fieldModel', fieldModel]);
                return setOperation(fieldModel, { field: fieldModel.actionfield || fieldModel.field, title: fieldModel.title, value: value, type: fieldModel.filter && fieldModel.filter.type });
            };
            function setPageModel(model, fieldModel, value) {
                model.page = model.page || {};
                model.page.filter = model.page.filter || [];
                var filters = [], field = fieldModel.actionfield || fieldModel.field;
                model.page.filter.each(function () {
                    this.field != field && filters.push(this);
                });
                var filterModel = getFilterModel(fieldModel, value);
                if (value || value == '0') {
                    filters.push(filterModel);
                } else {

                }
                Global.Copy(model.page.filter, filters, true);
                model.page.filter.length = filters.length;
                //console.log([model, fieldModel, filters, value]);
            };
            function checkForCustorField(model, fieldModel, value) {
                if (typeof fieldModel.filter == 'function') {
                    var data = fieldModel.filter(value);
                    data && data.each(function () {
                        setPageModel(model, this, this.value);
                    });
                } else {
                    setPageModel(model, fieldModel, value);
                }
            };
            function submit(model, fieldModel, checker, input) {
                if (!model.onValidate || model.onValidate()) {
                    var value = (input || this).val();
                    //console.log(['submit', checker, model, fieldModel, value]);
                    (checker && (checker(model, fieldModel, value, setPageModel), 1)) || checkForCustorField(model, fieldModel, value);
                    model.page.PageNumber = 1;
                    model.changing && model.changing({ Type: 5 }, model.page);
                    gridBody.Reload(model);
                }
                return false;
            };
            function onKeyUp(e, model, fieldModel) {
                if (e.key == 'Enter' || e.keyCode == 13 || e.which == 13) {
                    e.preventDefault();
                    submit.call(this, model, fieldModel);
                    return false;
                }
            };
            function onBlur(model, fieldModel) {
                checkForCustorField(model, fieldModel, this.val());
                return false;
            };
            function setDisplayType(elm, model, fieldModel, view) {
                var displayType = $('<div class="display_type" style="position: absolute; display: block; height: 15px; top: -15px; width: 15px; right: 6px; background-color: #FFFFFF; border-radius: 7px 7px 0px 0px; border: 1px solid silver; border-bottom: 0; cursor: pointer;"><span class="glyphicon glyphicon-refresh"></span></div>');
                view.append(displayType);
                Global.Click(displayType, function () {
                    var altview = elm.data('altview');
                    view = elm.data('view');
                    fieldModel.Drp && fieldModel.Drp.Clear();
                    view.hide();
                    elm.data('altview', view);
                    $(document).click();
                    if (altview) {
                        elm.data('view', altview);
                        altview.show().find('input').empty().focus();
                    } else {
                        if (fieldModel.filter.displaytype) {
                            createTextView(elm, model, fieldModel);
                        } else {
                            createDropdown(elm, model, fieldModel);
                        }
                    }
                });
            };
            function createDropdown(elm, model, fieldModel) {
                fieldModel.operation = fieldModel.operation || IqraConfig.Grid.Operation || 0;
                if (fieldModel.filter.dropdown) {
                    setNonCapitalisation(fieldModel.filter.dropdown);
                    fieldModel.filter.datasource = fieldModel.filter.dropdown.datasource;
                    fieldModel.filter.valuefield = fieldModel.filter.valuefield || fieldModel.filter.dropdown.valuefield || 'value';
                    fieldModel.filter.textfield = fieldModel.filter.textfield || fieldModel.filter.dropdown.textfield || 'text';
                    //console.log(['fieldModel.filter.dropdown.datasource', fieldModel, fieldModel.filter, fieldModel.filter.datasource, fieldModel.filter.dropdown.datasource]);
                }

                var newFieldModel = Global.Copy(Global.Copy({}, fieldModel, true), fieldModel.filter, true),
                    view = $('<div class="search_container datepicker-dropdown dropdown-menu datepicker-orient-right datepicker-orient-bottom"><div class="datepicker-days" style="height: 30px;"><input type="text"></div></div>');
                newFieldModel.operation = fieldModel.filter.operation || 12;

                elm.find('.header_container').append(view);
                elm.data('view', view);
                view.show().click(function (e) { e.stopPropagation() });
                (fieldModel.filter.type == 1 ? Global.AutoComplete : Global.MultiSelect).Bind(Global.Copy(Global.Copy({}, fieldModel.filter, true), {
                    //dataSource: fieldModel.filter.datasource,
                    //url: fieldModel.filter.url,
                    elm: view.find('input'),
                    change: function (data) {
                        submit.call(this.elm, model, newFieldModel, newFieldModel.onchange, this.elm);
                    },
                    buttons: [{
                        className: newFieldModel.operation == 12 ? 'minus margin-l-5' : 'plus margin-l-5', title: newFieldModel.operation == 12 ? 'Set Exclude' : 'Set Include', click: function (drp, elm) {
                            //console.log(['drp,elm', drp, elm]);
                            if (newFieldModel.operation == 12) {
                                newFieldModel.operation = 13;
                                elm.removeClass('glyphicon-minus').addClass('glyphicon-plus').prop('title', 'Set Include');
                            } else {
                                newFieldModel.operation = 12;
                                elm.removeClass('glyphicon-plus').addClass('glyphicon-minus').prop('title', 'Set Exclude');
                            }
                            submit.call(view.find('input'), model, newFieldModel, newFieldModel.onchange, view.find('input'));
                        }
                    }],
                    onComplete: function (drp) {
                        fieldModel.Drp = drp;
                        drp.Inputs.focus();
                        fieldModel.filter.oncomplete && fieldModel.filter.oncomplete(drp, fieldModel);
                        //console.log(['drp', drp]);
                    }
                }, true));
                if (fieldModel.filter.type == 2) {
                    setDisplayType(elm, model, fieldModel, view);
                }
                $(document).click(function () { (!view.find('input').val()) && view.hide(); });
            };
            function createTextView(elm, model, fieldModel) {
                var view = $('<div class="search_container text_search datepicker-dropdown dropdown-menu datepicker-orient-right datepicker-orient-bottom"><div class="datepicker-days"><input type="text"><span class="btn_submit no_padding"><span class="search_icon" style="height: 20px; margin-top: 6px;"></span></span></div></div>');
                elm.find('.header_container').append(view);
                elm.data('view', view);
                view.show().click(function (e) { e.stopPropagation() }).find('input')
                    .keydown(function (e) {
                        fieldModel && fieldModel.filter && (typeof (fieldModel.filter.onkeydown) === 'function') && fieldModel.filter.onkeydown.call(this, e, elm, model, fieldModel);
                        if (e.key == 'Enter' || e.keyCode == 13 || e.which == 13) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    })
                    .keyup(function (e) {
                        var propagate = true;
                        if (fieldModel && fieldModel.filter && (typeof (fieldModel.filter.keyup) === 'function')) {
                            propagate = fieldModel.filter.keyup.call(this, e, elm, model, fieldModel);
                        }
                        //console.log(['propagate', propagate, fieldModel , fieldModel.filter , (typeof (fieldModel.filter.keyup) === 'function')]);
                        e.stopPropagation();
                        propagate !== false && onKeyUp.call($(this), e, model, fieldModel);
                    }).blur(function (e) { onBlur.call($(this), model, fieldModel) }).focus()
                    .next().click(function () { submit.call(view.find('input'), model, fieldModel) });
                $(document).click(function () { (!view.find('input').val()) && view.hide(); });
                if (fieldModel.filter && fieldModel.filter.type == 2) {
                    setDisplayType(elm, model, fieldModel, view);
                }
                service.Operation.Bind(elm, model, fieldModel, view);
                model.FilterModelList.push({ View: view, Model: fieldModel });
            };
            function createView(model, fieldModel) {
                if (fieldModel.filter && (typeof fieldModel.filter == typeof fieldModel)) {
                    setNonCapitalisation(fieldModel.filter);
                    if ((fieldModel.filter.type != 2 || fieldModel.filter.displaytype) && (fieldModel.filter.DropDown || fieldModel.filter.url || fieldModel.filter.darasource)) {
                        createDropdown(this, model, fieldModel);
                        return;
                    }
                }
                //console.log(['model, fieldModel', model, fieldModel, fieldModel.filter, typeof fieldModel.filter, typeof fieldModel, typeof fieldModel.filter == typeof fieldModel]);
                createTextView(this, model, fieldModel);
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
            if (Global.Key.ctrlKey) {
                return;
            }
            var elm = $(this),
                    fieldModel = elm.data('model'),
                    model = elm.parent().data('model'),
                    field = fieldModel.actionfield || fieldModel.sortField || fieldModel.field;

            if (Global.Key.altKey && fieldModel.sorting && fieldModel.sorting.alt) {
                field = fieldModel.sorting.alt;
            }
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
        function getOffsetTop(container) {
            var top = container.offsetTop || 0;
            if (container.offsetParent) {
                top += getOffsetTop(container.offsetParent);
            }
            return top;
        };
        function setFixedHeader(model,container,header) {
            if (model.fixedheader || (IqraConfig.Grid.FixedHeader && model.fixedheader !== false)) {
                $(document).scroll(function (evt) {
                    model.header.OffsetTop = getOffsetTop(container);
                    if (model.header.OffsetTop > 0) {
                        model.header.BodyHeight = model.header.BodyHeight || model.Body.view.height();
                        //console.log(['model.header.BodyHeight, model.header, model', (model.header.OffsetTop + model.header.BodyHeight) , window.scrollY, model.header.BodyHeight, model.header, model]);
                        if ((model.header.OffsetTop + model.header.BodyHeight) < window.scrollY) {
                            if (model.header.Fixed) {
                                model.header.Fixed = false;
                                container.style.height = 'auto';
                                header.removeClass('fixed').css({ width: 'auto' });
                            }
                            return;
                        }
                        if (model.header.OffsetTop < window.scrollY) {
                            if (!model.header.Fixed) {
                                model.header.Fixed = true;
                                container.style.height = container.offsetHeight + 'px';
                                header.addClass('fixed').css({ width: (container.scrollWidth - 18) + 'px' });
                            }
                        } else {
                            if (model.header.Fixed) {
                                model.header.Fixed = false;
                                container.style.height = 'auto';
                                header.removeClass('fixed').css({ width: 'auto' });
                            }
                        }
                    }
                });

            }
            return container;
        };
        this.GetTemplate = function (model, tr) {
            var resizable = model.resizable || (IqraConfig.Grid.resizable && model.resizable !== false);
            model.columns = columns.Get(model);
            model.RSModel.IsHide && tr.append('<th rowspan="1" scope="col" class="i-header table_header"></th>');
            model.RSModel.ActiveColumns.each(function (i) {
                var th;
                if (this.sorting === false) {
                    th = $('<th rowspan="1" scope="col" class="i-header table_header sorting ' + this.className + '"><div style="position: relative;" class="header_container">' + this.title + '<span class="icon_container"></span></div></th>').data('model', this);
                } else {
                    th = $('<th rowspan="1" scope="col" class="i-header table_header sorting ' + this.className + '"><div style="position: relative;" class="header_container"><a>' + this.title + '</a><span class="icon_container"></span></div></th>').click(sort).data('model', this);
                }
                service.Calculation.BindTH(model, this, th, i);
                tr.append(th);
                this.filter && filter.Bind.call(th);
                resizable && service.Resize.Bind(i, th, tr, this, model);
            });

            tr.data('model', model);
            model.action && tr.append(setActionField(model, tr));
            model.header = { view: tr };
            model.FilterModelList = [];
        };
        this.Set = function (model, widget) {

            var template = $('<div class="i-grid-header" style="padding-right: 17px;"></div>');

            template.append('<div class="i-grid-header-wrap"><table>'
                + getColGroup(model, widget) + '<thead><tr></tr></thead></table></div>');
            label2.GetTemplate(model, template.find('tr'));
            widget = widget.find('.i-grid-header_container');
            widget.html(template);
            setFixedHeader(model, widget[0], template);
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
                        td = $('<div ' + cls + '><label> ' + (this.title || this.field) + '</label> : </div>').append(setAutoBindText(data, this, Global.Click($('<a>' + text + '</a>'), this.click, data, false, this, model)));
                    } else {
                        td = $('<div ' + cls + '><label> ' + (this.title || this.field) + '</label> : </div>').append(setAutoBindText(data, this, $('<span>' + text + '</span>')));
                    }
                    tr.append(td);
                });
                (typeof model.model.rowBound == 'function') && model.model.rowBound.call(this, tr);
            } else {
                model.Template.toggle();
            }
            model.elm.find('.glyphicon').toggleClass('glyphicon-chevron-down');
        }
        function setCollpasableIcon(model, data, tr) {
            var elm = $('<td class="btn_colupse" style="padding: 0px 0px 0px 3px;"><span class="icon_container"><span class="glyphicon glyphicon-chevron-right"></span></span></td>'),
                obj = { model: model, data: data, elm: elm, tr: tr };
            Global.Click(elm.find('.icon_container'), toggle, obj);
            return elm;

        };
        function setActionField(model, tr, data) {
            var td = $('<td class="' + (model.action.className || '') + '" >');
            model.action.items.each(function () {
                var btn = this.html ? $(this.html) : $('<input type="button" value="' + (this.text || '') + '">');
                Global.Click(btn, this.click, data, false, model);
                td.append(btn);
            });
            return td;
        }
        function autoBindText(model, column,elm) {
            if (column.isautobind != false) {
                Global.AutoBind(model, elm, column.field, column.type, 2);
            }
        };
        function setAutoBindText(model, column, elm) {
            column.autobind != false && autoBindText(model, column, elm);
            return elm;
        };


        function getColumnElm(model, column, text,grid) {
            var txt = getText(column, text), cls = column.className ? 'class="' + column.className + '"' : '';
            if (column.style) {
                cls += (cls ? ' style="' + column.style + '"' : 'style="' + column.style + '"');
            }

            if (typeof column.click == 'function') {
                return $('<td ' + cls + '></td>').append(setAutoBindText(model, column, Global.Click($('<a>' + txt + '</a>'), column.click, model, false, column, grid)));
            } else {
                return setAutoBindText(model, column, $('<td ' + cls + '>' + txt + '</td>'));
            }
        };
        function createRow(model,index) {
            var tr = $('<tr class="grid_item" role="row">').data('model', this), data = this;
            model.RSModel.IsHide && tr.append(setCollpasableIcon(model, this, tr));
            model.RSModel.ActiveColumns.each(function (i) {
                var text = this.getText(data, this.field);
                if (this.dateFormat && /^\/Date\(\-?\d+\)\/$/.test(text)) {
                    text = data[this.field] = text.getDate().format(this.dateFormat);
                }
                text = typeof text != 'undefined' && text != null ? text : '';
                var td = getColumnElm(data, this, text, model);
                tr.append(td);
                service.Calculation.Bind.call(model, td, data, this, index,i);
                this.bound && this.bound.call(data, td, tr, this, model, text);
            });

            model.action && tr.append(setActionField(model, tr, data));
            (typeof model.rowBound == 'function') && model.rowBound.call(this, tr, model.Body.view);
            (model.details && typeof model.details == 'function') && Global.DblClick(tr, model.details, this, false, model);
            return tr;
        }
        function createBody(model) {
            model.Body.view.empty();
            model.response.Data.Data.each(function (i) {
                model.Body.view.append(createRow.call(this, model,i));
            });
            (model.PageSize || model.pagger) && pagging.SetPagging(model);
            model.oncreated && model.oncreated();
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
            if (model.onsummary) {
                model.onsummary(model, model.response.Data);
                model.response.Data.Total &&  service.Summary.Populate(model.response.Data, model);
            }
        };
        function getColumnData(response) {
            if (!response || !response.Data) {
                return response;
            }
            response.Data.Orginal = response.Data.Data || [];
            if (response.Data.Columns && (typeof response.Data.Columns.each === 'function')) {
                response.Data.Data = [];
                var data, item = {};
                response.Data.Orginal.each(function () {
                    data = this;
                    response.Data.Data.push(item);
                    response.Data.Columns.each(function (i) {
                        item[this] = data[i];
                    });
                    item = {};
                });
                //console.log(response);
            }
            return response;
        }
        this.Add = function (item, model) {
            model.Body.view.prepend(createRow.call(item, model));
            onBodyChange(model);
        };
        this.AddTottom = function (item, model) {
            model.Body.view.append(createRow.call(item, model));
            onBodyChange(model);
        };
        this.Remove = function (item,tr, model) {
            var index=0, source = model.dataSource || [];
            source.each(function () {
                if (this === item) {
                    tr.remove();
                } else {
                    model.dataSource[index] = this;
                    index++;
                    //list.push(this);
                    //console.log(['item,tr, model => ', item, tr, model, this[key], model[key], this[key] === model[key]]);
                }
            });
            model.dataSource.length = index;
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
                onBodyChange(model);
            } else if (model.isActive != false) {
                busy(model);
                model.page.filter = model.page.filter || [];
                var page = {
                    "SortBy": model.page.SortBy,
                    "filter": model.page.filter.slice(),
                    "IsDescending": model.page.IsDescending,
                    "PageNumber": model.page.PageNumber,
                    "PageSize": model.page.PageSize,
                    "Id": model.page.Id
                };
                model.onrequest && model.onrequest(page);
                return Global.CallServer(getUrl(model), function (response) {
                    if (!response.IsError) {
                        model.ondata && model.ondata(response, model);
                        response = getColumnData(response);
                        model.dataBinding(response);

                        //Used in print section
                        model.SummaryData = {};
                        if (typeof (response.Data.Total) === typeof (response)) {
                            model.SummaryData = Global.Copy({}, response.Data.Total, true);
                        }
                        model.response = response;
                        service.Summary.Populate(response.Data, model);
                        createBody(model);
                        model.dataBound(response);
                        typeof func == 'function' && func();
                        model.changed && model.changed({ Type: 0 }, response);
                        onBodyChange(model);
                    } else {
                        console.log(['model', model]);
                        (typeof model.onerror == 'function' && model.onerror(response)) || Global.ShowError(response.Id, { path: model.url, section: 'Grid' });
                    }
                    free(model);
                }, function (response) {
                    (typeof model.onerror == 'function' && model.onerror(response)) || alert('Network error had occured.');
                    free(model);
                }, page, 'POST')
            }
        };
        this.Create = createBody;
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
            console.log(['model.footer', model.pagger, model, !model.PageSize && model.footer, !model.PageSize , model.footer]);
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
            var container = $('<div class="i-grid-container"><div class="grid_column_selector_container"></div><div class="i-grid i-widget"><div class="i-grid-header_container"></div></div></div>'),
                template = container.find('.i-grid');
            model.elm.append(container);
            console.log(['Grid=>model.elm', model.elm]);
            service.Selector.Set(model, container);
            header.Set(model, template);
            var table = $('<div class="i-grid-content"><table>' + getColGroup(model, template) + '<tbody></tbody></table></div>');
            template.append(table);
            table = table.find('table');
            model.views = { wrapper: template, table: table, tBody: table.find('tbody'), tHead: template.find('thead'), container: template };
            (model.resizable || (IqraConfig.Grid.resizable && model.resizable !== false)) && service.Resize.SetCols(model);
            model.Body = { view: model.views.tBody };
            //Need to be fixed
            //div.append(table).append(footer.GetTemplate(model));
            footer.Set(model, template);
            report.Bind(model);
            service.Periodic.Bind(model);
            service.Summary.Bind(model);
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
            var total = 0;
            if (model.response.Data.Total && typeof (model.response.Data.Total.Total) !== typeof (none)) {
                total = model.response.Data.Total.Total;
            } else {
                total = model.response.Data.Total;
            }

            end = start + model.response.Data.Data.length;
            start = start + (end > 0 ? 1 : 0);
            var showingInfo = (model.page.showingInfo && (typeof (model.page.showingInfo) == 'function') ? model.page.showingInfo(start, end, total) : model.page.showingInfo) || 'Showing {0} to {1}  of {2}  items';
            model.footer.showingInfo.html(showingInfo.format(start, end, total));
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
                var total = 0;
                if (model.response.Data.Total && typeof (model.response.Data.Total.Total) !== typeof (none)) {
                    total = model.response.Data.Total.Total;
                } else {
                    total = model.response.Data.Total;
                }
                model.page.total = total;
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

        function createView(elm, model, fieldModel, view) {
            var dataModel = {
                View: $('<div class="flt_operation_container"><input data-binding="Operation" class="form-control" type="text"></div>'),
                IsOpend:true
            }, operation;
            if (typeof fieldModel.operation != typeof none) {
                operation = fieldModel.operation;
            } else if (typeof IqraConfig.Grid.Operation != typeof none) {
                operation = IqraConfig.Grid.Operation;
            }
            view.append(dataModel.View);
            dataModel.View.find('input').val(operation);
            dataModel.Model = {
                dataSource: [
                    { text: 'Equals', value: '0' },
                    { text: 'Greater Than', value: '1' },
                    { text: 'Greater Than/Equal', value: '2' },
                    { text: 'Less Than', value: '3' },
                    { text: 'Less Than/Equal', value: '4' },
                    { text: 'Contains', value: '5' },
                    { text: 'Starts With', value: '6' },
                    { text: 'Ends With', value: '7' },
                    //{ text: 'In', value: '8' },
                    //{ text: 'NotIn', value: '9' }
                ],
                elm: dataModel.View.find('input'),
                selectedValue: operation,
                selected:operation,
                change: function (data) {
                    dataModel.View.slideUp();
                    dataModel.IsOpend = false;
                    if (data) {
                        fieldModel.Operation = fieldModel.operation = data.value;
                    } else {
                        if (typeof fieldModel.operation != typeof none) {
                            fieldModel.Operation = fieldModel.operation;
                        } else if (typeof IqraConfig.Grid.Operation != typeof none) {
                            fieldModel.Operation = IqraConfig.Grid.Operation;
                        }
                    }
                },
            };
            Global.DropDown.Bind(dataModel.Model);
            fieldModel.OperationModel = dataModel;
        };
        function show(elm, model, fieldModel, view) {
            if (fieldModel.OperationModel.IsOpend) {
                fieldModel.OperationModel.IsOpend = false;
                fieldModel.OperationModel.View.slideUp();
            } else {
                fieldModel.OperationModel.IsOpend = true;
                fieldModel.OperationModel.View.slideDown();
            }
        };
        this.Bind = function (elm, model, fieldModel, view) {
            var displayType = $('<div class="display_type" style="position: absolute; display: block; height: 15px; width: 15px; cursor: pointer; left: 5px; top: -15px;"><span class="glyphicon glyphicon-chevron-up" style="top: 0px;"></span></div>');
            view.append(displayType);
            Global.Click(displayType, function () {
                if (fieldModel.OperationModel) {
                    show(elm, model, fieldModel, view);
                } else {
                    createView(elm, model, fieldModel, view);
                }
            });
        };
    }).call(service.Operation = {});
    (function () {
        var columns = [], orginal = {}, selectorContainer = $('#selector_container');
        function setGrid(model) {
            model.ColGroupTemplate = none;
            model.views.table.html(getColGroup(model, model.views.wrapper) + '<tbody></tbody>');
            model.views.tBody = model.views.table.find('tbody');
            model.Body = { view: model.views.tBody };
            header.Set(model, model.views.wrapper);
            //console.log([model, model.views.wrapper,model.views.wrapper.find]);
            model.views.tHead = model.views.wrapper.find('.i-grid-header-wrap thead');//i-grid-header-wrap
            (model.resizable || (IqraConfig.Grid.resizable && model.resizable !== false)) && service.Resize.SetCols(model);
            if (model.dataSource && typeof model.dataSource == typeof []) {
                model.Reload();
            } else {
                model.response && model.response.Data && model.response.Data.Data && model.response.Data.Data.length && gridBody.Create(model);
                onBodyChange(model);
            }

        };
        function setOnchange(elm, func, model) {
            elm.change(function () {
                func(model, $(this));
            });
        };
        function setColumnView(model, columns, wrapper) {
            var selector = model.selector, selectedColumns = [], cols = orginal[model.Id || '12345'] = {}, width = wrapper.find('.i-grid').width();
            columns.each(function (i) {
                setNonCapitalisation(this);
                //console.log([typeof this.selected == 'number', typeof this.selected, 'number', this, width]);
                if (typeof this.selected == 'number') {
                    this.selected = this.selected <= width;
                } else {
                    this.selected = this.selected !== false;
                }
                var elm = $('<label class="lbl_selector"><input type="checkbox" data-binding="selected" /> ' + (this.title || this.field) + ' </label>');
                Global.Form.Bind(this, elm);
                setOnchange(elm, onColumnChange, { model: model, item: this });
                selector.container.append(elm);
                (this.selected !== false) && selectedColumns.push(this);
                this.Id = this.Id || i;
                cols[this.field] = this.selected;
            });
            selector.columns = columns;

            return selectedColumns;
        };
        function onColumnChange(model, elm) {
            var newColumns = [], isChanged = false, cols = orginal[model.model.Id || '12345'];
            model.model.selector.columns.each(function () {
                (this.selected !== false) && newColumns.push(this);
                isChanged = isChanged || (cols[this.field] !== this.selected);
            });
            model.model.columns = newColumns;
            setGrid(model.model);
            service.Setting.Changed(model.model, isChanged);
        };
        function setDefault(model, selector, wrapper) {
            setNonCapitalisation(selector);
            var container = wrapper.find('.grid_column_selector_container');
            container.append('<div class="btn_selector_open"></div><div class="selector_content_container"></div>');
            ///console.log(['', selector.container, selector, container]);
            if (!selector.container) {
                var elm = $('<span class="glyphicon glyphicon-chevron-up"></span>');
                selector.container = container.find('.selector_content_container');
                container.find('.btn_selector_open').append(elm);
                elm.click(function () {
                    selector.container.slideToggle();
                    $(this).toggleClass('glyphicon-chevron-down');
                });
            }
            service.Setting.SetView(model, wrapper);
        };
        this.SetOrginalColumns = function (model) {
            var cols = orginal[model.Id || '12345'] = {};
            model.selector.columns.each(function () {
                cols[this.field] = this.selected;
            });
        };
        this.Set = function (model, wrapper) {
            //console.log([Global.Copy({}, model), Global.Copy({}, IqraConfig.Grid.selector)]);
            //console.log(['Selector', model.selector || (IqraConfig.Grid.selector && model.selector !== false)]);
            if (model.selector || (IqraConfig.Grid.selector && model.selector !== false)) {
                model.selector = model.selector || Global.Copy({}, IqraConfig.Grid.selector, true);
                setDefault(model, model.selector, wrapper);
                model.columns = setColumnView(model, model.columns, wrapper);
            }
        };
    }).call(service.Selector = {});
    (function () {
        var elm = {}, savedData = {};
        function getCols(cols, cols1) {
            var list = [], dic = {}, col;
            (cols1 || []).each(function () {
                dic[this.field] = this;
            });
            cols.each(function () {
                if (dic[this.field]) {
                    col = dic[this.field];
                } else {
                    col = { field: this.field };
                }
                col.selected = this.selected;
                list.push(col);
            });
            return list;
        };
        function setFilter(col) {
            if (typeof col.filter != typeof none) {
                if (typeof col.filter != typeof col) {
                    col.filter = col.filter ? (this.filter ? this.filter : true) : false;
                }
                this.filter = col.filter;
            }
        };
        function setColumns(modelCols, dataCols) {
            if (dataCols && dataCols.each) {
                var dic = {}, col;
                dataCols.each(function () {
                    dic[this.field] = this;
                });
                //console.log(['dic', dic]);
                modelCols.each(function (i) {
                    this.order = i;
                    if (dic[this.field]) {
                        col = dic[this.field];
                        this.order = col.order;
                        if (typeof col.selected != typeof none) {
                            this.selected = col.selected ? this.selected || col.selected : false;
                        }
                        setFilter.call(this, col);
                        if (typeof col.sorting != typeof none) {
                            this.sorting = col.sorting ? this.sorting || col.sorting : false;
                        }
                        if (typeof col.width != typeof none) {
                            this.width = col.width ? col.width : none;
                        }
                        if (typeof col.title != typeof none) {
                            this.title = col.title;
                        }
                    }
                });
            }
        };
        function set(model, data) {
            if (data.Version >= (parseFloat((model.version || IqraConfig.Version || 0) + ''))) {
                savedData[model.Id || '12345'] = data;
                if (typeof data.responsive != typeof none) {
                    model.responsive = data.responsive ? model.responsive || {} : false;
                }
                if (typeof data.selector != typeof none) {
                    model.selector = data.selector ? model.selector || {} : false;
                }
                if (typeof data.printable != typeof none) {
                    model.printable = data.printable ? model.printable === false ? none : model.printable : false;
                }
                if (typeof data.resizable != typeof none) {
                    model.resizable = data.resizable ? model.resizable === false ? data.resizable : model.resizable : false;
                }
                setColumns(model.columns, data.columns);
                model.columns.orderBy('order');
            }
        };
        function save(model) {
            var data = {
                Id: model.id,
                RelationType: model.setting.relationtype || 'Aplication',
            }, content = savedData[model.id || '12345'] || {};
            content.columns = getCols(model.selector.columns, content.columns);
            content.Version = parseFloat((model.version || IqraConfig.Version || 0) + '');
            data.Content = JSON.stringify(content);
            Global.CallServer('/IqraGridArea/IqraGrid/Add', function (response) {
                if (!response.IsError) {
                    service.Selector.SetOrginalColumns(model);
                    elm[model.Id || '12345'] && elm[model.Id || '12345'].remove();
                    elm[model.Id || '12345'] = none;
                    savedData[model.id || '12345'] = content;
                }
            }, function (response) {
            }, data, 'POST');
        };
        this.SetView = function (model, wrapper) {
            if (model.id && model.setting) {
                var elm = $('<span class="glyphicon glyphicon-edit" style="top: -2px; margin-left: 15px; font-size: 0.9em;"></span>');
                wrapper.find('.grid_column_selector_container .btn_selector_open').append(elm);
                Global.Click(elm, function (model) {
                    Global.Add({
                        model: model,
                        savedData: savedData[model.id || '12345'],
                        name: 'GridEditor',
                        url: IqraConfig.Url.Js.GridEditor,
                        Success: function (content) {

                        }
                    });
                }, model);
            }
        };
        this.Changed = function (model, isChanged) {
            if (!model.setting) {
                return;
            }
            if (isChanged && !elm[model.Id || '12345']) {
                elm[model.Id || '12345'] = $('<label class="lbl_selector"><a class="">' + (model.setting.title || model.setting.name || ' Save Changes') + '</a></label>');
                model.selector.container.append(elm[model.Id || '12345']);
                Global.Click(elm[model.Id || '12345'], save, model);
            } else if (!isChanged && elm[model.Id || '12345']) {
                elm[model.Id || '12345'].remove();
                elm[model.Id || '12345'] = none;
            }
        };
        this.Bind = function (model, func) {
            if (!model.id || model.setting === false) {
                return func(model);
            }
            var browserData = localStorage.getItem(model.id);
            if (browserData) {
                var response = JSON.parse(browserData);
                set(model, response);
                func(model);
                model.setting.onload && model.setting.onload(response, true);
                return;
            }
            var durl = model.setting.url(model) || '/IqraGridArea/IqraGrid/GetById?Id=' + model.id;
            Global.CallServer(durl, function (response) {
                if (!response.IsError) {
                    if (response.Data && response.Data.Content) {
                        set(model, JSON.parse(response.Data.Content));
                    }
                    func(model);
                    model.setting.onload && model.setting.onload(response);
                } else {
                    func(model);
                    typeof model.setting.onerror == 'function' && model.setting.onerror(response);
                }
            }, function (response) {
                func(model);
                typeof model.setting.onerror == 'function' && model.setting.onerror(response);
            }, {}, 'POST');
        };
    }).call(service.Setting = {});
    (function () {
        var cModel, x = 0;
        function start(e, index, th, tr, col, model) {
            cModel = {
                th: th,
                data: col,
                model: model,
                index: index,
                colH: model.views.hCols[index],
                colT: model.views.tCols[index]
            };
            x = e.pageX - th.width() - 10;
            //console.log([cModel, cModel.data, cModel.data.width]);
        };
        function setReposition(width) {
            cModel.colH.style.width = width + 'px';
            cModel.colT.style.width = width + 'px';
            cModel.data.width = width;
        };
        $(document).mousemove(function (e) {
            if (cModel) {
                e.stopPropagation();
                e.preventDefault();
                setReposition(e.pageX - x);
            }
        });
        $(document).mouseup(function (e) {
            if (cModel) {
                cModel = none;
            }
        });
        this.SetCols = function (model) {
            model.views.tCols = model.views.table.find('col');
            model.views.hCols = model.views.tHead.parent().find('col');
        };
        this.Bind = function (index, th, tr, col, model) {
            var elm = $('<div class="resizer"></div>');
            th.find('.header_container').append(elm);
            if (model.RSModel.IsHide) {
                index++;
            }
            elm.mousedown(function (e) {
                e.stopPropagation();
                e.preventDefault();
                start(e, index, th, tr, col, model);
            });
        };
    }).call(service.Resize = {});
    (function () {
        var detailsModel = {};
        var selfService = {}, windowModel, formModel = {}, callerOptions, dataSource = {};
        function getView(data, tr) {
            var view = '';
            if (typeof (callerOptions.view) === (typeof nope)) {
                return callerOptions.view(data, tr);
            } else if (typeof (callerOptions.view) === typeof ('')) {
                return callerOptions.view;
            } else {
                view = '<div id="content_container">' +
                            '<ul class="nav nav-tabs"></ul>' +
                            '<div class="tab-content"> </div>' +
                        '</div>';
            }
            return view;
        };
        function close() {
            windowModel && windowModel.Hide();
        };
        function getName(name) {
            return name.replace(/[A-Z]/g, function (match) {
                return ' ' + match;
            });
        };
        function loadDetails(tab, dataUrl, callBack) {
            if (typeof dataUrl == 'function') {
                dataUrl = dataUrl(callerOptions.model, windowModel);
            }
            windowModel.Wait('Please wait while loading data....');
            Global.CallServer(dataUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    tab.onloaded = tab.onloaded || tab.onload;
                    tab.onloaded && tab.onloaded(tab, response.Data, tab.formmodel);
                    callBack(response.Data);
                } else {
                    //error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                windowModel.Free();
                //error.Save(response, saveUrl);
            }, null, 'Get');
        };
        this.Show = function (options, data, tr) {
            callerOptions = options;
            setNonCapitalisation(options);
            tr.DataId = tr.Id || Global.Guid();
            if (detailsModel[tr.Id]) {
                if (detailsModel[tr.Id].IsOpended) {
                    detailsModel[tr.Id].IsOpended = false;
                    detailsModel[tr.Id].view.fadeOut();
                } else {
                    detailsModel[tr.Id].IsOpended = true;
                    detailsModel[tr.Id].view.fadeIn();
                }
            } else {
                var tmpl = detailsModel[tr.Id] = { IsOpended: true };
                tmpl.view = $('<tr class="grid_details"><td colspan="' + tr.find('td').length + '" style="padding: 5px 5px 5px 20px;"></td></tr>'),
                tr.after(tmpl.view);
                tmpl.view.find('td').append(callerOptions.view || getView(data, tr));
                selfService.Tab.Bind(tmpl, data, tr);
            }
        };
        (function () {
            var isBind, tabs, container, self = {};
            function reset(tmpl) {
                tmpl.tabs.each(function () {
                    this.button.elm.removeClass('in active');
                    this.View.removeClass('in active');
                });
            };
            function populate(tab, model) {
                tab.AllColumns.each(function () {
                    if (typeof model[this.field] != typeof none) {
                        if (this.type == 1) {
                            tab.formmodel[this.field] = (model[this.field] || 0).toFloat();
                        } else if (this.type == 2) {
                            tab.formmodel[this.field] = (model[this.field] || 0).toMoney();
                        } else if (this.type == 3 || this.dateformat) {
                            model[this.field] ? tab.formmodel[this.field] = (model[this.field] + '').getDate().format(this.dateformat || 'yyyy/MM/dd hh:mm') : '';
                        } else {
                            typeof model[this.field] == 'undefined' ? '' : tab.formmodel[this.field] = model[this.field];
                        }
                    }
                });
                tab.onpopulated && tab.onpopulated(tab, model);
            };
            function showTab(tab, tmpl) {
                reset(tmpl);
                tab.button.elm.addClass('active');
                tab.View.addClass('in active');
                tab.grid && tab.grid.each(function (i) {
                    this.IsCreated ? this.Model.Reload() : this.GridModelCreators();
                });
                tab.model && tab.columns && tab.columns.length && populate(tab, tab.model);
                tab.detailsurl && loadDetails(tab, tab.detailsurl, function (model) { populate(tab, model) });
            };
            function createButton(tmpl, tab, position) {
                if (typeof tab.button == 'function') {
                    tab.button = { elm: tab.button(tab, container, windowModel, callerOptions) };
                } else if (typeof tab.button == 'string') {
                    tab.button = { elm: $(tab.button) };
                } else if (typeof tab.button == 'object') {
                    setNonCapitalisation(tab.button);
                    tab.button = { elm: $('<li' + (tab.button.class ? ' class="' + tab.button.class + '"' : '') + '><a>' + (tab.button.title || getName(tab.button.name || 'Tab_' + position)) + '</a></li>') };
                }
                //' + (tab.button.class?' class=""':'') + '
                if (typeof tab.button.elm == 'string') {
                    tab.button.elm = $(tab.button.elm);
                }
            };
            function createTabButton(tmpl, tab, position) {
                if (tab.button) {
                    createButton(tmpl, tab, position);
                } else {
                    tab.button = { elm: $('<li><a>' + (tab.title || getName(tab.name || 'Tab_' + position)) + '</a></li>') };
                }
                tmpl.TabContainer.Button.append(tab.button.elm);
                Global.Click(tab.button.elm, showTab, tab, true, tmpl);
            };
            function createTabs(tmpl, data, tr) {
                tmpl.TabContainer = container = {
                    Button: tmpl.view.find('.nav-tabs'),
                    Content: tmpl.view.find('.tab-content')
                };
                tmpl.tabs = [];
                callerOptions.Tabs.each(function (i) {
                    this.PositionIndex = i;
                    setNonCapitalisation(this);
                    createTabButton(tmpl, this, i);
                    self.Content.Create(this, tmpl);
                    this.Bind = function () {
                        showTab(this, tmpl);
                    };
                    tmpl.tabs.push(this);
                    this.TabModel = this;
                });
                tmpl.tabs[callerOptions.selected] && tmpl.tabs[callerOptions.selected].Bind();
            };
            this.Bind = function (tmpl, data, tr) {
                callerOptions.selected = callerOptions.selected || 0;
                if (tabs) {
                    callerOptions.Tabs.each(function (i) {
                        setNonCapitalisation(this);
                        tabs[i].detailsurl = this.detailsurl;
                        tabs[i].model = this.model;
                    });
                    tabs[callerOptions.selected] && tabs[callerOptions.selected].Bind();
                } else {
                    createTabs(tmpl, data, tr);
                }
            };
            (function () {
                var maxNum = 1000, inner = {};
                function getClass(model, sibling, colwidth) {
                    var cl = model.class || model.classname || '', cls = ' class="' + (cl ? cl + ' ' : '') + 'col-sm-6 col col-md-6" style="width:' + colwidth + '%" ';
                    cl = (cl ? cl + ' ' : '');
                    switch (sibling) {
                        case 1:
                            cls = ' class="' + cl + 'col-sm-12 col col-md-12" ';
                            break;
                        case 2:
                            cls = ' class="' + cl + 'col-sm-6 col col-md-6" ';
                            break;
                        case 3:
                            cls = ' class="' + cl + 'col-sm-4 col col-md-4" ';
                            break;
                        case 4:
                            cls = ' class="' + cl + 'col-sm-3 col col-md-3" ';
                            break;
                        case 6:
                            cls = ' class="' + cl + 'col-sm-2 col col-md-2" ';
                            break;
                    }
                    return cls;
                };
                function getField(model, creator) {
                    var firstPart = '';
                    var add = Global.Copy(Global.Copy({}, model.add || {}, true), model.details || {});
                    add.sibling = add.sibling || 2;
                    var colwidth = parseInt(100 / add.sibling);
                    creator.width -= colwidth;
                    if (creator.width < 0) {
                        creator.width = 100 - colwidth;
                        firstPart = '</div><div class="row">';
                    }
                    if (add.template) {
                        return firstPart + add.template;
                    }
                    var isRequired = model.required == false ? '' : 'required ';
                    var dateFormat = model.dateFormat ? 'data-dateformat="' + model.dateFormat + '" ' : '';
                    var attr = isRequired + 'data-binding="' + model.field + '" name="' + model.field;
                    var input = '<span ' + dateFormat + attr + '" class="form-control auto_bind"></span>';

                    return firstPart + '<section ' + getClass(model, add.sibling, colwidth) +
                        '><div><label for="' + model.field + '">' + model.title +
                        '</label></div><div class="input-group">' + input + ' </div></section>';
                };
                function getDropdownColumn(list, columns) {
                    list.each(function () {
                        setNonCapitalisation(model);
                        //this.field = this.Id;
                        this.field = this.title = this.Id.replace(/id\s*$/i, '');
                        this.isDropDown = true;
                        this.position = typeof (this.position) == 'undefined' ? maxNum : this.position;
                        columns.push(this);
                        this.change && getDropdownColumn([this.change], columns);
                    });
                };
                function getColumn(model, columns) {
                    setNonCapitalisation(model);
                    if (model.detail != false) {
                        model.title = model.title || model.field;
                        model.position = typeof (model.position) == 'undefined' ? maxNum : model.position;
                        columns.push(Global.Copy({}, model));
                    }
                };
                function getColumnForAdditional(model, columns) {
                    setNonCapitalisation(model);
                    getColumn(model, columns);
                };
                function setColumns(tab, tmpl) {
                    var template = '<div class="columns_container"><div class="row">',
                        creator = { width: 100 };
                    tab.columns = tab.columns || [];
                    tab.dropdownlist = tab.dropdownlist || [];
                    tab.additionalfield = tab.additionalfield || [];
                    var columns = tab.AllColumns = [];
                    tab.columns.each(function () { getColumn(this, columns); });
                    tab.additionalfield.each(function () { getColumnForAdditional(this, columns); });

                    getDropdownColumn(tab.dropdownlist, columns);
                    columns.orderBy('position');
                    columns.each(function () {
                        if (this.detail != false && this.details != false) {
                            template += getField(this, creator);
                        }
                    });
                    tab.ColumnView = $(template + '</div></div>');
                    tab.formmodel = tab.formmodel || {};
                    Global.Form.Bind(tab.formmodel, tab.ColumnView);
                    tab.View.append(tab.ColumnView);
                };
                this.Create = function (tab, tmpl) {
                    tab.View = $(tab.View || '<div class="tab-pane fade"></div>');

                    tmpl.TabContainer.Content.append(tab.View);
                    setColumns(tab, tmpl);
                    inner.Grid.Create(tab, tmpl);
                };
                (function () {
                    var elm;
                    function setTemplate(tmpl, tab, container, grid, position) {
                        grid.View = $(grid.template ||
                            '<div class="grid_section">' +
                                '<div class="filter_container row" style="margin:10px 0;"></div>' +
                                '<div class="summary_container row" style="margin:10px 0;"></div>' +
                                '<div class="empty_style button_container row"></div>' +
                                '<div class="margin-top-10 grid_container"></div>' +
                            '</div>');
                        container.append(grid.View);
                        (grid.buttons || []).each(function (i) {
                            setNonCapitalisation(this);
                            elm = $(this.html || '<a style="margin-right: 5px;margin-left: 5px;" class="btn btn-default btn-round pull-right"><span class="glyphicon ' + (this.class || 'glyphicon-open') + '"></span> ' + (this.text || this.title || this.name || 'Button_' + i) + ' </a>');
                            grid.View.find(this.selector || '.button_container').append(elm);
                            Global.Click(elm, this.click || void 0, { Button: this, Grid: grid, Tab: tab, options: callerOptions });
                        });
                        grid.onviewcreated && grid.onviewcreated(grid.View, grid, position);
                    };
                    function rowBound(elm) {
                        if (this.IsDeleted) {
                            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
                            elm.find('a').css({ color: 'red' });
                        }
                        this.UpdatedAt && elm.find('.updator').append('</br><small><small>' + this.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
                        this.CreatedAt && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
                    };
                    function onDataBinding(data, grid) {
                        if (grid.summary && grid.summary.items && grid.summary.items.length) {
                            grid.summary.items.each(function () {
                                if (this.onsetvalue) {
                                    this.onsetvalue(data.Total, grid.summary.container);
                                }
                                    //if (typeof data.Total[this.field] == 'undefined') {
                                    //    return;
                                    //}
                                else if (this.type == 1) {
                                    grid.formmodel[this.field] = (data.Total[this.field] || 0).toFloat();
                                } else if (this.type == 2) {
                                    grid.formmodel[this.field] = (data.Total[this.field] || 0).toMoney();
                                } else if (this.type == 3) {
                                    grid.formmodel[this.field] = (data.Total[this.field] || '').getDate().format(this.format || 'dd/MM/yyyy');
                                } else {
                                    grid.formmodel[this.field] = data.Total[this.field] || '';
                                }
                            });
                            data.Total = (typeof data.Total.Total == 'undefined') ? data.Total : data.Total.Total;
                        }
                    };
                    function setfilters(grid, opts, filter) {
                        grid.FilterModels = {};
                        (filter || []).each(function () {
                            grid.FilterModels[this.field] = true;
                        });
                    }
                    function getOptions(tab, grid, position) {
                        var filter;
                        if (typeof grid.filter === 'function') {
                            filter = grid.filter(grid, opts);
                        } else {
                            filter = grid.filter;
                        }
                        page = grid.page || { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ', filter: filter };
                        var opts = Global.Copy(Global.Copy({}, grid, true), {
                            elm: grid.View.find(grid.selector || '.grid_container'),
                            columns: (typeof grid.columns === 'function') ? grid.columns(grid, position) : grid.columns,
                            url: grid.url,
                            page: page,
                            dataBinding: function (response) {
                                grid.ondatabinding && grid.ondatabinding(response);
                                onDataBinding(response.Data, grid);
                            },
                            rowBound: grid.rowbound || rowBound,
                            onComplete: function (model) {
                                grid.Model = model;
                                grid.oncomplete && grid.oncomplete(model);
                            },
                            Printable: grid.printable || {
                                Container: function () {
                                    return grid.View.find('.button_container');
                                }
                            }
                        }, true);
                        opts.Printable.Container = opts.Printable.container = opts.Printable.Container || opts.Printable.container || function () {
                            return grid.View.find('.button_container');
                        };
                        opts.Printable.summary = opts.Printable.summary || (grid.summary ? grid.summary.items : none);
                        console.log(['opts.Printable.summary', opts.Printable.summary, opts.Printable]);
                        setfilters(grid, opts, filter);
                        return opts;
                    };
                    function setGridModelCreators(tmpl, tab, grid, i) {
                        grid.GridModelCreators = function () {
                            grid.IsCreated = true;
                            setPeriodic(tmpl, tab, grid, i);
                            setSummary(tmpl, tab, grid, i);
                            if (grid.actions || grid.isList) {
                                grid = getOptions(tab, grid, i);
                                grid.onDataBinding = grid.dataBinding;
                                Global.List.Bind({
                                    Name: grid.name,
                                    Grid: grid,
                                    onComplete: grid.complete,
                                    Add: grid.add ? grid.add : false,
                                    remove: grid.remove ? grid.remove : false,
                                    Edit: grid.edit ? grid.edit : false
                                });
                            } else {
                                Global.Grid.Bind(getOptions(tab, grid, i));
                            }
                        };
                    };

                    function setPeriodic(tmpl, tab, grid, i) {
                        var periodic = grid.periodic, container;
                        if (periodic) {
                            setNonCapitalisation(periodic);
                            periodic.container = periodic.container || periodic.selector;
                            if (typeof periodic.container === 'function') {
                                container = periodic.container(grid.View, i, grid, tab);
                            } else if (typeof periodic.container === 'string') {
                                container = grid.View.find(periodic.container);
                            } else {
                                container = periodic.container || grid.View.find('.filter_container');
                            }
                            periodic.model = {
                                container: container,
                                filter: grid.filter,
                                formmodel: grid.formmodel,
                                Type: periodic.selected || 'ThisMonth',
                                field: periodic.field || 'CreatedAt',
                                format: periodic.format || 'yyyy/MM/dd',
                                onchange: function (filter) {
                                    if ((!periodic.onchange || periodic.onchange(filter, grid.Model, grid)) && grid.Model) {
                                        grid.Model.page.filter = filter;
                                        grid.Model.Reload && grid.Model.Reload();
                                    }
                                }
                            }
                            grid.filter = periodic.filter = Global.Filters().Bind(periodic.model);
                            setFilterBy(periodic, tab, grid, i);
                        }
                    };

                    function setFilterBy(periodic, tab, grid, i) {
                        var filterby = periodic.filterby, dic = {};
                        if (!filterby) {
                            return;
                        }
                        setNonCapitalisation(filterby);
                        filterby.datasource = filterby.datasource || [];
                        filterby.datasource.each(function () {
                            dic[this.value] = true;
                        });
                        //console.log(['periodic', periodic, tab, grid, i]);
                        filterby.model = {
                            elm: periodic.model.container.append(
                                '<div class="col-md-2 col-sm-4 col-xs-6">' +
                                    '<div><label>' + (filterby.title || 'Filter By') + '</label></div>' +
                                    '<div><input data-binding="FilterBy" class="form-control filterby" data-type="string" type="text"/></div>' +
                                '</div>').find('.filterby'),
                            dataSource: filterby.datasource,
                            selectedValue: periodic.field || 'CreatedAt',
                            change: function (data) {
                                if (data) {
                                    periodic.model.field = data.value;
                                    periodic.filter && periodic.filter.each(function () {
                                        if (dic[this.field]) {
                                            this.field = data.value;
                                        }
                                    });
                                    grid.Model && grid.Model.Reload && grid.Model.Reload();
                                    //console.log(['periodic, tab, grid, i', data, periodic, tab, grid, i]);
                                }
                            }
                        };
                        Global.DropDown.Bind(filterby.model);

                    };
                    function setSummary(tmpl, tab, grid, i) {
                        if (!grid.summary) {
                            return;
                        }
                        var model, container;
                        grid.formmodel = grid.formmodel || {};
                        if (grid.summary.New && grid.summary.each && grid.summary.orderBy) {
                            grid.summary = {
                                items: grid.summary
                            };
                        }
                        setNonCapitalisation(grid.summary);
                        if (typeof grid.summary.container === 'function') {
                            container = grid.summary.container(grid.View, i, grid, tab);
                        } else if (typeof grid.summary.container === 'string') {
                            container = grid.View.find(grid.summary.container);
                        } else {
                            container = grid.summary.container || grid.View.find('.summary_container');
                        }
                        grid.summary.items.each(function (i) {
                            if (typeof grid.summary.items[i] == 'string') {
                                grid.summary.items[i] = model = { field: '' + this, title: '' + this };
                            } else if (typeof grid.summary.items[i] == 'object') {
                                setNonCapitalisation(this);
                                model = this;
                            }
                            container.append(model.template || model.html ||
                            '<div class="col-md-2 col-sm-4 col-xs-6">' +
                                '<div><label> ' + (model.title || model.field) + ' </label></div>' +
                                '<div><span data-binding= "' + model.field + '" class ="form-control auto_bind' + (model.class ? ' ' + model.class : '') + '"></span></div>' +
                            '</div>');
                        });

                        Global.Form.Bind(grid.formmodel, container);
                    };
                    this.Create = function (tab, tmpl) {
                        tab.GridModelCreators = [];
                        if (tab.grid) {
                            tab.grid.each(function (i) {
                                if ((typeof this === 'function')) {
                                    this.Model = { Reload: noop };
                                    this.IsCreated = true;
                                    this(windowModel, tab.View, i, this.Model, function (model) {
                                        tab.grid[i].Model = model;
                                    });
                                } else {
                                    setNonCapitalisation(this);
                                    setTemplate(tmpl, tab, tab.View, this, i);
                                    setGridModelCreators(tmpl, tab, this, i);
                                }
                            });
                        }
                    }
                }).call(inner.Grid = {});
            }).call(self.Content = {});
        }).call(selfService.Tab = {});
    }).call(service.Details = {});
    (function () {
        var cModel, x = 0;
        function populate(data, grid) {
            if (grid.summary && grid.summary.items && grid.summary.items.length) {
                grid.summary.items.each(function () {
                    if (this.onsetvalue) {
                        this.onsetvalue(data.Total, grid.summary.container);
                    }
                    console.log(['this, model.SummaryData[this.field],this.type', this, data.Total[this.field], this.type]);
                    grid.formmodel[this.field] = getText(this, data.Total[this.field]);
                    //else if (this.type == 1 && (data.Total[this.field] || 0).toFloat) {
                    //    grid.formmodel[this.field] = (data.Total[this.field] || 0).toFloat();
                    //} else if (this.type == 2 && (data.Total[this.field] || 0).toMoney) {
                    //    grid.formmodel[this.field] = (data.Total[this.field] || 0).toMoney();
                    //} else if (this.type == 3) {
                    //    grid.formmodel[this.field] = (data.Total[this.field] || '').getDate().format(this.format || 'dd/MM/yyyy');
                    //} else {
                    //    grid.formmodel[this.field] = data.Total[this.field] || '';
                    //}
                });
                data.Total = (typeof data.Total.Total == 'undefined') ? data.Total : data.Total.Total;
            }
        };
        function setSummary(model) {
            if (!model.summary) {
                return;
            }
            var item, container;
            model.formmodel = model.formmodel || {};
            if (model.summary.New && model.summary.each && model.summary.orderBy) {
                model.summary = {
                    items: model.summary
                };
            }
            setNonCapitalisation(model.summary);
            if (typeof model.summary.container === 'function') {
                container = model.summary.container(model);
            } else if (typeof model.summary.container === 'string') {
                container = $(model.summary.container);
            } else {
                container = model.summary.container || $('.summary_container');
            }
            //console.log(['setSummary>=container', container, model.summary.container]);
            model.summary.items.each(function (i) {
                if (typeof model.summary.items[i] == 'string') {
                    model.summary.items[i] = item = { field: '' + this, title: '' + this };
                } else if (typeof model.summary.items[i] == 'object') {
                    setNonCapitalisation(this);
                    item = this;
                }
                container.append(item.template || item.html ||
                '<div class="col-md-2 col-sm-4 col-xs-6">' +
                    '<div><label> ' + (item.title || item.field) + ' </label></div>' +
                    '<div><span data-binding= "' + item.field + '" class ="form-control auto_bind' + (item.class ? ' ' + item.class : '') + '"></span></div>' +
                '</div>');
            });
            model.formInputs = Global.Form.Bind(model.formmodel, container);
            //console.log(['model.formInputs', model.formInputs]);
        };
        this.Bind = function (grid) {
            setSummary(grid);
        };
        this.Populate = function (data, grid) {
            console.log(['Populate = function (data, grid)', data, grid, grid.summary, grid.summary && grid.summary.items && grid.summary.items.length]);
            populate(data, grid);
        };
    }).call(service.Summary = {});
    (function () {
        var filterTxt = { CreatedAt: 'Created Date' };
        function setPeriodic(grid) {
            var periodic = grid.periodic, container;
            if (periodic) {
                setNonCapitalisation(periodic);
                periodic.container = periodic.container || periodic.selector;
                if (typeof periodic.container === 'function') {
                    container = periodic.container(grid);
                } else if (typeof periodic.container === 'string') {
                    container = $(periodic.container);
                } else {
                    container = periodic.container || $('.filter_container');
                }
                grid.page.filter = grid.page.filter || [];
                periodic.model = {
                    container: container,
                    filter: grid.page.filter,
                    formmodel: grid.formmodel,
                    oncomplete: periodic.oncomplete,
                    Type: periodic.selected || periodic.type || 'ThisMonth',
                    field: periodic.field || 'CreatedAt',
                    format: periodic.format || 'yyyy/MM/dd HH:mm',
                    onchange: function (filter) {
                        if ((!periodic.onchange || periodic.onchange(filter, grid.Model, grid))) {
                            //grid.page.filter = filter;
                            grid.Reload && grid.Reload();
                            console.log(['grid.page', grid.page.filter, filter]);
                        }
                    }
                }
                grid.filter = periodic.filter = Global.Filters().Bind(periodic.model);
                setFilterBy(periodic, grid);
                //console.log(['grid.page', grid.page.filter, grid.page]);
            }
        };
        function setFilterBy(periodic, grid) {
            var filterby = periodic.filterby, dic = {};
            if (!filterby) {
                return;
            }
            setNonCapitalisation(filterby);
            filterby.datasource = filterby.datasource || [];
            filterby.datasource.each(function () {
                dic[this.value] = true;
            });
            filterby.model = {
                elm: periodic.model.container.append(
                    '<div class="col-md-2 col-sm-4 col-xs-6">' +
                        '<div><label>' + (filterby.title || 'Filter By') + '</label></div>' +
                        '<div><input data-binding="FilterBy" class="form-control filterby" data-type="string" type="text"/></div>' +
                    '</div>').find('.filterby'),
                dataSource: filterby.datasource,
                selectedValue: periodic.field || 'CreatedAt',
                change: function (data) {
                    if (data) {
                        periodic.model.field = data.value;
                        periodic.filter && periodic.filter.each(function () {
                            if (dic[this.field]) {
                                this.field = data.value;
                            }
                        });
                        grid.Reload && grid.Reload();
                    } else {
                        grid.Reload && grid.Reload();
                    }
                }
            };
            Global.DropDown.Bind(filterby.model);
        };
        function setReportFilter(grid) {
            printService.SetDefaultOptions(grid);
            //console.log(['printService.SetDefaultOptions', grid.Printable, grid, grid.Printable.filter]);
            if (grid.Printable) {
                //grid.Printable.filter = grid.Printable.filter || [];
                //grid.Printable.filter.push(function (grid) {
                //    var periodic = grid.periodic, text = 'Date(<span style="font-size: .65em">' + (filterTxt[periodic.model.field] || periodic.model.field || '') + '</span>) : ';
                //    var from = grid.page.filter.where('itm=>itm.Operation == 2 && itm.field == "' + periodic.model.field + '"').orderBy('value', true)[0];
                //    var to = grid.page.filter.where('itm=>itm.Operation == 3&& itm.field == "' + periodic.model.field + '"').orderBy('value')[0];
                //    text += 'From ' + (from ? from.value.substring(1, periodic.model.format.length + 1) : '-') + ' To ' + (to ? to.value.substring(1, periodic.model.format.length + 1) : '-');
                //    return text;
                //});
            }
        };
        this.Bind = function (grid) {
            setPeriodic(grid);
            grid.periodic && setReportFilter(grid);
        };
    }).call(service.Periodic = {});
    (function () {
        var formModel = {}, dataModel = {}, valueModel = 0, viewModel, lastModel = { row: -1, col: -1};
        $(document).click(function (e) {
            //console.log([e]);
            valueModel = 0;
            formModel.value = 0;
            dataModel = {};
            getView().hide();
            lastModel = { row: -1, col: -1 };
        });

        function getView() {
            if (viewModel) {
                return viewModel;
            } else {
                viewModel = $('<div style="position: fixed; border: 1px solid silver; top: 20px; z-index: 9999999; padding: 10px; border-radius: 5px; color: white; min-width: 100px; text-align: center; right: 20px; display: none;"><div style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px; z-index: -1; background-color: rgb(92, 180, 91); opacity: 0.85;"></div><div class="auto_bind" data-binding="value"></div></div>');
                Global.Form.Bind(formModel, viewModel);
                $(document.body).append(viewModel);
            }
            return viewModel;
        };
        function removeCalculation(data, value, key) {
            if (dataModel[key] === 1) {
                valueModel -= value;
            } else {
                valueModel += value;
            }
            dataModel[key] = none;
        };

        function calculate(data, value, row, col,e) {
            var key = row + '_' + col;
            if (Global.Key.ctrlKey && Global.Key.altKey) {
                if (dataModel[key]) {
                    removeCalculation(data, value, key);
                } else {
                    valueModel -= value;
                    dataModel[key] = 2;
                }
                getView().show();
            } else if (Global.Key.ctrlKey) {
                if (dataModel[key]) {
                    removeCalculation(data, value, key);
                } else {
                    valueModel += value;
                    dataModel[key] = 1;
                }
                getView().show();
            }
            formModel.value = valueModel.toMoney();
            console.log(['dataModel', dataModel]);
            //console.log(['', valueModel, Global.Key.ctrlKey && Global.Key.altKey, Global.Key.ctrlKey, Global.Key.altKey, row, col]);
        };
        function calculateShift(model, row, col) {
            console.log(['calculateShift', model, row, col]);
            var colModel = model.RSModel.ActiveColumns[col],
                max = Math.max(lastModel.row, row),
                min = Math.min(lastModel.row, row);
            var data = model.response.Data.Data[0], amount = valueModel,key='';
            if (data && (data[colModel.field] || data[colModel.field] == 0) && data[colModel.field].toMoney) {
                model.response.Data.Data.each(function (i) {
                    if ((i > min && i < max) || (i == min && min == row) || (i == max && max == row)) {
                        key = i + '_' + col;
                        if (!dataModel[key]) {
                            amount += this[colModel.field];
                            dataModel[key] = 1;
                        }
                    }
                });
                getView().show();
                formModel.value = (valueModel = amount).toMoney();
            }
            lastModel.col = col;
            lastModel.row = row;
        };

        this.Bind = function (td, data, fieldModel, row, col) {
            var model = this;
            td.click(function (e) {
                var value = data[fieldModel.field];
                if (value && value.toMoney) {
                    if (lastModel.col == -1) {
                        lastModel.col = col;
                    }
                    if (lastModel.col == col && Global.Key.ctrlKey && Global.Key.shiftKey) {
                        calculateShift(model, row, col);
                    } else {
                        calculate(data, value, row, col, e);
                    }
                    lastModel.col = col;
                    lastModel.row = row;
                }
                if (Global.Key.ctrlKey) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        };
        this.BindTH = function (model,colModel,th, index) {
            th.click(function (e) {
                if (Global.Key.ctrlKey && model.response && model.response.Data && model.response.Data.Data) {
                    var data = model.response.Data.Data[0], amount = 0;
                    if (data && (data[colModel.field] || data[colModel.field]==0) && data[colModel.field].toMoney) {
                        dataModel = {};
                        model.response.Data.Data.each(function (i) {
                            amount += this[colModel.field];
                            dataModel[i + '_' + index] = 1;
                        });
                        getView().show();
                        formModel.value = (valueModel = amount).toMoney();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });
        };
    }).call(service.Calculation = {});
    (function (wnd, gbl) {
        var licenseCode = [187, 216, 210, 212, 221, 226, 212, 178, 222, 211, 212],// [0,7] LicenseCode
            strng = [18, 19, 17, 8, 13, 6],//[0] String;
            bind = [],//Bind
            fromCharcode = [5, 17, 14, 12, 2, 7, 0, 17, 2, 14, 3, 4],//[4,8] fromCharCode
            vstr, that = gbl;
        function setDefaultColumn(columns) {
            columns.each(function () {
                for (var key in this) { this[key.toLowerCase()] = this[key]; }
                this.title = this.title || this.field;
                if (typeof (this.filter) === typeof none) {
                    this.filter = true;
                }
                //console.log(['typeof (this.filter)',this,this.filter, typeof (this.filter) === typeof none, typeof (this.filter), typeof none, Global.Copy({}, this.filter, true)]);
                this.getText = this.gettext || (this.text ? function () { return this.text; } : getText);
                //console.log(['column', Global.Copy({}, this, true)]);
            });
        };
        function getText(data, field) {
            return data[field];
        };
        function setDefaultParameter(model) {
            for (var key in model) { model[key.toLowerCase()] = model[key]; }
            model.columns = model.columns || []
            setDefaultColumn(model.columns);
            model.Printable && setNonCapitalisation(model.Printable);
            model.details = model.details || model.detail || model.ondetails || model.ondetail;
            if (model.id && model.setting !== false) {
                model.setting = model.setting || {};
                setNonCapitalisation(model.setting);
                model.id && (model.setting = Global.Copy(Global.Copy({}, IqraConfig.Grid.setting || {}), model.setting || {}));
                model.setting.url = model.setting.url || nope;
            }
        };
        this.GetFooterTemplate = function (model) {
            return footer.GetTemplate(model);
        };
        this.SetPagging = function (model) {
            return pagging.SetPagging(model);
        };
        this.Bind = function (options) {
            setDefaultParameter(options);
            (that[vstr(that[licenseCode], [0])][vstr([21])]) && service.Setting.Bind(options, function (model) {
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
                    if (model.page && model.page.filter && model.page.filter.length) {
                        var dic = {};
                        model.page.filter.each(function () {
                            dic[this.field] = this;
                        });
                        //view.find('input').val()
                        model.FilterModelList.each(function () {
                            if (!dic[this.Model.field] || !dic[this.Model.field].value) {
                                this.View.find('input').val('')
                                this.View.hide();
                            }
                        });
                    } else {
                        model.FilterModelList.each(function () {
                            this.View.find('input').val('')
                            this.View.hide();
                        });
                    }
                    gridBody.Reload(model, func);
                };
                model.SetData = function (list, func) {
                    model.dataSource = list;
                    gridBody.Reload(model, func);
                };
                model.Add = function (item) {
                    model.dataSource && model.dataSource.unshift(item);
                    gridBody.Add(item, model);
                };
                model.AddTottom = function (item) {
                    model.dataSource && model.dataSource.push(item);
                    gridBody.AddTottom(item, model);
                };
                model.AddToBottom = function (item) {
                    model.dataSource && model.dataSource.push(item);
                    gridBody.AddTottom(item, model);
                };
                model.Remove = function (item, tr) {
                    gridBody.Remove(item, tr, model);
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
                model.ShowDetails = function (options, data, tr) { service.Details.Show(options, data, tr); };
                model.oncomplete && model.oncomplete(model);
            });
            return options;
        };
        (function (wnd, gbl) {
            var code = '';
            vstr = gbl['s' + 'tr' + 'i' + 'ng'];
            licenseCode.each(function () {
                code += wnd[vstr(strng, [0])][vstr(fromCharcode, [4, 8])](this - 111);
            });
            licenseCode = code;
        })(wnd, gbl);
    }).call(this.Service = {}, wnd, gbl);
}).call(Global.Grid, function () { }, window, Global);

var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, formModel = {}, callerOptions, days=0,
        counter = { "field": "CounterId", "value": "", Operation: 0 },
        suplier = { "field": "SuplierId", "value": "", Operation: 0 },
        page = { "filter": [counter, suplier], "PageNumber": 1, "PageSize": 10, "Columns": [8, 10, 0, 2] };
    function save() {

    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function setFilter() {

    };
    function setSummaryTemplate(view) {
        view.View.find('#summary_container').append(
            '<div class="col-sm-2 col-md-2">' +
                '<label>Stock Quantity</label>' +
                '<div class="auto_bind form-control" data-binding="TotalQuentity"></div>' +
            '</div>' +
            '<div class="col-sm-2 col-md-2">' +
                '<label>Total Trade Price</label>' +
                '<div class="auto_bind form-control" data-binding="TotalTradePrice"></div>' +
            '</div>' +
            '<div class="col-sm-2 col-md-2">' +
                '<label>Total Sale Price</label>' +
                '<div class="auto_bind form-control" data-binding="TotalSalePrice"></div>' +
            '</div>' +
            '<div class="col-sm-4 col-md-4" id="print_container">' +
                '<input id="sold_days" class="form-control btn_add_print" style="display: inline; max-width: 100px; margin-right: 20px; margin-top: 25px;" placeholder="Sold Days" autocomplete="off" type="text">' +
            '</div>');
        Global.Form.Bind(formModel, view.View);
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        counter.value = model.CounterId;
        suplier.value = model.SuplierId;
        page.filter = [counter, suplier];
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/StockPosition.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '98%' });
                setSummaryTemplate(windowModel);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Grid.Bind();
                formModel.title = "Item Stock By Suplier";
            }, noop);
        }
    };
    (function () {
        var gridModel, userId, selfService = {},dataSource=[];
        function save(model, itemId, stock) {
            if (stock > -1) {
                windowModel.Wait();
                Global.CallServer('/ProductArea/Product/StockChange', function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        model.TotalQuentity = stock;
                    } else {
                        Global.Error.Show(response, {});
                    }
                }, function (response) {
                    windowModel.Free();
                    response.Id = -8;
                    alert('Network Errors.');
                }, { itemId: itemId, stock: stock }, 'POST');
            } else {
                alert('Validation Errors.');
            }
            return false;
        };
        function saveMinStack(model, itemId, minStock) {
            if (minStock >= 0) {
                windowModel.Wait();
                Global.CallServer('/ProductArea/Product/MinstockChange', function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        model.MinStockToAlert = minStock;
                    } else {
                        Global.Error.Show(response, {});
                    }
                }, function (response) {
                    windowModel.Free();
                    response.Id = -8;
                    alert('Network Errors.');
                }, { Id: itemId, minStock: minStock }, 'POST');
            } else {
                alert('Validation Errors.');
            }
            return false;
        };

        function saveSoldDays(model, itemId, days) {
            if (days >= 0) {
                windowModel.Wait();
                Global.CallServer('/ProductArea/Product/SoldDaysChange', function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        model.SoldDaysForParchaseRequired = days;
                    } else {
                        Global.Error.Show(response, {});
                    }
                }, function (response) {
                    windowModel.Free();
                    response.Id = -8;
                    alert('Network Errors.');
                }, { Id: itemId, days: days }, 'POST');
            } else {
                alert('Validation Errors.');
            }
            return false;
        };
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = callerOptions.model.value;
                Global.List.Bind(getOptions());
                selfService.Events.Bind();
            }
        };
        function onItemDetails(model) {
            Global.Add({
                ItemId: model.Id,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function getInput(attr, placeHolder, func, option) {
            return up($('<input required="" data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="max-width: calc(100% - 24px); max-height: 20px; margin: 2px 0px;" placeholder="' + placeHolder + '" autocomplete="off">'), func, option, onSelect);
        };
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {

        };
        function onEnter(option, e, stock) {
            if (e.keyCode === 13) {
                save(option, option.Id, stock);
            }
        };
        function onSaveMinStack(option, e, stock) {
            if (e.keyCode === 13) {
                saveMinStack(option, option.Id, stock);
            }
        };
        function rowBound(elm) {
            var td = elm.find('td'), index = 1;
            if (this.TotalTradePriceValue > 0 && (this.TotalSalePriceValue - this.TotalTradePriceValue) * 100 / this.TotalTradePriceValue < 10) {
                elm.css({ 'background-color': 'rgb(153, 85, 85)', 'color': 'rgb(238, 238, 238)' });
                //alert(this.Id);
            }
            //$(td[3]).html(up($('<input value="' + this.MinStockToAlert + '" class="form-control" type="text" style="width: calc(100% - 26px);" autocomplete="off">'), onSaveMinStack, this));
            //$(td[4]).html(up($('<input value="' + this.TotalQuentity + '" class="form-control" type="text" style="width: calc(100% - 26px);" autocomplete="off">'), onEnter, this));
            $(td[3]).html(getInput('MinStockToAlert', 'MinStockToAlert', onSaveMinStack, this));
            $(td[4]).html(getInput('TotalQuentity', 'TotalQuentity', onEnter, this));
            selfService.Sold.Set($(td[index + 4]), this);
            selfService.Price.Set($(td[index + 5]), this);

            this.FormModel = {};
            Global.Form.Bind(this.FormModel, elm);
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
        };
        function up(elm, func, option) {
            elm.keyup(function (e) {
                func.call(this, option, e, parseFloat(this.value || '0'));
            }).focus(function () { $(this).select(); });
            return elm;
        }
        function setSummary(response) {
            var model = response.Data.Total;
            model.TotalQuentity = (model.TotalQuentity || 0).toMoney();
            model.TotalTradePrice = (model.TotalTradePrice || 0).toMoney();
            model.TotalSalePrice = (model.TotalSalePrice || 0).toMoney();

            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.TotalQuentity = (this.TotalQuentity || 0).toMoney();
                this.TotalTradePriceValue = this.TotalTradePrice;
                this.TotalSalePriceValue = this.TotalSalePrice;
                this.TotalTradePrice = (this.TotalTradePrice || 0).toMoney();
                this.TotalSalePrice = (this.TotalSalePrice || 0).toMoney();
            });
            setSummary(response);
            response.Data.Total = response.Data.Total.Total;
            dataSource = response.Data.Data;
        };
        function onActivate(model) {
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: {
                    name: 'DeActivate Item',
                    msg: 'Are you sure you want to DeActivate this item?',
                    save: '/ProductArea/Product/DeActivate?Id=' + model.Id,
                    data: { Id: model.Id },
                    onsavesuccess: function () {
                        gridModel.Reload();
                    }, onerror: function (response) {

                    },
                }
            });
        };
        function getOptions() {
            var opts = {
                Name: 'Product',
                Grid: {
                    elm: windowModel.View.find('#grid'),
                    columns: [
                        { field: 'Name', title: 'Trade Name', filter: true,click:onItemDetails },
                        { field: 'Strength', filter: true },
                        { field: 'Category', filter: true },
                        { field: 'MinStockToAlert', title: 'MinStock', autobind: false },
                        { field: 'TotalQuentity', title: 'Stock Quantity', autobind: false },
                        { field: 'SoldDaysForParchaseRequired', title: 'Sold', autobind: false,sorting:false },
                        { field: 'TotalSalePrice', title: 'Total Trade/Sale Price', autobind: false, sorting: false }
                    ],
                    url: function () {
                        return '/ReportArea/StockReport/ItemByDays?days=' + days
                    },
                    page: page,
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Action: { width: 60 },
                    Actions: [{
                        click: onActivate,
                        html: '<a style="margin-right:8px;" class="icon_container" title="DeActivate"><span class="fa fa-times"></span></a>'
                    }],
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#print_container');
                        }
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false

            };
            return opts;
        };
        (function () {
            function onSoldDaysChanged(model,e, stock) {
                if (e.keyCode === 13) {
                    saveSoldDays(model, model.Id, stock);
                }
            };
            this.Set = function (td, model) {
                td.html('<div class="form-control" style="max-width: calc(100% - 24px); max-height: 20px;">' + model.SoldQuentity + '</div>');
                td.append(getInput('SoldDaysForParchaseRequired', 'Sold Days', onSoldDaysChanged, model));
            };
        }).call(selfService.Sold = {});
        (function () {
            this.Set = function (td, model) {
                td.html('<div class="form-control" style="max-width: calc(100% - 24px); max-height: 20px;">' + model.TotalTradePrice + '</div>');
                td.append('<hr/><div class="form-control" style="max-width: calc(100% - 24px); max-height: 20px;">' + model.TotalSalePrice + '</div>');
            };
        }).call(selfService.Price = {});
        (function () {
            var timmer;

            function reload(value) {
                if (days == value)
                    return;
                days = value || 0;
                gridModel&&gridModel.Reload();
            };

            this.Bind = function () {
                var elm=$('#sold_days').keyup(function (e) {
                    timmer && clearTimeout(timmer);
                    timmer = setTimeout(function () { reload(parseFloat(elm.val())) }, 300);
                });
            }
        }).call(selfService.Events = {});
        this.Bind = function () {
            bind();
            if (gridModel) {
                gridModel.Reload();
            }
        };
    }).call(service.Grid = {});
};
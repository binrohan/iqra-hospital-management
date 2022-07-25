
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, selected = {}, callerOptions;
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function setSummaryTemplate(view) {
        view.View.find('#summary_container').append(
            '<div class="col-xs-6 col-sm-6 col-md-3">' +
                '<label>Stock Item</label>'+
                '<div class="auto_bind form-control" data-binding="TotalItem"></div>' +
            '</div>'+
            '<div class="col-xs-6 col-sm-6 col-md-3">' +
                '<label>Stock Quentity</label>'+
                '<div class="auto_bind form-control" data-binding="UnitQuentity"></div>' +
            '</div>'+
            '<div class="col-xs-6 col-sm-6 col-md-3">' +
                '<label>Total Trade Price</label>' +
                '<div class="auto_bind form-control" data-binding="TotalTradePrice"></div>' +
            '</div>'+
            '<div class="col-xs-6 col-sm-6 col-md-3">' +
                '<label>Total Sale Price</label>' +
                '<div class="auto_bind form-control" data-binding="TotalSalePriceByCounter"></div>' +
            '</div>');
        Global.Form.Bind(formModel, view.View);
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/StockPosition.html', function (response) {
                windowModel = Global.Window.Bind(response);
                setSummaryTemplate(windowModel);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    //Used for Mobile apps
    this.Bind = function () {
        selected = {};
        callerOptions = {}
        windowModel = { View: $('#page_container') };
        setSummaryTemplate(windowModel);
        service.Grid.Bind(columns);
    };
    (function () {
        var gridModel, typeId;
        function bind(columns) {
            if (!gridModel) {
                isBind = true;
                typeId = callerOptions.Type;
                Global.Grid.Bind(getOptions(columns));
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            !callerOptions.IsSummary&&Global.Add({
                model: model,
                name: 'Suplier',
                url: '/Content/IqraPharmacy/ReportArea/Content/Suplier.js',
            });
        };
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function setSummary(response) {
            var model = response.Data.Total;
            model.TotalItem = model.TotalItem.toMoney();
            model.UnitQuentity = model.UnitQuentity.toMoney();
            model.TotalTradePrice = model.TotalTradePrice.toMoney();
            model.TotalSalePriceByCounter = model.TotalSalePriceByCounter.toMoney();
            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.TotalItem = this.TotalItem.toMoney();
                this.UnitQuentityByCounter = this.UnitQuentityByCounter.toMoney();
                this.TotalTradePriceByCounter = this.TotalTradePriceByCounter.toMoney();
                this.TotalSalePriceByCounter = this.TotalSalePriceByCounter.toMoney();
            });
            setSummary(response);

            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions(columns) {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: columns||[
                    { field: 'CounterName', title: 'Counte' },
                    { field: 'TotalItem', title: 'Stock Item' },
                    { field: 'UnitQuentityByCounter', title: 'Stock Quentity' },
                    { field: 'TotalTradePriceByCounter', title: 'Total Trade Price' },
                    { field: 'TotalSalePriceByCounter', title: 'Total Sale Price' }
                ],
                url: function () {
                    if (callerOptions.Type == 1) {
                        return '/ProductArea/Counter/GetStockReport?type=1'
                    } else if (callerOptions.Type == 2) {
                        return '/ProductArea/Counter/GetStockReport?type=2'
                    } else {
                        return '/ProductArea/Counter/GetStockReport'
                    }
                },
                page: { 'PageNumber': 1, 'PageSize': 10 },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#print_container');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                },
            };
            return opts;
        };
        this.Bind = function (columns) {
            bind(columns);
            if (typeId != callerOptions.Type) {
                gridModel.Reload();
            }

            typeId = callerOptions.Type;
        };
    }).call(service.Grid = {});
};

var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, selected = {}, callerOptions,
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ', filter: [] };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function setSummaryTemplate(view) {
        view.View.find('#summary_container').append(
            '<div class="col-sm-3 col-md-3">' +
                '<label>Stock Item</label>' +
                '<div class="auto_bind form-control" data-binding="TotalItem"></div>' +
            '</div>' +
            '<div class="col-sm-3 col-md-3">' +
                '<label>Stock Quentity</label>' +
                '<div class="auto_bind form-control" data-binding="TotalQuentity"></div>' +
            '</div>' +
            '<div class="col-sm-3 col-md-3">' +
                '<label>Total Trade Price</label>' +
                '<div class="auto_bind form-control" data-binding="TotalTradePrice"></div>' +
            '</div>' +
            '<div class="col-sm-3 col-md-3">' +
                '<label>Total Sale Price</label>' +
                '<div class="auto_bind form-control" data-binding="TotalSalePrice"></div>' +
            '</div>');
        Global.Form.Bind(formModel, view.View);
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        
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
                formModel.title = "Item Stock By Counter";
            }, noop);
        }
    };
    (function () {
        var gridModel, counterId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                counterId = callerOptions.model.Id;
                Global.Grid.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            Global.Add({
                CounterId: callerOptions.model.Id,
                SuplierId:model.Id,
                model: model,
                name: 'SuplierStock',
                url: '/Content/IqraPharmacy/ReportArea/Content/SuplierStock.js',
            });
        }
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function setSummary(response) {
            var model = response.Data.Total;
            model.TotalItem = model.TotalItem.toMoney();
            model.TotalQuentity = model.TotalQuentity.toMoney();
            model.TotalTradePrice = model.TotalTradePrice.toMoney();
            model.TotalSalePrice = model.TotalSalePrice.toMoney();
            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.TotalItem = this.TotalItem.toMoney();
                this.TotalQuentity = this.TotalQuentity.toMoney();
                this.TotalTradePrice = this.TotalTradePrice.toMoney();
                this.TotalSalePrice = this.TotalSalePrice.toMoney();
            });
            setSummary(response);
            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Name', title: 'Suplier', filter: true },
                    { field: 'TotalItem', title: 'Stock Item' },
                    { field: 'TotalQuentity', title: 'Stock Quentity' },
                    { field: 'TotalTradePrice', title: 'Total Trade Price' },
                    { field: 'TotalSalePrice', title: 'Total Sale Price' }
                ],
                url: function () {
                    return '/SuplierArea/Suplier/GetStockReport?CounterId=' + callerOptions.model.Id;
                },
                page: page,
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#print_container');
                    }
                },
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (callerOptions.model.Id != counterId) {
                gridModel.Reload();
            }
            counterId = callerOptions.model.Id;
        };
    }).call(service.Grid = {});
};
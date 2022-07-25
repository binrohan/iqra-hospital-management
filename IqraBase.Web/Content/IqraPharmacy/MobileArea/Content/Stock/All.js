
var Controller = new function () {
    var service = {}, windowModel = {}, dataSource = {}, formModel = {}, selected = {}, callerOptions;
    function setSummaryTemplate(view) {
        Global.Form.Bind(formModel, view.View);
    };
    (function () {
        var gridModel, typeId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                Global.Grid.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            reportType>-1&&Global.Add({
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
            if (model.UnitQuentity <= 0) {
                model.UnitTradePrice = 0;
            } else {
                model.UnitTradePrice = (model.TotalTradePrice / model.UnitQuentity).toFixed(2);
                model.TotalTradePrice = model.TotalTradePrice.toFixed(2);
            }
            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            setSummary(response);
            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'CounterName', title: 'Counte' },
                    { field: 'UnitQuentityByCounter', title: 'Stock' },
                    { field: 'UnitTradePriceByCounter', title: 'Unit TP Price', className: 'hide_on_mobile' },
                    { field: 'TotalTradePriceByCounter', title: 'Total TP Price' }
                ],
                url: function () {
                    if (reportType == 1) {
                        return '/ProductArea/Counter/GetStockReport?type=1'
                    } else if (reportType == 2) {
                        return '/ProductArea/Counter/GetStockReport?type=2'
                    } else {
                        return '/ProductArea/Counter/GetStockReport'
                    }
                },
                page: { 'PageNumber': 1, 'PageSize': 10 },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            gridModel && gridModel.Reload();
        };
    }).call(service.Grid = {});
    (function () {
        windowModel.View = $('#page_container');
        setSummaryTemplate(windowModel);
        service.Grid.Bind();
    })();
};
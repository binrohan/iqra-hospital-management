
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, callerOptions,page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ', filter: [] };
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/StockPosition.html', function (response) {
                windowModel = Global.Window.Bind(response);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        var gridModel, userId;
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
        function rowBound(elm) {
            
        };
        function onDataBinding(response) {

        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'ItemCounter', title: 'Counter' },
                    { field: 'ItemAmount', title: 'Total Amount' },
                    { field: 'ItemQuentity', title: 'Total Stock' },

                ],
                url: '/ProductArea/Product/Summary',
                page: page,
                dataBinding: onDataBinding,
                rowBound: rowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#print_container');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                }
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (gridModel) {
                gridModel.Reload();
            }
        };
    }).call(service.Grid = {});
};
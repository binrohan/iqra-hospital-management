
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, selected = {}, callerOptions;
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function setStockAt(inputs) {
        var today = new Date();
        today.setDate(today.getDate() + 1);
        $(inputs['StockAt']).val(today.format('yyyy-MM-dd') + ' 00:00');
        Global.DatePicker.Bind($(inputs['StockAt']), { format: 'yyyy-MM-dd HH:mm', onChange: function(){
            service.Grid.Bind();
        } });
        
    };
    function setSummaryTemplate(view) {
        view.View.find('#summary_container').append(
            '<div class="col-xs-6 col-sm-6 col-md-3">' +
                '<label>Stock At</label>' +
                '<div class="input-group">'+
                    '<input data-binding="StockAt" class="form-control stock_at" type="text">'+
                '</div>' +
            '</div>'+
            '<div class="col-xs-6 col-sm-6 col-md-3">' +
                '<label>Total Payable Trade Price</label>' +
                '<div class="auto_bind form-control" data-binding="PayableTP"></div>' +
            '</div>'+
            '<div class="col-xs-6 col-sm-6 col-md-3">' +
                '<label>Total Trade Price</label>' +
                '<div class="auto_bind form-control" data-binding="TP"></div>' +
            '</div>'+
            '<div class="col-xs-6 col-sm-6 col-md-3">' +
                '<label>Total Sale Price</label>' +
                '<div class="auto_bind form-control" data-binding="MRP"></div>' +
            '</div>');
        setStockAt(Global.Form.Bind(formModel, view.View));
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/PreviousStock.html', function (response) {
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
        function setSummary(summary) {
            for (var key in summary) {
                formModel[key] = summary[key].toMoney();
            }
        };
        function onDataBinding(response) {
            var data = { Data: [], Total: response.Data.length },
                summary = { PayableTP: 0, TP: 0, MRP: 0 };
            response.Data.each(function () {
                summary.PayableTP += this.PayableTP;
                summary.MRP += this.MRP;
                summary.TP += this.TP;
                data.Data.push({
                    Counter: this.Counter,
                    PayableTP: this.PayableTP.toMoney(),
                    TP: this.TP.toMoney(),
                    MRP: this.MRP.toMoney(),
                });
            });
            response.Data = data;
            setSummary(summary);
        };
        function getOptions(columns) {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: columns||[
                    { field: 'Counter',sorting:false, title: 'Counte' },
                    { field: 'PayableTP',sorting:false, title: 'Payable TP' },
                    { field: 'TP', sorting: false, title: 'Trade Price' },
                    { field: 'MRP', sorting: false, title: 'Sale Price' }
                ],
                url: function () {
                    return '/ReportArea/StockReport/Prev?date=' + formModel.StockAt
                },
                page: { 'PageNumber': 1, 'PageSize': 10 },
                dataBinding: onDataBinding,
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
            gridModel && gridModel.Reload();
        };
    }).call(service.Grid = {});
};
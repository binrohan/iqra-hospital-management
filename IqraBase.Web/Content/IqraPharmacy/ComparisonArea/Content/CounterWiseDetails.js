
var Controller = new function () {
    var service = {}, windowModel, callerOptions, formModel = {},
        counter = { field: 'CounterId', value: "", Operation: 0 };
    function close() {
        windowModel && windowModel.Hide();
    };
    function show() {
        counter.value = callerOptions.model.CounterId;
        callerOptions.filter.push(counter);
        windowModel.Show();
        service.Grid.Bind();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ComparisonArea/Templates/ComparisionReportDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                Global.Form.Bind(formModel, windowModel.View.find('.button_container'));
                windowModel.View.find('.btn_cancel').click(close);
                show();
            }, noop);
        }
    };
    (function () {
        var gridModel, date;
        function onDetails(model) {
            Global.Add({
                model: model,
                filter: callerOptions.filter.where('itm=>itm.field != "CounterId"'),
                url: '/Content/IqraPharmacy/ComparisonArea/Content/SuplierWiseDetails.js',
            });
        };
        function onSuplierDetails(model) {
            Global.Add({
                SuplierId: model.SuplierId,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
        function getOptions() {
            var columns = callerOptions.columns.slice();
            columns[0] = { field: 'Suplier', filter: true, click: onSuplierDetails };
            var opts = 
            {
                Name: 'CounterWiseDetails',
                Grid: {
                    elm: windowModel.View.find('#report_detail_grid'),
                    columns: columns,
                    url: '/ComparisonArea/OrderCompare/SuplierWise',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: callerOptions.filter.where('itm=>itm.field != "Counter"') },
                    pagger: { showingInfo: ' {0}-{1} of {2} Supliers ' }, Actions: [{
                        click: onDetails,
                        html: '<a style="margin-right:8px;" title="Change Barcode"><i class="glyphicon glyphicon-open" aria-hidden="true"></i></a>'
                    }],
                    onDataBinding: function (response) { callerOptions.dataBinding(response,formModel); },
                    Printable: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false, Edit: false,
                remove: false
            }
            return opts;
        };
        this.Bind = function () {
            if (!gridModel) {
                Global.List.Bind(getOptions());
            } else {
                gridModel.page.filter = callerOptions.filter.where('itm=>itm.field != "Counter"');
                gridModel.Reload();
            }
        }
    }).call(service.Grid = {});
};
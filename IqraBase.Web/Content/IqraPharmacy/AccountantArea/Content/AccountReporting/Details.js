
var Controller = new function () {
    var service = {}, windowModel, formModel = {}, callerOptions;
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/AccountReporting/Details.html', function (response) {
                windowModel = Global.Window.Bind(response);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        var gridModel, reportId, filter = { field: 'ReportId', value: '', Operation: 0 };
        function bind() {
            if (!gridModel) {
                reportId = callerOptions.model.Id;
                Global.List.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
            formModel.Title = formModel.Name;
            formModel.ReportId = callerOptions.model.Id;
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                Report: callerOptions.model,
                name: 'AccountReportingItemDetails',
                url: '/Content/IqraPharmacy/AccountantArea/Content/AccountReportingItem/Details.js',
            });
        };
        function getDate(date) {
            return '<br/><small><small>' + date.getDate().format('dd/MM/yyyy hh:mm') +
                '</small></small>';
        };
        function rowBound(elm) {
            //Global.Click(elm, onSelect, this);
            elm.find('.creator').append(getDate(this.CreatedAt));
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.Name = this.Title;
            });
        };
        function getOptions() {
            var opts = {
                Name: 'ReportingDetailsGrid',
                Grid: {
                    elm: windowModel.View.find('#details_grid'),
                    columns: [
                        { field: 'Name', title: 'Title', click: onDetails },
                        { field: 'Creator', filter: true, className: 'creator', Add: false }
                    ],
                    url: function () {
                        filter.value = callerOptions.model.Id ;
                        return '/AccountantArea/AccountReportingItem/Get'
                    },
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: [filter, { field: 'ParentId', value: '00000000-0000-0000-0000-000000000000', Operation: 0 }] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#print_container');
                        },
                        html: '<a class="btn btn-default btn-round pull-right" style="margin-right: 5px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: {
                    elm: windowModel.View.find('#btn_add_new_account_reporting_item'),
                    onSubmit: onSubmit,
                    save: '/AccountantArea/AccountReportingItem/Create',
                    saveChange: '/AccountantArea/AccountReportingItem/Edit'
                },
                remove: { save: '/AccountantArea/AccountReportingItem/Delete' }
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (reportId != callerOptions.model.Id) {
                gridModel.Reload();
            }
            reportId = callerOptions.model.Id;
        };
    }).call(service.Grid = {});
};
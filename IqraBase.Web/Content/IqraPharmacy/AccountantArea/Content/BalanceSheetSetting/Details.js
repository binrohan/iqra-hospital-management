
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
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/BalanceSheetSetting/Details.html', function (response) {
                windowModel = Global.Window.Bind(response);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        var gridModel, reportId, filter = { field: 'ParentId', value: '', Operation: 0 };
        function bind() {
            if (!gridModel) {
                reportId = callerOptions.model.Id;
                Global.List.Bind(getOptions());
                setAdd();
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
                name: 'BalanceSheetSettingItemDetails',
                url: '/Content/IqraPharmacy/AccountantArea/Content/BalanceSheetSettingItem/Details.js',
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
        function setAdd() {
            Global.Click(windowModel.View.find('#btn_add_new_account_reporting_item'), function () {
                Global.Add({
                    name: 'AddBalanceSheetSettingItem',
                    Report: callerOptions.Report,
                    model: callerOptions.model,
                    url: '/Content/IqraPharmacy/AccountantArea/Content/BalanceSheetSettingItem/AddNew.js',
                    OnSuccess: function () {
                        gridModel.Reload();
                    }
                });
            });
        };
        function getOptions() {
            var opts = {
                Name: 'ReportingDetailsGrid',
                Grid: {
                    elm: windowModel.View.find('#details_grid'),
                    columns: [
                        { field: 'Title',  },
                        { field: 'AccountGroup',  },
                        { field: 'Creator', filter: true, className: 'creator' }
                    ],
                    url: function () {
                        filter.value = callerOptions.model.Id ;
                        return '/AccountantArea/BalanceSheetSettingItem/Items'
                    },
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: [filter] },
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
                Add: false,
                Edit:false,
                remove: { save: '/AccountantArea/BalanceSheetSettingItem/Delete' }
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
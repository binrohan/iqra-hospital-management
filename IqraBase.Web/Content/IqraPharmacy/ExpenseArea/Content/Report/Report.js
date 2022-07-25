

(function () {
    var that = this, gridModel, service = {}, formModel = {}, date = new Date(),
    from = { field: 'ExpenseAt', value: "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 2 },
    to = { field: 'ExpenseAt', value: "'" + new Date(date.setDate(new Date().getDate() + 1)).format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 3 };

    function onDetails(model) {
        Global.Add({
            name: 'ExpenseInfo',
            url: '/Areas/ItemExpensesArea/Content/ExpenseDetails.js',
            ExpenseInfoId: model.Id
        });
    };
    function onUserDetails(Id) {
        Global.Add({
            UserId: Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    };
    function onApproverDetails(model) {
        onUserDetails(model.ApprovedBy);
    };
    function onApproved(model) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'OnApprove',
                save: '/ExpenseArea/Expense/Approve',
                data: { Id: model.Id },
                onsavesuccess: function () {
                    gridModel.Reload();
                }
            }
        });
    };
    function onDataBinding(response) {
        //formModel.Amount = (response.Data.Total.Amount || 0).toMoney(4);
        //response.Data.Total = response.Data.Total.Total;
        //response.Data.Data.each(function () {
        //    this.Active = this.Active ? "Yes" : "No";
        //    this.Amount = this.Amount.toMoney();
        //});
    };
    function onRowBound(elm) {
        if (this.Approver) {
            elm.find('.btn_approve').remove();
        }
    };
    function getAccessButton() {
        return [];
        if (hasApproveAccess) {
            return [{
                click: onApproved,
                html: '<span class="icon_container btn_approve"><span class="glyphicon glyphicon-open"></span></span>'
            }];
        } else {
            return [
            //    {
            //    click: onEdit,
            //    html: '<span class="icon_container"><span class="glyphicon glyphicon-edit"></span></span>'
            //}
            ];
        }
    };
    function getFilter() {
        return Global.Filters().Bind({
            container: $('#filter_container'),
            formModel: formModel,
            Type: 'ThisMonth',
            onchange: function (filter) {
                if (gridModel) {
                    gridModel.page.filter = filter;
                    gridModel.Reload();
                }
            }
        });
    };
    Global.List.Bind({
        Name: 'DailyReport',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Amount', add: false },
                { field: 'Description', filter: true, position: 6, add: { type: 'textarea', sibling: 1 } },
                { field: 'ResponsibleUser', filter: true, title: 'ExpenseBy', position: 5, click: onDetails },
                { field: '', title: 'Image', className: 'picture', position: 5.3 },
                { field: 'Type', position: 4, filter: true },
                { field: 'Creator', click: onCreatorDetails, filter: true },
                { field: 'Approver', click: onApproverDetails, filter: true },
                { field: 'ExpenseAt', position: 5, dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', add: false },
                { field: 'Status', add: false }
            ],
            Actions: getAccessButton(),
            url: '/Expense/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Expenses ', filter: getFilter() },
            rowBound: onRowBound,
            onDataBinding: onDataBinding
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        remove: false,
        Edit: false
    });
    (function () {
        var opts = {
            name: 'DailyReport',
            url: '/Content/IqraPharmacy/ExpenseArea/Content/Report/AddReport.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        };
        $('#btn_add_new').click(function () {
            Global.Add(opts);
        });
    })();
})();
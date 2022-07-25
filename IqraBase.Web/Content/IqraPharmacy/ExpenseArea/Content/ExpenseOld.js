

(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            name: 'ExpenseInfo',
            url: '/Areas/ItemExpensesArea/Content/ExpenseDetails.js',
            ExpenseInfoId: model.Id
        });
    };
    function onComputerDetails(model) {
        Global.Add({
            ComputerId: model.ComputerId,
            name: 'ComputerDetails',
            url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
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
    function onExpenseByDetails(model) {
        onUserDetails(model.CreatedBy);
    };
    function onDataBinding(data) {
        //var list = [];
        data.Data.Data.each(function () {
            this.Active = this.Active ? "Yes" : "No";
        });
        //data.Data.Data = list;
    };
    function onRowBound(elm) {
        var link = $('<a href="/Expense/Picture/' + this.Id + '"><img src="/Expense/Picture/' + this.Id + '" style="max-width: 100px; max-height:100px;"/></a>');
        elm.find('.picture').append(link);
    };
    var that = this, gridModel, formModel = {}, service = {};
    Global.List.Bind({
        Name: 'Expense',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Amount', add: false },
                { field: 'Description', filter: true, position: 6, add: { type: 'textarea', sibling: 1 } },
                { field: 'ResponsibleUser', filter: true, title: 'ExpenseBy', position: 5, click: onExpenseByDetails },
                { field: '', title: 'Image', className: 'picture', position: 5.3 },
                { field: 'Type', position: 4, filter: true },
                { field: 'Creator', click: onCreatorDetails, filter: true },
                { field: 'Approver', click: onApproverDetails, filter: true },
                { field: 'ExpenseAt', position: 5, dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', add: false },
                { field: 'Status', add: false }
            ], Actions: [],
            url: '/Expense/OldGet',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Expenses ' },
            rowBound: onRowBound,
            onDataBinding: onDataBinding
        },
        onComplete: function (model) {
            gridModel = model;
        }, Add: false, remove: false
    });
    (function () {
        var opts = {
            name: 'Expense',
            url: '/Content/IqraPharmacy/ExpenseArea/Content/AddExpense.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        };
        $('#btn_add_new').click(function () {
            Global.Add(opts);
        });
    })();
    Global.Form.Bind(formModel, $('#Expense_summary_container'));
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container'));
        function onChange() {
            var filter = [];
            gridModel.page.filter = gridModel.page.filter || [];
            (gridModel.page.filter || []).each(function () {
                if (this.field != 'ExpenseFrom' && this.field != 'ExpenseTo' && this.field != 'AmountFrom' && this.field != 'AmountTo') {
                    filter.push(this);
                }
            });
            if (formModel.ExpenseFrom) {
                filter.push({ field: 'ExpenseFrom', value: "'" + formModel.ExpenseFrom + "'", Operation: 2 });
            }
            if (formModel.ExpenseTo) {
                filter.push({ field: 'ExpenseTo', value: "'" + formModel.ExpenseTo + "'", Operation: 4 });
            }
            if (formModel.AmountFrom) {
                filter.push({ field: 'AmountFrom', value: formModel.AmountFrom, Operation: 2 });
            }
            if (formModel.AmountTo) {
                filter.push({ field: 'AmountTo', value: formModel.AmountTo, Operation: 4 });
            }
            gridModel.page.filter = filter;
            gridModel.Reload();
        };

        Global.DatePicker.Bind($(inputs['ExpenseFrom']), { format: 'yyyy/MM/dd', onChange: onChange });
        Global.DatePicker.Bind($(inputs['ExpenseTo']), { format: 'hh:mm', onChange: onChange });
        $(inputs['AmountFrom']).change(onChange);
        $(inputs['AmountTo']).change(onChange);
        function onPeriodChange(data) {
            console.log(data);
            var today = new Date(), fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), today = new Date(fromDate);
            switch (data.value) {
                case 'Yesterday':
                    fromDate.setDate(fromDate.getDate() - 1);
                    today = new Date(fromDate);
                    break;
                case 'ThisWeek':
                    fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                    break;
                case 'LastWeek':
                    today.setDate(fromDate.getDate() - fromDate.getDay());
                    fromDate.setDate(fromDate.getDate() - 7);
                    break;
                case 'ThisMonth':
                    fromDate.setDate(1);
                    break;
                case 'LastMonth':
                    today.setDate(0);
                    fromDate = new Date(fromDate);
                    fromDate.setDate(1);
                    break;
                case 'ThisYear':
                    fromDate.setMonth(0);
                    fromDate.setDate(1);
                    break;
                case 'LastOneYear':
                    fromDate.setFullYear(fromDate.getFullYear() - 1);
                    break;
                case 'LastYear':
                    today.setMonth(0);
                    today.setDate(0);
                    fromDate = new Date(today);
                    fromDate.setMonth(0);
                    fromDate.setDate(1);
                    break;
            }
            formModel.ExpenseFrom = fromDate.format('yyyy/MM/dd') + ' 00:00';
            formModel.ExpenseTo = today.format('yyyy/MM/dd') + ' 23:59';
            onChange();
        };
        Global.DropDown.Bind({
            Id: 'SuplierId',
            dataSource: [{ text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']).empty(),
            change: onPeriodChange
        });
    }).call(service.Filter = {});
})();
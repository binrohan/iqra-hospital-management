
(function () {
    var that = this, gridModel;
    function onAdd() {
        Global.Add({
            name: 'Salary',
            url: '/Content/IqraPharmacy/SalaryArea/Content/Salary/AddMonthlySalaryController.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function salarySheet(model) {
        Global.Add({
            model: model,
            From: Global.DateTime.GetObject('01/' + model.From, 'dd/MM/yyyy'),
            To: model.To.getDate(),
            name: 'Salary',
            url: '/Content/IqraPharmacy/SalaryArea/Content/Salary/GenerateSalarySheet.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onDataBinding(data) {

    };
    Global.List.Bind({
        Name: 'Salary',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'From', title: 'Date', dateFormat: 'MM/yyyy', Click: salarySheet },
                { field: 'Employee', title: 'Total' },
                { field: 'Prepared' },
                { field: 'Paid' },
                { field: 'Basic' },
                { field: 'OverTime' },
                { field: 'Bonus' },
                { field: 'Advance' },
                { field: 'Deduction' },
                { field: 'PaidByName', title: 'PaidBy', filter: true, },
                { field: 'Creator', filter: true }
            ],
            url: '/SalaryArea/Salary/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Salaries ' },
            onDataBinding: onDataBinding,
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: { save: '/SalaryArea/Salary/Delete' }
    });
    Global.Click($('#btn_add_new'), onAdd);
})();

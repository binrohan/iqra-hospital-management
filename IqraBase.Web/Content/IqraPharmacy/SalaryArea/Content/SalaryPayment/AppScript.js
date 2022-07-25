
(function () {
    var that = this, gridModel;
    function onAdd() {
        Global.Add({
            name: 'Increment',
            url: '/Content/IqraPharmacy/SalaryArea/Content/Increment/AddEmployeeIncrement.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onDetails(model) {
        Global.Add({
            UserId: model.EmployeeId,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onDataBinding(data) {
        //console.log([Global.DateTime.GetObject, data, ''.getDate]);
        //data.Data.Data.each(function () {
        //    this.DateTime = this.EffectiveFrom.getDate().format('dd/MM/yyyy');
        //});
    };
    Global.List.Bind({
        Name: 'Increment',
        Grid: {
            elm: $('#grid'),
            columns: [
                        { field: 'Employee', add: false, click: onDetails },
                        { field: 'PreviousSalary', add: false },
                        { field: 'CurrentSalary', title: 'IncrementedSalary', Add: { dataType: 'int', sibling: 3} },
                        { field: 'EffectiveFrom', title: 'ActivatedFrom', dateFormat: 'dd/MM/yyyy', Add: {sibling: 3}  },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', add: false },
                        { field: 'Remarks', filter: true, add: { sibling: 1, type: 'textarea' }, required:false }
            ],
            url: '/SalaryArea/Increment/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Increments '
        },
            onDataBinding: onDataBinding,
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false
    });
    Global.Click($('#btn_add_new'), onAdd);
})();

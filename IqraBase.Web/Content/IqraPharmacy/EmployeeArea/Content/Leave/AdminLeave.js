

(function () {
    var opts = {
        name: 'AddEmployeeLeave',
        url: '/Content/IqraPharmacy/HRIS/Content/Leave/AddEmployeeLeaveByAdmin.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            model: {
                Date: Global.DateTime.GetObject(model.FromDate, 'dd/MM/yyyy hh:mm'),
                EmployeeId: model.EmployeeId,
                Id:model.Id
            },
            url: '/Content/IqraPharmacy/HRIS/Content/Leave/LeaveApproveController.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onAdd() {
        opts.model = undefined;
        Global.Add(opts);
    };
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.Status = status[this.Status];
        });
    };
    var that = this, gridModel, status = ['Pending', 'Approved', 'Rejected', 'Approved & Modified'];
    Global.List.Bind({
        Name: 'Leave',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Employee', filter: true, Click: onDetails },
                { field: 'Category', filter: true },
                { field: 'Days' },
                { field: 'FromDate', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'ToDate', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Approver', filter: true },
                { field: 'ApprovedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Status' }
            ],
            url: '/EmployeeArea/Leave/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Leaves ' },
            onDataBinding: onDataBinding,
            
        }, onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: { save: '/EmployeeArea/Leave/Delete' }
    });
    Global.Click($('#btn_add_new'), onAdd);
})();


(function () {
    var opts = {
        name: 'AddNewEmployeeShift',
        url: '/Content/IqraPharmacy/HRIS/Content/EmployeeShift/AddNewEmployeeShift.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onSetEndDate(model) {
        Global.Add({
            model: model,
            name: 'SetEndDate',
            url: '/Content/IqraPharmacy/HRIS/Content/EmployeeShift/SetEndDate.js',
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
        var str = '';
        data.Data.Data.each(function () {
            this.Duration = new Date(1900, 1, 1, 0, this.Duration).format('HH:mm');
        });
    };
    function onDetails(model) {
        Global.Add({
            model: {
                Date: new Date(),
                EmployeeId: model.EmployeeId
            },
            url: '/Content/IqraPharmacy/HRIS/Content/EmployeeShift/ShiftDetailController.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'EmployeeShift',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Employee', filter: true, Click: onDetails },
                { field: 'ActivateAt', dateFormat: 'dd/MM/yyyy', },
                { field: 'ActiveTo', dateFormat: 'dd/MM/yyyy', },
                { field: 'StartAt' },
                { field: 'EndAt' },
                { field: 'Duration', },
                { field: 'StartDayOfMonth', title: 'SDM' },
                { field: 'EndDayOfMonth', title: 'EDM' },
                { field: 'Approver', filter: true },
                { field: 'Status' }
            ],
            url: '/HRIS/EmployeeShift/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} EmployeeShifts ' },
            onDataBinding: onDataBinding,
            Actions: [{
                click: onSetEndDate,
                html: '<span class="hide_on_mobile icon_container" title="SetEndDate" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            }]
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

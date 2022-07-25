
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'AdvanceSalary',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Employee', title: 'Employee', position: 1, Add: false },
                    { field: 'Amount', title: 'Amount', Add: {dataType:'int'}},
                    { field: 'Status', title: 'Status', Add: false },
                    { field: 'PaidAt', title: 'PaidAt', dateFormat: 'dd mmm-yyyy', required: false, Add: false },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'Remarks', title: 'Remarks', required: false, sorting: false, Add: {type:'textarea',sibling:1} }
            ],
          
            url: '/PayrollArea/AdvanceSalary/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} AdvanceSalaries ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/PayrollArea/AdvanceSalary/Create',
            saveChange: '/PayrollArea/AdvanceSalary/Edit',
            dropdownList: [
                         {
                             Id: 'EmployeeId',
                             position: 1,
                             url: '/EmployeeArea/Employee/AutoComplete',
                             Type: 'AutoComplete'
                         },
            ],
        },
        Edit:false,
        remove: { save: '/PayrollArea/AdvanceSalary/OnAdvanceSalaryDelete' }
    });

})();;

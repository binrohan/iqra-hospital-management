
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            EmployeeTypeId: model.Id,
            name: 'PatientStatusDetails',
            url: '/Areas/CommonArea/Content/PatientStatus/PatientStatusDetails.js',
        });
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Areas/EmployeeArea/Content/User/UserDetails.js',
        });
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
    function onDataBinding(response) {
        response.Data.Data.each(function () {

        });
    };
    Global.List.Bind({
        Name: 'PatientStatus',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name' },
                { field: 'Rank', },
                { field: 'Remarks', title: 'Remarks', add: { sibling: 1, type: 'textarea' } },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Creator', Add: false, click: onCreatorDetails },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Updator', Add: false, click: onUpdatorDetails },
            ],
            url: '/PatientArea/PatientStatus/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} PatientStatus ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/PatientArea/PatientStatus/Create',
            saveChange: '/PatientArea/PatientStatus/Edit'
        },
        remove: { save: '/PatientArea/PatientStatus/Delete' }
    });

})();
                
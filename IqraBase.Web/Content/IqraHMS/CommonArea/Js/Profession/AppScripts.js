
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
            name: 'ProfessionDetails',
            url: '/Areas/CommonArea/Content/Profession/ProfessionDetails.js',
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
        Name: 'Profession',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name' },
                { field: 'Rank', },
                { field: 'Remarks', title: 'Remarks', add: { sibling: 1, type: 'textarea' },required:false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Creator', Add: false, click: onCreatorDetails },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Updator', Add: false, click: onUpdatorDetails }
            ],
            url: '/CommonArea/Profession/Get',
            page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Profession ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/CommonArea/Profession/Create',
            saveChange: '/CommonArea/Profession/Edit'
        },
        remove: { save: '/CommonArea/Profession/Delete' }
    });

})();

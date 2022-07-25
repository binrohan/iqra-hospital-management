
(function () {

    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'UnitType',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Type', filter: true, Add: false },
                { field: 'Name', filter: true },
                { field: 'Description', required: false, filter: true },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/UnitType/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} UnitTypes ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/UnitType/Create',
            saveChange: '/UnitType/Edit',
            dropdownList: [
                {
                    Id: 'TypeId', url: '/ItemType/DropDown',
                    dataSource: [
                        { value: PharmacyTypeId, text: 'Pharmacy' },
                        { value: NonePharmacyTypeId, text: 'None-Pharmacy' },
                        { value: '00000000-0000-0000-0000-000000000000', text: 'Both' }
                    ]
                }
            ]
        },
        remove: { save: '/UnitType/Delete' }
    });

})();

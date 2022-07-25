
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.Position = formModel.Position || 0;
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
    var that = this, gridModel,
        filterModel = { field: 'MenuCategoryId', Operation: 0 },
        methodilterModel = { field: 'ControllerId', Operation: 0 };
    Global.List.Bind({
        Name: 'Category',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'MenuCategory', filter: true, Add: false },
                { field: 'MenuItem', filter: true, Add: false },
                { field: 'ActionController', filter: true, Add: false },
                { field: 'ActionMethod', filter: true, Add: false },
                { field: 'Description', required: false, filter: true, Add: { type: 'textarea', sibling: 1 }, Position: 5 },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/MenuArea/SubMenuItem/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/MenuArea/SubMenuItem/Create',
            saveChange: '/MenuArea/SubMenuItem/Edit',
            dropdownList: [
                {
                    Id: 'MenuCategoryId',
                    url: '/MenuArea/MenuCategory/AutoComplete',
                    Type: 'AutoComplete',
                    Position: 1,
                    Change: {
                        Id: 'MenuItemId',
                        page: { 'PageNumber': 1, 'PageSize': 500, filter: [filterModel] },
                        url: function (data, model) {
                            filterModel.value = data.Id;
                            return '/MenuArea/MenuItem/AutoComplete';
                        },
                        type: 'AutoComplete',
                        position: 1
                    }
                }, {
                    Id: 'ControllerId',
                    url: '/AccessArea/AppAccess/ActionControllerAutoComplete',
                    Type: 'AutoComplete',
                    Position: 1,
                    Change: {
                        Id: 'ActionMethodId',
                        page: { 'PageNumber': 1, 'PageSize': 500, filter: [methodilterModel] },
                        url: function (data, model) {
                            methodilterModel.value = data.Id;
                            return '/AccessArea/AppAccess/ActionMethodAutoComplete';
                        },
                        type: 'AutoComplete',
                        position: 1
                    }
                }, {
                    Id: 'Type',
                    position: 1,
                    dataSource: [
                        { text: 'Menu Page Access', value: 0 },
                        { text: 'Menu Access', value: 1 },
                        { text: 'Group Access', value: 2 }
                    ]
                }
            ]
        },
        remove: { save: '/MenuArea/MenuItem/Delete' }
    });
})();

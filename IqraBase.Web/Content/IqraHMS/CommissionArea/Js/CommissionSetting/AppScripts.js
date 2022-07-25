
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function getDataSource() {
        return [
            { text: 'No Commission', value: 'No Commission' },
            { text: 'Default Commission', value: 'Default Commission' },
            { text: 'Fixed', value: 'Fixed' },
            { text: 'Percentage(%)', value: 'Percentage(%)' }
        ];
    };
    function onDetails(model) {
        Global.Add({
            EmployeeTypeId: model.Id,
            name: 'SettingDetails',
            url: '/Areas/CommonArea/Content/Setting/SettingDetails.js',
        });
    };
    function onAddOrderCategory(model) {
        Global.Add({
            model: model,
            name: 'OrderCategory',
            url: '/Areas/SuplierArea/Content/Suplier/AddOrderCategoryController.js',
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
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Setting',
        Grid: {
            elm: $('#grid'),
            columns: AppComponent.CommissionSetting.Columns(),
            url: '/CommissionArea/CommissionSetting/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Setting ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: AppComponent.CommissionSetting.Add({
            onSubmit: onSubmit
        }),
        remove: { save: '/CommissionArea/CommissionSetting/Delete' }
    });

})();

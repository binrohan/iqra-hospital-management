
(function () {
    var opts = {
        name: 'ItemType',
        url: '/Content/Js/ItemType/AddCategoryController.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onAdd() {
        opts.model = undefined;
        Global.Add(opts);
    };
    function onEdit(model) {
        opts.model = model;
        Global.Add(opts);
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
        Name: 'ItemType',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true },
                { field: 'Description', required: false, filter: true },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm',Add:false },
                { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/ItemType/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ItemTypes ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add:false
            //{
            //onSubmit: onSubmit,
            //save: '/ItemType/Create',
            //saveChange: '/ItemType/Edit'
            //}
        ,
        remove:false// { save: '/ItemType/Delete' }
    });

})();

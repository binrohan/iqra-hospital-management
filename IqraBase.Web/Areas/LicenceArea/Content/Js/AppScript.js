




(function () {
    var that = this, gridModel;
    function onDataBinding(response) {

    };
    Global.List.Bind({
        Name: 'Licence',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Id', Add: false },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'ActivateAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
            ],
            url: '/LicenceArea/Licence/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} License ' },
            onDataBinding: onDataBinding,
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false
    });
    Global.Click($('#btn_upload_license'), function () {
        Global.Add({
            name: 'Upload License',
            url: '/Areas/LicenceArea/Content/Js/AddLicence.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    });
})();



(function () {
    var that = this, gridModel,types=['Not Define','Debit','Credit'];
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
    };
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            this.IncreaseType = types[this.IncreaseType] || '';
        });
    };
    function onRowBound(elm) {
        if (!this.IsEditable) {
            elm.find('.icon_container').remove();
        }
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    Global.List.Bind({
        Name: 'AccountGroupCategory',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Code', filter: true },
                { field: 'Name', filter: true },
                { field: 'IncreaseType', title: 'Type' },
                { field: 'Description', required: false, filter: true },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false, Click: onCreatorDetails },
                { field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Updator', required: false, filter: true, Add: false, Click: onUpdatorDetails }
            ],
            url: '/AccountantArea/AccountGroupCategory/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Account Group Categories ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound
        },
        onComplete: function (model) {
            gridModel = model;
        }, Add: false,
        Edit:false,
        remove: false
    });
})();

(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    Global.List.Bind({
        Name: 'AccountReference',
        Grid: {
            elm: $('#grid'),
            columns: AppComponent.AccountReference.Columns(),
            url: '/CommonArea/AccountReference/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ' },
            action: { width: 60 },
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: AppComponent.AccountReference.Add({
            onSubmit: onSubmit
        }),
        remove: { save: '/CommonArea/AccountReference/Delete' }
    });
})();

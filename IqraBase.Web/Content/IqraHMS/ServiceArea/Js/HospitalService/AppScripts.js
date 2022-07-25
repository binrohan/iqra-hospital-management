
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };

    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(data) {

    };
    Global.List.Bind({
        Name: 'HospitalService',
        Grid: {
            elm: $('#grid'),
            columns: AppComponent.Service.Columns(),
            url: '/ServiceArea/HospitalService/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Services ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add:AppComponent.Service.Add({
            onSubmit: onSubmit,
        }),
        remove: { save: '/ServiceArea/HospitalService/Delete' }
    });

})();;

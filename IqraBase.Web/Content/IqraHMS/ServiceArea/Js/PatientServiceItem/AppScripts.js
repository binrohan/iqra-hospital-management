
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraHMS/PatientArea/Js/User/UserDetails.js',
        });
    }

    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(data) {

    };
    Global.List.Bind({
        Name: 'PatientServiceItem',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Patient Name', filter: true},
                { field: 'Unit', title: 'Unit'},
                { field: 'Vat', title: 'Vat' },
                { field: 'Rate', title: 'Rate' },
                { field: 'Paid', title: 'Paid' },
                { field: 'Total', title: 'Total' },
                { field: 'ServiceType', title: 'ServiceType' },
                { field: 'TransectionType', title: 'TransectionType' },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                { field: 'Remarks', title: 'Remarks', filter: true, required: false, Add: { type: 'textarea', sibling: 1 } }
            ],
            url: '/ServiceArea/PatientServiceItem/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Patient Service Items' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/ServiceArea/PatientServiceItem/Create',
            saveChange: '/ServiceArea/PatientServiceItem/Edit',
        },
        remove: { save: '/ServiceArea/PatientServiceItem/Delete' }
    });

})();;

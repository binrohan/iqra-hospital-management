
(function () {
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
        Name: 'Release',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'PatientId', title: 'Patient', filter: true },
                    { field: 'PatientCondition', title: 'Patient Condition', filter: true },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy' },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy' },
                    { field: 'Remarks', title: 'Remarks', filter: true },
                    
            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/PatientArea/Release/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Admission ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/PatientArea/Release/Create',
            saveChange: '/PatientArea/Release/Edit',
            //details: function (data) {
                //return '/PatientArea/PatientHistory/Details?Id=' + data.Id;
            //},
            additionalField: [
                //{ field: 'AccountNo', required: false, title: 'Payable Account No', position: 2 },
                //{ field: 'AccountName', required: false, title: 'Payable Account Name', position: 2 },
                //{ field: 'Fax', required: false, position: 5 },
                //{ field: 'Vat', position: 8 },
                //{ field: 'Discount', position: 9 },
                //{ field: 'PurchaseDiscount', position: 10 },
                //{ field: 'Remarks', required: false, position: 12, Add: { type: 'textarea' } }
            ]
        },
        remove: { save: '/PatientArea/Release/Delete' }
    });

})();;
                
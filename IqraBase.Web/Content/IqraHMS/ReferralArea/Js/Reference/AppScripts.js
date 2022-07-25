
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
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Reference',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Name', filter: true,position : 1 },
                { field: 'Mobile', title: 'Mobile', filter: true, position: 2},
                { field: 'Email', title: 'Email', filter: true, position: 3, required: false},
                { field: 'Gender', title: 'Gender', filter: true, Add: false, position: 4 },
                { field: 'Remarks', title: 'Remarks', required: false, sorting: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },

            ],
            url: '/ReferralArea/Reference/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Reference ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/ReferralArea/Reference/Create',
            saveChange: '/ReferralArea/Reference/Edit',
            dropdownList: [
                {
                    Id: 'Gender', position: 4,
                    dataSource: [
                        { text: 'Male', value: 'Male' },
                        { text: 'Female', value: 'Female' },
                        { text: 'Other', value: 'Other' }
                    ]
                }
            ],
          
        },
        remove: { save: '/ReferralArea/Reference/Delete' }
    });

})();;


(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id;
            formModel.Code = data.Code;
        }
        formModel.DrCommission = formModel.DrCommission || 0;
        formModel.ReCommission = formModel.ReCommission || 0;
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
        Name: 'InvestigationCategory',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Code', title: 'Code', filter: true,Add:false },
                    { field: 'Name', title: 'Name', filter: true, Add: { sibling: 3 } },
                    { field: 'DrCommission', title: 'Doctor Commission(%)', required: false, Add: { dataType: 'float|null', sibling: 3 } },
                    { field: 'ReCommission', title: 'Reference Commission(%)', required: false, Add: { dataType: 'float|null', sibling: 3 } },
                    { field: 'Remarks', title: 'Remarks', required: false, Add: {type:'textarea',sibling:1} },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy',Add:false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
            ],
            url: '/InvestigationArea/InvestigationCategory/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} InvestigationCategories ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/InvestigationArea/InvestigationCategory/Create',
            saveChange: '/InvestigationArea/InvestigationCategory/Edit',
            //dropdownList: [
            //        {
            //            Id: 'Type', position: 5,
            //            dataSource: [
            //                { text: 'Percentage(%)', value: 'Percentage' },
            //                { text: 'Fixed of commission', value: 'Fixed' },
                         
            //            ]
            //        }
            //    ]
        },
        remove: { save: '/InvestigationArea/InvestigationCategory/Delete' }
    });

})();;
                
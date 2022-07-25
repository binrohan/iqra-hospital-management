
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
            formModel.Code = data.Code;
        }
        //formModel.DrCommission = formModel.DrCommission.trim() == '' ? 0 : formModel.DrCommission;
        //formModel.ReCommission = formModel.ReCommission.trim() == '' ? 0 : formModel.ReCommission;
        formModel.MaxDiscount == formModel.MaxDiscount|| 0;
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraHMS/PatientArea/Js/User/UserDetails.js',
        });
    }
    function onDetails(model) {
        Global.Add({
            InvestigationId: model.Id,
            name: 'InvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/Investigation/OnDetails.js',
        });
    }
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            if (this.DrCommission < 0) {
                this.DrCommission = this.CtgrDrCommission;
            } if (this.ReCommission < 0) {
                this.ReCommission = this.CtgrReCommission;
            }
        });
    };
    Global.List.Bind({
        Name: 'Investigation',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Code', title: 'Code', filter: true, Add: false },
                    { field: 'Name', title: 'Test Name', filter: true, position: 4, click: onDetails },
                    { field: 'InvestigationCategory', title: 'Category', filter: true, Add: false, position: 1 },
                    { field: 'Room', title: 'Room', filter: true, Add: false, position: 3 },
                    { field: 'Cost', title: 'Cost', position: 5, Type: 2, Add: { dataType: 'float' } },
                    { field: 'MaxDiscount', title: 'Max Discount(BDT)', position: 6, Type: 2, required: false, Add: { dataType: 'float|null' } },
                    { field: 'Type', title: 'Commission Type', filter: true, Add: false },
                    { field: 'DrCommission', title: 'Doctor Commission', required: false, filter: true, Add: false },
                    { field: 'ReCommission', title: 'Reference Commission', required: false, filter: true, Add: false },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'Creator', add: false, filter: true, click: onCreatorDetails },
                    { field: 'Remarks', title: 'Remarks', filter: true, required: false, Add: { type: 'textarea', sibling: 1 } }
                    
            ],
            url: '/InvestigationArea/Investigation/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Investigations ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/InvestigationArea/Investigation/Create',
            saveChange: '/InvestigationArea/Investigation/Edit',
            dropdownList: [
                {
                    Id: 'InvestigationCategoryId',
                    position: 1,
                    url: '/InvestigationArea/InvestigationCategory/AutoComplete',
                    onChange: function (data) {
                        console.log(data);
                    },
                    Type: 'AutoComplete',
                },
                {
                    Id: 'RoomId',
                    position: 3,
                    url: '/RoomArea/Room/AutoComplete',
                    onChange: function (data) {
                        console.log(data);
                    },
                    Type: 'AutoComplete',
                },
                AppComponent.CommissionSetting.AutoComplete({
                    Id: 'CommissionSettingId',
                    position: 7,

                },'Investigation')
            ]
        },
        remove: { save: '/InvestigationArea/Investigation/Delete' }
    });

})();;
                
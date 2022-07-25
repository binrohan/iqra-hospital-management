
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
        Name: 'InvestigationEquipment',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Name', title: 'Equipment Name', filter: true, position: 4, Add: { sibling: 3 }},
                    { field: 'Investigation', title: 'Investigation Name', filter: true, Add: false, position: 1 },
                    { field: 'Cost', title: 'Cost', position: 9, Type: 2, Add: { sibling: 3, dataType: 'float' } },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false,selected:false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'Creator', add: false, filter: true, click: onCreatorDetails },
                    { field: 'Remarks', title: 'Remarks', filter: true, required: false, Add: { type: 'textarea', sibling: 1 } }

	                
            ],
            url: '/InvestigationArea/InvestigationEquipment/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} InvestigationEquipments ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/InvestigationArea/InvestigationEquipment/Create',
            saveChange: '/InvestigationArea/InvestigationEquipment/Edit',
            dropdownList: [
                {
                    Id: 'InvestigationId',
                    position: 1,
                    url: '/InvestigationArea/Investigation/AutoComplete',
                    onChange: function (data) {
                        console.log(data);
                    },
                    Type: 'AutoComplete',
                }
            ]
        },
        remove: { save: '/InvestigationArea/InvestigationEquipment/Delete' }
    });

})();;
                
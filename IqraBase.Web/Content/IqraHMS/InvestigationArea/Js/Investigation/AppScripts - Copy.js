
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
    function onDetails(model) {
        Global.Add({
            model: model,
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
    function onDataBinding(data) {

    };
    Global.List.Bind({
        Name: 'Investigation',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Name', title: 'Test Name', filter: true, position: 4, Add: { sibling: 3 }, click: onDetails },
                    { field: 'InvestigationCategory', title: 'Category', filter: true, Add: false, position: 1 },
                    //{ field: 'Building', title: 'Building', filter: true, Add: false, position: 2,add: false },
                    { field: 'Room', title: 'Room', filter: true, Add: false, position: 3 },
                    //{ field: 'Position', title: 'Position', filter: true, Add: false, position: 5 },
                    //{ field: 'UpperLimit', title: 'UpperLimit', position: 6 },
                    //{ field: 'LowerLimit', title: 'LowerLimit', position: 7 },
                    //{ field: 'RefferenceUnit', title: 'RefferenceUnit', filter: true, Add: false, position: 8 },
                    { field: 'Cost', title: 'Cost', position: 9, Type: 2, Add: { sibling: 3, dataType: 'float' } },
                    { field: 'MaxDiscount', title: 'Max Discount', position: 9, Type: 2, required: false, selected: false, Add: { sibling: 3, dataType: 'float|null' } },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false,selected:false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'Creator', add: false, filter: true, click: onCreatorDetails },
                    { field: 'Remarks', title: 'Remarks', filter: true, required: false, Add: { type: 'textarea', sibling: 1 } }

	  //,rm.[Name] [Room]
      //,inv.[Cost]
      //,inv.[MaxDiscount]
                    
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
                //{
                 //    Id: 'Position', position: 5,
                 //    dataSource: [
                 //        { text: 'Male', value: 'Male' },
                 //        { text: 'Female', value: 'Female' },
                 //        { text: 'Child', value: 'Child' }
                 //    ]
                 //},
                 // {
                 //     Id: 'RefferenceUnit', position: 8,
                 //     dataSource: [
                 //         { text: 'm3', value: 'm3' },
                 //         { text: 'ml', value: 'ml' },
                 //         { text: 'pcs', value: 'pcs' }
                 //     ]
                 // },
            ]
        },
        remove: { save: '/InvestigationArea/Investigation/Delete' }
    });

})();;
                
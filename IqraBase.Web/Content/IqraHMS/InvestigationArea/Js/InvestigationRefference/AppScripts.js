
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
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
        Name: 'InvestigationRefference',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'InvestigationCategory', title: 'Category', filter: true, Add: false, position: 1 },
                    { field: 'Building', title: 'Building', filter: true, Add: false, position: 2,add: false },
                    { field: 'Room', title: 'Room', filter: true, Add: false, position: 3 },
                    { field: 'Name', title: 'Test Name', filter: true,position: 4 },
                    { field: 'Position', title: 'Position', filter: true, Add: false, position: 5 },
                    { field: 'UpperLimit', title: 'UpperLimit', position: 6 },
                    { field: 'LowerLimit', title: 'LowerLimit', position: 7 },
                    { field: 'RefferenceUnit', title: 'RefferenceUnit', filter: true, Add: false, position: 8 },
                    { field: 'Cost', title: 'Cost', position: 9 },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'Remarks', title: 'Remarks', required: false }
                    
            ],
            url: '/InvestigationArea/InvestigationRefference/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} InvestigationRefferences ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/InvestigationArea/InvestigationRefference/Create',
            saveChange: '/InvestigationArea/InvestigationRefference/Edit',
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
                 {
                     Id: 'Position', position: 5,
                     dataSource: [
                         { text: 'Male', value: 'Male' },
                         { text: 'Female', value: 'Female' },
                         { text: 'Child', value: 'Child' }
                     ]
                 },
                  {
                      Id: 'RefferenceUnit', position: 8,
                      dataSource: [
                          { text: 'm3', value: 'm3' },
                          { text: 'ml', value: 'ml' },
                          { text: 'pcs', value: 'pcs' }
                      ]
                  },
            ]
        },
        remove: { save: '/InvestigationArea/InvestigationRefference/Delete' }
    });

})();;
                
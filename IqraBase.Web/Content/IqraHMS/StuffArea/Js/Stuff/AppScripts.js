(function () {
    var that = this, gridModel;
    function onSubmit(postModel, data, formModel) {
        if (data) {
            postModel.Id = data.Id
        }
        postModel.DesignationId = postModel.DesignationId || data.DesignationId;
        console.log(['formModel', formModel]);
    };
    function onDetails(model) {
        Global.Add({
            StuffId: model.Id,
            name: 'StuffDetails',
            url: '/Content/IqraHMS/StuffArea/Js/Stuff/StuffDetails.js',
        });
    };
    function addEmployeePicture(model) {
        Global.Add({
            EmployeeId: model.Id,
            name: 'AddEmployeePicture',
            //DocumentName: 'Employee Picture',
            url: '/Content/IqraHMS/StuffArea/Js/Stuff/AddEmployeeDocument.js',
        });
    };

    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Areas/EmployeeArea/Content/User/UserDetails.js',
        });
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
    Global.List.Bind({
        Name: 'Stuff',
        Grid: {
            elm: $('#grid'),
            columns: [

                { field: 'Name', title: 'Name', filter: true, position: 1, Click: onDetails, add: { sibling: 3 } },
                { field: 'Email', title: 'Email', position: 2, filter: true, required: false, add: { sibling: 3 } },
                { field: 'Gender', title: 'Gender', filter: true, Add: false, position: 3 },
                { field: 'EmployeeCode', title: 'Stuff Code', filter: true, position:4, Add: false },
                { field: 'EmployeeTypeName', title: 'EmployeeType', filter: true, position: 5, Add: false, add: { sibling: 4 } },
                { field: 'DesignationName', title: 'Designation', filter: true, position: 6, Add: false, add: { sibling: 4 } },
                { field: 'UserName', title: 'User Name', position: 8 },
                { field: 'Phone', title: 'Mobile', filter: true, position: 9, width: 110},
                //{ field: 'PassWord', title: 'PassWord', position: 8, filter: true, add: { type: 'password' } },
                { field: 'PAddress', title: 'Parmanent Address', Add: { type: 'textarea' }, required: false  },
                { field: 'CAddress', title: 'Current Address', Add: { type: 'textarea' } },
                { field: 'CreatedAt', title: 'Created At', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'UpdatedAt', title: 'Updated At', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Remarks', title: 'Remarks', add: { type: 'textarea' }, required: false}
                    
            ],
            Actions: [{
                click: addEmployeePicture,
                html: '<a style="margin-right:8px;" class="icon_container" title="Add Employee Picture"><span class="glyphicon glyphicon-open"></span></a>'
            }],
            url: '/StuffArea/Stuff/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Stuffs ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/StuffArea/Stuff/Create',
            saveChange: '/StuffArea/Stuff/Edit',
            onShow: function (model, formInputs, dropDownList, IsNew, windowModel, formModel) {
                if (IsNew) {
                    $(formInputs['UserName']).prop('disabled', false);
                    $(formInputs['PassWord']).prop('disabled', false);
                } else {
                    $(formInputs['UserName']).prop('disabled', true);
                    $(formInputs['PassWord']).prop('disabled', true).val('********');
                }
            },
            dropdownList: [
                            {
                                Id: 'Gender', position: 3, Add: { sibling: 3 },
                                dataSource: [
                                    { text: 'Male', value: 'Male' },
                                    { text: 'Female', value: 'Female' },
                                    { text: 'Other', value: 'Other' }
                                ]
                            },
                            {
                                Id: 'EmployeeTypeId',
                                position: 4,
                                url: '/CommonArea/EmployeeType/AutoComplete',
                                onChange: function (data) {
                                    console.log(data);
                                },
                                Type: 'AutoComplete',
                                change: {
                                    Id: 'DesignationId',
                                    position: 5,
                                    ValueField: 'Id',
                                    TextField: 'Name',
                                    url: function (data) {
                                        console.log(['/CommonArea/Designation/AutoComplete', data]);
                                        if (data) {
                                            return '/CommonArea/Designation/DesignationByAutoComplete?PageSize=2000&TypeId=' + data.Id;
                                        }
                                        return false;
                                    },
                                    onchange: function (data,a,b,c,d) {
                                        if (data) {

                                        }
                                        console.log(['data', data, a, b, c, d]);
                                    },
                                    Type: 'AutoComplete'
                                },
                }

            ],
            additionalField: [
                { field: 'PassWord', title: 'PassWord', position: 7, add: { type: 'password' } }
            ]
        },
        remove: { save: '/StuffArea/Stuff/Delete' }
    });
})();
                
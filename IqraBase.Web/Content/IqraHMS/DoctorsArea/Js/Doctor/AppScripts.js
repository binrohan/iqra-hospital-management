

(function () {
    //Global
    var that = this, gridModel, accessModel = { Update :true,Details:true,Create:true};
    function onAddEdit(model,isAdd) {
        Global.Add({
            name: isAdd ? 'Doctors' : 'Doctor',
            columns: (gridModel.selector && gridModel.selector.columns) || gridModel.columns,
            model: model,
            onSaveSuccess: function () {
                gridModel.Reload();
            },
            saveChange: '/DoctorsArea/Doctor/Update',
            save: '/DoctorsArea/Doctor/Create',
            dropdownList: [
                            {
                                Id: 'Gender',
                                position: 2,
                                add: { sibling: 3 },
                                dataSource: [
                                    { text: 'Male', value: 'Male' },
                                    { text: 'Female', value: 'Female' },
                                    { text: 'Other', value: 'Other' }
                                ]
                            }, {
                                Id: 'DepartmentId',
                                position: 3,
                                url: '/CommonArea/Department/AutoComplete',
                                add: { sibling: 3 },
                                type: 'AutoComplete'
                            }, {
                                Id: 'DesignationId',
                                position: 3,
                                url: '/CommonArea/Designation/DoctorAutoComplete',
                                add: { sibling: 3 },
                                type: 'AutoComplete'
                            }, {
                                Id: 'GroupId',
                                title: 'Commission Group',
                                position: 3,
                                url: '/CommissionArea/CommissionGroup/AutoComplete',
                                add: { sibling: 3 },
                                type: 'AutoComplete'
                            }
            ],
            additionalField: [
                { field: 'UserName', title: 'User Name', position: 3.2, add: isAdd ? { type: 'input' } : false },
                { field: 'Password', title: 'Password', position: 3.2, add:isAdd? { type: 'password' }:false }
            ]
        });
    };
    function onAdd() {
        onAddEdit(none, true);
    };
    function onEdit(model) {
        onAddEdit(model, false);
    };
    function getTypeFileter() {
        return {
            Operation: 0,
            DropDown: {
                dataSource: [
                    { text: 'Select Type', value: '' },
                    { text: 'Active', value: '0' },
                    { text: 'Deleted', value: '1' }
                ]
            }
        };
    };
    function onDetails(model) {
        Global.Add({
            DoctorId: model.Id,
            name: 'DoctorDetails',
            url: '/Content/IqraHMS/DoctorsArea/Js/Doctor/DoctorDetails.js',
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
    function getActions(){
        var actions = [];
        if (accessModel.Update) {
            actions.push({
                click: onEdit,
                html: '<a style="margin-right:8px;" class="icon_container" title="Edit Info"><span class="glyphicon glyphicon-edit"></span></a>'
            });
        }
        return actions;
    };
    function getColumn() {
        var column = [{ field: 'Name', title: 'Name', filter: true, width: 130, Click: accessModel.Details ? onDetails : none, position: 1, add: { sibling: 3 } },
                    { field: 'EmployeeCode', title: 'Doctor Code', width: 100, add: false },
                    { field: 'CAddress', title: 'Current Address', selected: false, position: 10, add: { type: 'textarea' }, required: false },
                    { field: 'PAddress', title: 'Permanent Address', selected: false, position: 11, add: { type: 'textarea' }, required: false },
                    { field: 'Department', title: 'Department', add: false },
                    { field: 'Designation', title: 'Designation', add: false },
                    { field: 'Fee', title: 'Fee', width: 50, add: false }];

        if (accessModel.Create) {
            column.push({ field: 'Group', title: 'Commission Group', add: false });
        }

        ([
                    { field: 'Phone', title: 'Phone', position: 4, filter: true },
                    { field: 'BMDCNo', title: 'BMDCNo', filter: true, position: 3, add: { sibling: 3 } },
                    { field: 'DoctorTitle', title: 'DoctorTitle', position: 6, filter: true, selected: false },
                    { field: 'Email', title: 'Email', position: 5, filter: true, selected: false, required: false },
                    { field: 'Gender', title: 'Gender', filter: true, selected: false, add: false },
                    { field: 'ChamberAddress', title: 'Chamber Address', position: 7, width: 130 },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', selected: false, add: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', selected: false, add: false },
                    { field: 'Remarks', title: 'Remarks', position: 12, required: false, add: { sibling: 1, type: 'textarea' } },
                    { field: 'IsDeleted', title: 'Is Deleted?', selected: false, filter: getTypeFileter(), Operation: 0, add: false }
        ]).each(function () {
            column.push(this);
        });
        

        return column;
    };
    Global.List.Bind({
        Name: 'Doctor',
        Grid: {
            elm: $('#grid'),
            columns: getColumn(),
            Actions: getActions(),
            url: '/DoctorsArea/Doctor/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Doctors ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: accessModel.DeActivate ? { save: '/DoctorsArea/Doctor/DeActivate' } : false
    });
    (function () {
        accessModel.Create ? Global.Click($('#btn_add_new'), onAdd) : $('#btn_add_new').remove();
    })();
})();
                
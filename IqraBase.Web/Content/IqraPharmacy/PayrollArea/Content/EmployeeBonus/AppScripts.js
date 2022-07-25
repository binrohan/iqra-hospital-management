
(function () {
    var that = this, gridModel, accessModel,
        amountType = ['Fixed Amount', '% of GRoss Salary'];
    function onSubmit(formModel, data, model) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.StartDate = model.StartDate||'01/01/2019';
        formModel.EndDate = model.EndDate || '01/12/2100';
    };
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'EmployeeBonusDetails',
            url: '/Content/IqraPharmacy/PayrollArea/Content/Js/EmployeeBonus/OnDetails.js',
        });
    };
    function onGenerate(model) {
        Global.Add({
            model: model,
            name: 'EmployeeBonusDetails',
            url: '/Content/IqraPharmacy/PayrollArea/Content/EmployeeBonus/OnGenerate.js',
        });
    };
    function onUserDetails(id) {
        Global.Add({
            UserId: id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function getRelationTypeFilter() {
        return {
            DropDown: {
                dataSource: [
                    { text: 'Select Type', value: '' },
                    { text: 'Employee', value: '0' },
                    { text: 'Designation', value: '1' },
                    { text: 'All Employees', value: '2' },
                    { text: 'Employee Excluded', value: '3' }
                ]
            }
        };
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        this.Updator && elm.find('.updator').append('</br><small><small>' + this.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
    };
    function onDataBinding(response) {
        var types = getRelationTypeFilter().DropDown.dataSource,type=0;
        response.Data.Data.each(function () {
            type = this.RelationType + 1;
            this.RelationTypeStr = types[type] && types[type].text || '';
            if (this.RelationType==2) {
                this.Relative = 'All Users';
            }
        });
    };
    function setData() {
        accessModel = {};
        if (accessList.IsError) {
            
        } else {
            accessList.Data.each(function () {
                this.each(function () {
                    accessModel[this + ''] = true;
                });
            });
        }
        if (!accessModel.Create) {
            $('#btn_add_new').remove();
        }
        return accessModel;
    };
    function getAdditionalField() {
        return [
                    { field: 'Remarks',required:false, position: 5, add: { type: 'textarea', sibling: 1 } }
        ]
    };
    function getAdd() {
        accessModel = accessModel || setData();
        var relativeUrl = '/EmployeeArea/Employee/AutoComplete', model = {
            Id: 'RelativeId',
            title: 'Relation With',
            position: 3,
            url: function () {
                return relativeUrl;
            },
            Type: 'AutoComplete',
            Add: { sibling: 3 }
        };
        if (accessModel.Edit || accessModel.Create) {
            return {
                onSubmit: onSubmit,
                save: '/PayrollArea/EmployeeBonus/Create',
                saveChange: '/PayrollArea/EmployeeBonus/Edit',
                additionalField: getAdditionalField(),
                dropdownList: [
             {
                 Id: 'BonusStructureId',
                 position: 1,
                 url: '/PayrollArea/BonusStructure/AutoComplete',
                 Type: 'AutoComplete',
                 Add: { sibling: 3 }
             }, {
                 Id: 'RelationType',
                 position: 2,
                 dataSource: getRelationTypeFilter().DropDown.dataSource,
                 Add: { sibling: 3 },
                 onChange: function (data) {
                     if (data) {
                         console.log(['function (data) {', data]);
                         model.datasource = none;
                         if (data.value == 0) {
                             relativeUrl = '/EmployeeArea/Employee/AutoComplete';
                         } else if (data.value == 1) {
                             relativeUrl = '/EmployeeArea/Designation/AutoComplete';
                         } else if (data.value == 2) {
                             model.datasource = [{ "Id": "00000000-0000-0000-0000-000000000000", "Name": "All Users" }];
                             relativeUrl = '';
                         } else if (data.value == 3) {
                             relativeUrl = '/EmployeeArea/Employee/AutoComplete';
                         }
                         model.Reload();
                     }
                 }
             }, model
                ],
            };
        } else {
            return false;
        }
    };
    function getColumns() {
        return [
                    { field: 'BonusStructure', Add: false, position: 1 },
                    { field: 'RelationTypeStr', actionField: 'RelationType', add: false, title: 'Relation Type', position: 2, actionField: 'PeriodType', filter: getRelationTypeFilter() },
                    { field: 'Relative', title: 'Relation With', Add: false, position: 3, add: { datatype: 'float' } },
                    { field: 'StartDate', required: false, title: 'Start Date', dateFormat: 'dd/MM/yyyy', position: 4 },
                    { field: 'EndDate', required: false, title: 'End Date', position: 5, dateFormat: 'dd/MM/yyyy' },
                    { field: 'Creator', Add: false, className: 'creator', click: onCreatorDetails, position: 7 },
                    { field: 'Updator', Add: false, className: 'updator', click: onUpdatorDetails, position: 7 }
        ];
    };
    Global.List.Bind({
        Name: 'EmployeeBonus',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/PayrollArea/EmployeeBonus/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Bonus Structures ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Actions: [{
                click: onGenerate,
                html: '<span class="icon_container on_approve" style="margin-right: 10px;"><span class="glyphicon glyphicon-open"></span></span>'
            }]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: getAdd(),
        //Edit:false,
        Edit: accessModel.Edit == true,
        remove: accessModel.Delete == true ? { save: '/PayrollArea/EmployeeBonus/Delete' } : false,
    });
})();;

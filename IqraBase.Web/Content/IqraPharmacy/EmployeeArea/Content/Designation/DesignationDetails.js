
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions, gridModel,
        filter = { "field": "DesignationId", "value": "sa", Operation:0 },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Employees ', filter: [filter] };
    function save() {
        
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        filter.value = model.DesignationId;
        page.filter.splice(0, page.filter.length);
        page.filter.push(filter);
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            gridModel.Reload();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/DesignationDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Submit(windowModel.View.find('form'), save);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            if (model.Selected) {
                model.Selected = false;
                $(this).removeClass('i-state-selected');
            } else {
                model.Selected = true;
                $(this).addClass('i-state-selected');
            }
            console.log(model);
        }
        function rowBound(elm) {
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.HasOwnSalary = !!this.OwnSalary;
                this.OwnSalary = this.OwnSalary || this.DesignationSalary;
            });
        };
        function getOptions() {
            var opts = {
                Name: 'Employee',
                Grid: {
                    elm: windowModel.View.find('#user_grid'),
                    columns: [
                        { field: 'Name', filter: true, position: 1 },
                        { field: 'Designation', filter: true, Add: false },
                        { field: 'DesignationSalary', Add: false },
                        { field: 'OwnSalary', Add: false },
                        { field: 'Phone', filter: true, position: 3 },
                        { field: 'Email', filter: true, position: 4 }
                    ],
                    url: '/Employee/Get',
                    page: page,
                    onDataBinding: onDataBinding,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            };
            opts.Edit = {
                onSubmit: onSubmit,
                onShow: function (model, formInputs, dropDownList, IsNew, windowModel, formModel) {
                    if (IsNew) {
                        $(formInputs['UserName']).prop('disabled', false);
                        $(formInputs['Password']).prop('disabled', false);
                    } else {
                        $(formInputs['UserName']).prop('disabled', true);
                        $(formInputs['Password']).prop('disabled', true);
                    }
                },
                save: '/Employee/Create',
                saveChange: '/Employee/Edit',
                dropdownList: [
                    { Id: 'DesignationId', url: '/Designation/DropDown', position: 2 },
                ],
                additionalField: [
                    { field: 'Password', Add: { type: 'password' }, position: 6 },
                    { field: 'PAddress', title: 'Current Address', Add: { type: 'textarea' }, position: 7 },
                    { field: 'CAddress', title: 'Current Address', Add: { type: 'textarea' }, position: 8 },
                    { field: 'UserName', filter: true, position: 5 }
                ]
            };
            opts.remove = { save: '/Employee/Delete' };
            console.log(opts);
            return opts;
        };
        this.Bind = function () {
            Global.List.Bind(getOptions());
        }
    }).call(service.Grid = {});
};
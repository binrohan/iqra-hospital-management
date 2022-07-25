
var Controller = new function (none) {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "UserId", "value": "", Operation: 0 },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Employees ', filter: [filter] };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    }
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    function loadUser(callBack) {
        if (dataSource[callerOptions.UserId]) {
            callBack(dataSource[callerOptions.UserId]);
        } else {
            Global.CallServer('/Employee/Details?Id=' + callerOptions.UserId, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.UserId] = response.Data;
                    callBack(response.Data);
                } else {
                    //error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                //error.Save(response, saveUrl);
            }, null, 'Get');
        }
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        callerOptions.dataModel = none;
        filter.value = model.UserId;
        page.filter.splice(0, page.filter.length);
        page.filter.push(filter);
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/UserDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {},userId;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
            }
            reset();
            windowModel.View.find('#basic_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function populate(model) {
            callerOptions.dataModel = model;
            for (var key in formModel) {
                if (typeof model[key] != 'undefined') {
                    formModel[key] = model[key];
                    console.log(model[key]);
                }
            }
            formModel.Password = '******';
        };
        function load() {
            loadUser(populate);
        };
        this.Bind = function () {
            bind();
            if (userId === callerOptions.UserId) {
                return;
            }
            load();
            userId = callerOptions.UserId;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel,userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#sales_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onDetails(model) {
            Global.Add({
                name: 'SaleInfo',
                url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
                SaleInfoId: model.Id
            });
        };
        function rowBound(elm) {
            if (this.SalePrice <= this.TradePrice) {
                elm.css({ color: 'red' });
            }
        };
        function onComputerDetails(model) {
            Global.Add({
                ComputerId: model.ComputerId,
                name: 'ComputerDetails',
                url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
            });
        };
        function onDataBinding(response) {
            var total = 0;
            response.Data.Data.each(function () {
                this.TradePrice = this.TradePrice.toFloat();
                total += this.SalePrice;
            });
            console.log(total);
        };
        function getOptions() {
            var opts = {
                Name: 'Employee',
                Grid: {
                    elm: windowModel.View.find('#salse_info_grid'),
                    columns: [
                        { field: 'VoucherNo', title: 'Voucher', filter: true, click: onDetails },
                        { field: 'Customer', filter: true },
                        { field: 'ItemCount', title: 'Item Count' },
                        { field: 'SalePrice', title: 'Sale Price' },
                        { field: 'TradePrice', title: 'Trade Price' },
                        { field: 'TotalDiscount', title: 'Discount' },
                        { field: 'CreatedAt', title: 'Created At', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'Computer', filter: true, Click: onComputerDetails }
                    ],
                    url: '/ItemSales/GetByUser',
                    page: page,
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Printable:false
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        }
    }).call(service.SalseInfo = {});
    (function () {
        var gridModel, userId;
        function onGenerateSalary() {
            Global.Add({
                UserId: callerOptions.UserId,
                callerOptions:callerOptions,
                url: '/Content/IqraPharmacy/SalaryArea/Content/Salary/GenerateSalary.js',
                onSaveSuccess: function (model) {
                    gridModel && gridModel.Reload();
                }
            });
        };
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.List.Bind(getOptions());
                windowModel.View.find('#btn_generate_salary').click(onGenerateSalary);
            }
            reset();
            windowModel.View.find('#salary_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
        };
        function rowBound(elm) {
            if (this.IsDeleted) {
                elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
                elm.find('a').css({ color: 'red' });
            }
            elm.find('.bonus').append('</br><small><small>' + this.Bonus.toMoney() + '</small></small>');
            elm.find('.payable').append('</br><small><small>' + this.PaidAmount.toMoney() + '</small></small>');
            this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        };
        function onDataBinding(response) {

        };
        function onAddPaid(model) {
            model = Global.Copy({}, model, true); 
            model.TotalAmount = model.NetPayable;
            model.PayableAmount = model.NetPayable - model.PaidAmount;
            model.PaidAmount = model.PayableAmount;
            model.Remarks = '';
            Global.Add({
                name: 'Add Paid',
                model:model,
                columns: [
                    { field: 'PayableAmount', add: { datatype: 'float' } },
                    { field: 'PaidAmount', add: { datatype: 'float' } },
                    { field: 'Remarks', add: { type: 'textarea', sibling: 1 }, required: false }
                ],
                onSubmit: function (formModel, data) {
                    formModel.PayableAmount = parseFloat(formModel.PayableAmount || '0');
                    formModel.PaidAmount = parseFloat(formModel.PaidAmount || '0');
                    formModel.Year = data.Year;
                    formModel.Year = data.Year;
                    formModel.Month = data.Month;
                    formModel.TotalAmount = data.TotalAmount;
                    formModel.SalaryPaymentId = data.Id;
                    formModel.EmployeeId = data.EmployeeId;
                    formModel.Id = none;
                    return formModel.PaidAmount <= formModel.PayableAmount;
                },
                saveChange: '/SalaryArea/SalaryRepayment/Create',
            });
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                onSaveSuccess: function (response) {
                    
                },
                url: '/Content/IqraPharmacy/SalaryArea/Content/SalaryRepayment/OnDetails.js',
            });
        };
        function getOptions() {
            var opts = {
                Name: 'Employee',
                Grid: {
                    elm: windowModel.View.find('#salary_info_grid'),
                    columns: [
                        { field: 'Designation', filter: true,click:onDetails },
                        { field: 'Basic' },
                        { field: 'LateEntry', title: 'Late Entry' },
                        { field: 'Absent' },
                        { field: 'ScheduledBonus', title: 'Bonus', className: 'bonus' },
                        { field: 'OverTime' },
                        { field: 'Deduction' },
                        { field: 'Advance' },
                        { field: 'Loan' },
                        { field: 'NetPayable', title: 'Payable', className: 'payable' },
                        { field: 'Creator', className: 'creator' },
                    ],
                    url: '/SalaryArea/SalaryPayment/GetByUser',
                    page: page,
                    onDataBinding: onDataBinding,
                    rowbound: rowBound,
                    Printable: false,
                    Actions: [{
                        click: onAddPaid,
                        html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
                    }]
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        }
    }).call(service.SalaryInfo = {});
    (function () {
        var gridModel, userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.List.Bind(getOptions());
                windowModel.View.find('#btn_add_new_salary').click(onAddIncrement);
            }
            reset();
            windowModel.View.find('#increment_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[3]).addClass('active');
        };
        function onSubmit(formModel, data,model) {
            formModel.ActivatedFrom = callerOptions.UserId;
            formModel.ActivatedFrom = model.ActivatedFrom;
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

        };
        function onAddIncrement() {
            Global.Add({
                loadUser: loadUser,
                UserId: callerOptions.UserId,
                url: '/Content/IqraPharmacy/SalaryArea/Content/Increment/AddIncrement.js',
                onSaveSuccess: function (model) {
                    var user = dataSource[callerOptions.UserId];
                    user.OwnSalary = model.Salary;
                    user.DesignationId = model.DesignationId;
                    gridModel && gridModel.Reload();
                }
            });
        };
        function getOptions() {
            var opts = {
                Name: 'Increment',
                Grid: {
                    elm: windowModel.View.find('#increment_info_grid'),
                    columns: [
                        { field: 'PreviousSalary',add:false },
                        { field: 'CurrentSalary', title: 'IncrementedSalary', Add: {dataType:'int'} },
                        { field: 'EffectiveFrom', title: 'ActivatedFrom', dateFormat: 'dd/MM/yyyy' },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', add: false },
                        { field: 'Remarks', filter: true, add: {sibling:1,type:'textarea'} }
                    ],
                    url: '/Increment/GetByUser',
                    page: page,
                    onDataBinding: onDataBinding,
                    Printable: false
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        }
    }).call(service.IncrementInfo = {});
    (function () {
        var gridModel, userId;
        function bind() {
            reset();
            windowModel.View.find('#leave_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[4]).addClass('active');
        }
        this.Bind = function () {
            //console.log([{ Date: new Date(), EmployeeId: callerOptions.UserId }, callerOptions]);
            bind();
            Global.Add({
                model: { Date: new Date(), EmployeeId: callerOptions.UserId },
                modules: ['Attendance', 'EmployeeShift', 'Weekend', 'LeaveItem', 'LateEntry', 'OverTime'],
                url: '/Content/IqraPharmacy/EmployeeArea/Content/Calendar.js',
                Container: windowModel.View.find('#leave_info_grid')
            });
        }
    }).call(service.LeaveInfo = {});
};
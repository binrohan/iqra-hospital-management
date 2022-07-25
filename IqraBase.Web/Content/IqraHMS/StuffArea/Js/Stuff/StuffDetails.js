
var Controller = new function () {
    var callarOptions, service = {};

    function onCreate(func) {
        Global.Add({
            EmployeeId: callarOptions.StuffId,
            name: 'AddEmployeeDetails',
            url: '/Content/IqraHMS/StuffArea/Js/Stuff/AddEmployeeDetails.js',
            onSaveSuccess: function () {
                alert('Added Successfully');
            }
        });
    };
    this.Show = function (model) {
        callarOptions = model;
        Global.Add({
            title: 'Employee Details',
            model: model.model,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Name', title: 'Name', position: 1 },
                        { field: 'Email', title: 'Email', position: 2 },
                        { field: 'Gender', title: 'Gender', position: 3 },
                        { field: 'EmployeeCode', title: 'Stuff Code', filter: true, position: 4, Add: false },
                        { field: 'EmployeeTypeName', title: 'EmployeeType', filter: true, position: 5, Add: false, add: { sibling: 4 } },
                        { field: 'DesignationName', title: 'Designation', filter: true, position: 6, Add: false, add: { sibling: 4 } },
                        { field: 'Phone', title: 'Mobile', filter: true, position: 7, width: 110 },
                        //{ field: 'PassWord', title: 'PassWord', position: 8, filter: true, add: { type: 'password' } },
                        { field: 'PAddress', title: 'Parmanent Address', Add: { type: 'textarea' }, required: false },
                        { field: 'CAddress', title: 'Current Address', Add: { type: 'textarea' } },
                        { field: 'CreatedAt', title: 'Created At', dateFormat: 'dd mmm-yyyy', Add: false },
                        { field: 'UpdatedAt', title: 'Updated At', dateFormat: 'dd mmm-yyyy', Add: false },
                        { field: 'Remarks', title: 'Remarks', add: { type: 'textarea' }, required: false }
                    ],
                    Id: callarOptions.StuffId,
                    DetailsUrl: function () {
                        return '/StuffArea/Stuff/Details?Id=' + callarOptions.StuffId;
                    }
                }, {
                    title: 'More Details',
                    Grid: [function (windowModel, container, position, model, func) {
                        var btn = $(`<div id="button_container" class="empty_style button_container row">
                                                <a href="#" class="btn btn-white btn-success btn-round pull-right" id="btn_add_new" style="margin-left: 1%"><span class="glyphicon glyphicon-edit"></span>Change</a>
                                            </div>`);
                        container.find('.columns_container').prepend(btn);
                        Global.Click(btn, onCreate);
                    }],
                    Columns: [
                        { field: 'Name', title: 'Name', position: 1 },
                        { field: 'Email', title: 'Email', position: 2 },
                        { field: 'Gender', title: 'Gender', position: 3 },
                        { field: 'FatherName', title: 'FatherName', position: 3 },
                        { field: 'MotherName', title: 'MotherName', position: 3 },
                    ],
                    Id: callarOptions.StuffId,
                    DetailsUrl: function () {
                        return '/StuffArea/Stuff/Details?Id=' + callarOptions.StuffId;
                    }
                }
            ],
            name: 'OnPatientDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=PatientDetails',
        });
    };
};







//var Controller = new function () {
//    var service = {}, windowModel, callerOptions,
//        filter = { "field": "StuffId", "value": "", Operation: 0 };
//    function close() {
//        windowModel && windowModel.Hide();
//    };
//    function reset() {
//        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
//        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
//    }
//    function setTabEvent() {
//        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
//            service[this.dataset.field].Bind();
//        });
//    };
//    this.Show = function (model) {
//        callerOptions = model;
//        filter.value = model.StuffId;
//        if (windowModel) {
//            windowModel.Show();
//            service.BasicInfo.Bind();
//        } else {
//            Global.LoadTemplate('/Content/IqraHMS/StuffArea/Templates/StuffDetails.html', function (response) {
//                windowModel = Global.Window.Bind(response, { width: '95%' });
//                windowModel.View.find('.btn_cancel').click(close);
//                windowModel.Show();
//                service.BasicInfo.Bind();
//                setTabEvent();
//            }, noop);
//        }
//    };

//    (function () {
//        var isBind, formModel = {}, dataSource = {}, stuffId;
//        function bind() {
//            if (!isBind) {
//                isBind = true;
//                Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
//            }
//            reset();
//            windowModel.View.find('#basic_info').addClass('in active');
//            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
//        }
//        function populate(model) {
//            for (var key in formModel) {
//                if (typeof model[key] != 'undefined') {
//                    formModel[key] = model[key];
//                }
//            }
//            formModel.CreatedAt = model.CreatedAt.getDate().format('dd/MM/yyyy hh:mm');
//        };
//        function load() {
//            Global.CallServer('/Stuff/Details?Id=' + callerOptions.StuffId, function (response) {
//                if (!response.IsError) {
//                    populate(response.Data);
//                } else {
//                    Global.Error.Show(response, {});
//                }
//            }, function (response) {
//                response.Id = -8;
//                Global.Error.Show(response, {});
//            }, null, 'Get');
//        };
//        this.Bind = function () {
//            bind();
//            if (stuffId === callerOptions.StuffId) {
//                return;
//            }
//            load();
//            stuffId = callerOptions.StuffId;
//        };
//    }).call(service.BasicInfo = {});
//};


var Controller = {};
(function () {
    var that = this, gridModel, callarOptions = {}, model = {}, formModel = {}, filters;
    function getDoctorWiseColumns() {
        return [{ field: 'Doctor', title: 'Doctor', filter: true }].concat(getSummaryClmn())
    };
    function onRegistration() {
        Global.Add({
            name: 'onNewRegistration',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/Registration.js',
            onSaveSuccess: function (response) {
                //alert('Registration Successfully');
                model.gridModel && model.gridModel.Reload();
                onAppointmentCreate({ PatientId: response.Id });
            }
        });
    };
    // onAppointmentCreate is for new patient apoointment with password
    function onAdd(data) {
        Global.Add({
            model: data,
            name: 'AddPatient',
            url: '/Content/IqraHMS/AppointmentArea/Js/NonePatientAppointmentCreate.js',
            onSaveSuccess: function (response) {
                alert('Appointed Successfully.\n Your Serial No. is ' + response.Data);
                model.gridModel && model.gridModel.Reload();
            }
        });
    };
    // onAppointmentCreate is for existing patient apoointment without password
    function onAppointmentCreate(model) {
        Global.Add({
            PatientId: model.PatientId,
            name: 'AddPatient',
            url: '/Content/IqraHMS/AppointmentArea/Js/PatientAppointmentCreate.js',
            onSaveSuccess: function (response) {
                alert('Appointed Successfully.\n Your Serial No. is ' + response.Data);
                model.gridModel && model.gridModel.Reload();
            }
        });
    };
    function onSerialNoPrint(model) {
        Global.Add({
            AppointmentId: model.Id,
            name: 'AppointmentTokenPreview',
            url: '/Content/IqraHMS/BillingArea/Js/AppointmentCharge/AppointmentChargePrint.js',
        });
    };
    function onPatientDetails(model) {
        Global.Add({
            PatientId: model.PatientId,
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };
    function onDoctorDetails(model) {
        Global.Add({
            DoctorId: model.Id,
            name: 'DoctorDetails',
            url: '/Content/IqraHMS/DoctorsArea/Js/Doctor/DoctorDetails.js',
        });
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        this.Updator && elm.find('.updator').append('</br><small><small>' + this.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
    };
    function getColumns() {
        return [
                { field: 'PatientCode', title: 'Patient Code', filter: true, click: onPatientDetails },
                { field: 'PatientName', title: 'Patient', filter: true, click: onPatientDetails },
                { field: 'Age' },
                { field: 'DoctorName', title: 'Doctor', filter: true, click: onDoctorDetails },
                { field: 'SerialNo' },
                { field: 'ArrivalTime', title: 'Arrival Time', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'PatientMobile', title: 'Mobile', filter: true, width: 120 },
                { field: 'AlternativeMobile', title: 'Alternative Mobile', filter: true, width: 120 },
            { field: 'Remarks', title: 'Description', filter: true },
            { field: 'CAddress', title: 'Current Address', filter: true, sorting: false, required: false, add: { type: 'textarea' } },
            { field: 'PAddress', title: 'Permanent Address', filter: true, sorting: false, required: false, add: { type: 'textarea' } },
                { field: 'CreatedAt', title: 'Created At', dateFormat: 'dd/MM/yyyy hh:mm' }, 
        ];
    };
    function getDoctorColumns(click, firstCol) {
        return [{ field: 'Doctor', filter: true },
        { field: 'PatientAppointment', title: 'Qty', add: false, type: 2 }]
    };
    function getDailyColumns(click, firstCol) {
        return [{ field: 'CreatedAt', title: 'Date', click: click },
            { field: 'Doctor', filter: true },
            { field: 'PatientAppointment', title: 'Qty', add: false, type: 2 }]
    };
    function getDaily(name, dataUrl, click, func) {
        columns = func ? func(): getDailyColumns(click);
        return {
            Name: name,
            Url: dataUrl,
            columns: columns
        }
    };
    function getItemWise() {
        return {
            Name: 'Patient-Wise',
            Url: 'Get',
            columns: getColumns(),
            bound: rowBound,
            isList: true,
            Actions: [{
                click: onAppointmentCreate,
                html: '<a style="margin-right:8px;" class="icon_container" title="Add An Appointment"><span class="glyphicon glyphicon-plus-sign"></span></a>'
            }, {
                    click: onSerialNoPrint,
                    html: '<a style="margin-right:8px;" class="icon_container" title="Add An Appointment"><span class="glyphicon glyphicon-print"></span></a>'
                }],
            onConplete: function (model) {
                gridModel = model;
            },
            Add: false,
            Edit: false,
            remove: false,
        }
    };
    function getItems() {
        var tabs = [
            getItemWise(),
            getDaily('Doctor-Wise', 'ByDoctor', none, getDoctorColumns),
            getDaily('Daily', 'GetDaily'),
            getDaily('Monthly', 'GetMonthly')
        ], list = [];
        callarOptions.tabs = callarOptions.tabs || [0, 1, 2, 3];
        callarOptions.tabs.each(function () {
            list.push(tabs[this]);
        });
        return list;
    };
    function setTabs(container) {
        model = {
            container:container,
            Base: {
                Url: '/AppointmentArea/Appointment/',
            },
            items: getItems(),
            periodic: {
                container: '#filter_container',
                field: 'CreatedAt',
                formModel: formModel,
                format: 'yyyy/MM/dd HH:mm',
                filterby: {
                    dataSource: [{ text: 'Date Of Appointment', value: 'DateOfAppointment' }, { text: 'Created-At', value: 'CreatedAt' }]
                }
            },
            Summary: {
                container: container.find('#summary_container'),
                Items: [{ field: 'PatientAppointment',title:'Total', add: false, type: 2 }]
            }
        };
        //Global.Form.Bind(formModel, container.find('#filter_container'));
        Global.Tabs(model);
        
        callarOptions.BaseModel.Reload = function () {
            model.items[0].set(model.items[0]);
        };
    };
    function setDefaultOpt(opt) {
        opt = opt || {};
        setNonCapitalisation(opt);
        callarOptions = opt;
        opt.container = opt.container || $('#page_container');
        opt.BaseModel = opt.BaseModel || {};
        return opt;
    };
    Controller.Show = function (opt) {
        opt = setDefaultOpt(opt);
        var container = opt.container || $('#page_container'), filter = opt.filter;
        setTabs(container, filter);
        opt.OnLoaded && opt.OnLoaded(model);
    };
    (function () {
        function onSelectPatient() {
            Global.Add({
                name: 'PatientSelector',
                url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientSelector.js',
                onSaveSuccess: function (model) {
                    onAppointmentCreate({ PatientId: model.Id });
                }
            });
        };
        Global.Click($('#btn_add_new'), onAdd);
        Global.Click($('#btn_select_patients'), onSelectPatient);
        Global.Click($('#btn_registration'), onRegistration);
    })();
})();

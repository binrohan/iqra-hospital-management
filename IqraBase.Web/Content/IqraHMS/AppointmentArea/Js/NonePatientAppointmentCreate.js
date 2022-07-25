
var Controller = new function () {
    var windowModel, formModel = { ArrivalTime: 'Get Appointment' }, inputs = {}, callerOptions, service = {};
    function printAppointmentToken(id) {
        Global.Add({
            type: 'New',
            AppointmentId: id,
            name: 'AppointmentTokenPreview',
            url: '/Content/IqraHMS/BillingArea/Js/AppointmentCharge/AppointmentChargePrint.js',
        });
    };

    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = Global.Copy({}, formModel, true);
            saveUrl = '/PatientArea/Patient/OnAppointmentCreate';
            if (callerOptions.model) {
                model.PatientId = callerOptions.model.Id;
                saveUrl = '/PatientArea/Patient/OnAppointCreate';
            }
            model.Status = 'well';
            model.PaidStatus = 'Pending';
            model.Id = none;
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(response);
                    close();
                    printAppointmentToken(response.Id);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                alert('Network Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Error.');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate(isFirstTime) {
        if (callerOptions.model) {
            Global.Copy(formModel, callerOptions.model, true);
        } else {
            for (var key in formModel) formModel[key] = '';
        }
        service.DropDown.Reset(isFirstTime);
    };


    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/AddPatient.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                service.DropDown.Bind();
                service.Calendar.Bind();
                service.Age.Bind();
                populate(true);
                windowModel.Show();
            }, noop);
        }
    };
    (function () {
        var dptFilter = { field: 'DepartmentId', Operation: 0 },
        dgnFilter = { field: 'DesignationId', Operation: 0,  },
        doctor = {
            url: '/DoctorsArea/Doctor/AutoComplete',
            page: { 'PageNumber': 1, 'PageSize': 500, filter: [] },
            change: function (data) {
                if (data) {
                    formModel.DoctorFees = data.Fee;
                    formModel.DoctorId = data.Id;
                } else {
                    formModel.DoctorFees = 0;
                    formModel.DoctorId = '';
                }
            }
        },
        department = {
            url: '/CommonArea/Department/AutoComplete',
            change: function (data) {
                if (data) {
                    dptFilter.value = data.Id;
                    degination.page.filter = [dptFilter];
                    if (!dgnFilter.value) {
                        doctor.page.filter = [dptFilter];
                    }
                } else {
                    dptFilter.value = none;
                    if (!dgnFilter.value) {
                        degination.page.filter = [];
                        doctor.page.filter = [];
                    }
                }
                degination.Reload();
                doctor.Reload();
            }
        },
        degination = {
            url: '/CommonArea/Designation/DoctorAutoComplete',
            change: function (data) {
                if (data) {
                    dgnFilter.value = data.Id;
                    doctor.page.filter = [dgnFilter];
                } else if (dptFilter.value) {
                    doctor.page.filter = [dptFilter];
                    dgnFilter.value = none;
                } else {
                    doctor.page.filter = [];
                }
                doctor.Reload();
            }
        },
        gender = {
            dataSource: [
                { text: 'Male', value: 'Male' },
                { text: 'Female', value: 'Female' },
                { text: 'Other', value: 'Other' },
                { text: 'Not Define', value: 'Not Define' }
            ],
            selectedValue: 'Not Define'
        },
        bloodGroup = {
            dataSource: [
                { text: 'A+', value: 'A+' },
                { text: 'A-', value: 'A-' },
                { text: 'B+', value: 'B+' },
                { text: 'B-', value: 'B-' },
                { text: 'AB+', value: 'AB+' },
                { text: 'AB-', value: 'AB-' },
                { text: 'O+', value: 'O+' },
                { text: 'O-', value: 'O-' },
                { text: 'O-', value: 'O-' },
                { text: 'Not Define', value: 'Not Define' }
            ],
            selectedValue: 'Not Define'
        };
        this.Bind = function () {
            doctor.elm = $(inputs['DoctorId']);
            department.elm = $(inputs['DepartmentId']);
            degination.elm = $(inputs['DesignationId']);
            gender.elm = $(inputs['Gender']);
            bloodGroup.elm = $(inputs['BloodGroup']);
            Global.AutoComplete.Bind(doctor);
            Global.AutoComplete.Bind(department);
            Global.AutoComplete.Bind(degination);
            Global.DropDown.Bind(gender);
            Global.DropDown.Bind(bloodGroup);
        };
        this.Reset = function (isFirstTime) {
            if (isFirstTime)
                return;
            formModel.Gender = 'Not Define';
            formModel.BloodGroup = 'Not Define';
            gender.val(formModel.Gender);
            bloodGroup.val(formModel.BloodGroup);
            doctor.val('');
            department.val('');
            degination.val('');
        };
    }).call(service.DropDown = {});
    (function () {
        var container,calendarLoader,doctorId;
        function setContainer() {
            container = $('<div style="position:absolute;top:200px;left:0; width:' + windowModel.FormView.width() + 'px; background-color:#fff;">');
            windowModel.FormView.append(container);
            container.click(prevent).mousedown(prevent);
            return container;
        };
        function setCalendar(cntr) {
            Global.Add({
                model: { Date: new Date(), DoctorId: formModel.DoctorId },
                modules: [],
                url: '/Content/IqraHMS/PatientArea/Js/Appointment/Calendar.js',
                Container: cntr||setContainer(),
                Success: function (time, availability, date) {
                    console.log([time, availability, date]);
                    formModel.ArrivalTime = time.format('dd/MM/yyyy HH:mm');
                    formModel.DoctorAvailabilityId = availability.Id;
                    formModel.TotalAppointment = availability.MaximumPatient;
                    formModel.ScheduleStartAtTime = new Date(date.getTime() + availability.StartAtTime).format('dd/MM/yyyy HH:mm');
                    formModel.ScheduleEndAtTime = new Date(date.getTime() + availability.EndAtTime).format('dd/MM/yyyy HH:mm');
                    close();
                },
                OnComplete: function (loader) {
                    calendarLoader = loader;
                }
            });
        };
        function close() {
            container && container.hide();
        };
        function prevent(e) {
            e.stopPropagation();
        };
        this.Bind = function () {
            $(inputs['ArrivalTime']).click(function (e) {
                if (formModel.DoctorId) {
                    e.stopPropagation();
                    if (container) {
                        container.show();
                        doctorId != formModel.DoctorId &&setCalendar(container);
                    } else {
                        setCalendar();
                    }
                    doctorId = formModel.DoctorId;
                } else {
                    alert('please select doctor first.')
                }
            });
            $(document).click(close).mousedown(close);
            $(inputs['DOA']).mousedown(prevent);
        };
    }).call(service.Calendar = {});
    (function () {
        var maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        function onDatePickerChanged(date) {
            if (date) {
                var currentDate = new Date();
                var value = currentDate.getDate() - date.getDate(), flg = 0;
                if (value < 0) {
                    formModel.Day = (value + maxDays[date.getMonth()]);
                    flg = -1;
                } else {
                    formModel.Day = value;
                }
                value = currentDate.getMonth() - date.getMonth() + flg; flg = 0;
                if (value < 0) {
                    formModel.Month = (value + 12);
                    flg = -1;
                } else {
                    formModel.Month = value;
                }
                formModel.Year = currentDate.getFullYear() - date.getFullYear() + flg;
            } else {
                formModel.Year = 0;
                formModel.Month = 0;
                formModel.Day = 0;
            }
        };
        function onAgeChanged() {
            var date = new Date();
            date.setDate(date.getDate() - parseInt(formModel.Day || '0') || 0);
            date.setMonth(date.getMonth() - parseInt(formModel.Month || '0') || 0);
            date.setFullYear(date.getFullYear() - parseInt(formModel.Year || '0') || 0);
            formModel.DateOfBirth = date.format('dd/MM/yyyy');
        };
        this.Bind = function () {
            (['Day', 'Month', 'Year']).each(function () {
                $(inputs[this + '']).keyup(onAgeChanged).blur(onAgeChanged);
            });
            Global.DatePicker.Bind($(inputs['DateOfBirth']), { format: 'dd/MM/yyyy', onchange: onDatePickerChanged });
        };
    }).call(service.Age = {});
};
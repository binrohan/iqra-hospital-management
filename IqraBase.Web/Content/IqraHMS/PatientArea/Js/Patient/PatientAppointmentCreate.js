
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, service = {};

    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = Global.Copy({}, formModel, true);
            saveUrl = '/PatientArea/Patient/OnAppointmentCreate';
            if (callerOptions.model) {
                model.PatientId = callerOptions.model.Id;
                saveUrl = '/PatientArea/Patient/OnAppointCreate';
            }
            //model.DOB = "\/Date(" + Global.DateTime.GetObject(model.DateOfBirth, 'dd/MM/yyyy hh:mm').getTime() + ")\/";
            model.Status = 'well';
            model.Id = none;
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(response);
                    close();
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                //response.Id = -8;
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
        for (var key in formModel) formModel[key] = '';
        Global.Copy(formModel, callerOptions.model, true);
        service.DropDown.Reset(isFirstTime);
        service.Age.Set();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/PatientAppointmentCreate.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                service.DropDown.Bind();
                service.Calendar.Bind();
                populate(true);
                windowModel.Show();
            }, noop);
        }
    };
    (function () {
        var dptFilter = { field: 'DepartmentId', Operation: 0 },
        dgnFilter = { field: 'DesignationId', Operation: 0, },
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
                    //degination.page.filter = [dptFilter];
                    if (!dgnFilter.value) {
                        doctor.page.filter = [dptFilter];
                    }
                } else {
                    dptFilter.value = none;
                    if (!dgnFilter.value) {
                        //degination.page.filter = [];
                        doctor.page.filter = [];
                    }
                }
                //degination.Reload();
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
        };
        this.Bind = function () {
            doctor.elm = $(inputs['DoctorId']);
            department.elm = $(inputs['DepartmentId']);
            degination.elm = $(inputs['DesignationId']);
            Global.AutoComplete.Bind(doctor);
            Global.AutoComplete.Bind(department);
            Global.AutoComplete.Bind(degination);
        };
        this.Reset = function (isFirstTime) {
            formModel.DoctorId = '';
            if (isFirstTime)
                return;
            doctor.val('');
            department.val('');
            degination.val('');
        };
    }).call(service.DropDown = {});
    (function () {
        var container, calendarLoader, doctorId;
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
                Container: cntr || setContainer(),
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
                        doctorId != formModel.DoctorId && setCalendar(container);
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
        this.Set = function () {
            var date = callerOptions.model.DateOfBirth.getDate();
            formModel.DateOfBirth = date.format('dd/MM/yyyy');
            onDatePickerChanged(date);
        };
    }).call(service.Age = {});
};
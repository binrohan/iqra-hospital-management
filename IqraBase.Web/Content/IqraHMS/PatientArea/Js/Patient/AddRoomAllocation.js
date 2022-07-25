
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = Global.Copy({}, formModel, true),
                saveUrl = '/PatientArea/Patient/OnRoomAllocateCreate';
            if (callerOptions.model) {
                model.PatientId = callerOptions.model.Id;
                saveUrl = '/PatientArea/Patient/OnRoomAllocate';
            }
            model.Status = 'well';
            model.Id = none;
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(formModel, inputs);
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
    function populate() {
        if (callerOptions.model) {
            Global.Copy(formModel, callerOptions.model, true);
        } else {
            for (var key in formModel) formModel[key] = '';
        }
        //Global.Copy(formModel, callerOptions.model, true);
        //formModel.Due = formModel.PaidAmount = callerOptions.model.TradePrice - callerOptions.model.PaidAmount;
    };
    function setDropdown() {
        var filterModel = { field: 'DepartmentId', Operation: 0, value: '00000000-0000-0000-0000-000000000000' }
        var filterRoomModel ={ field: 'RoomId'},
        department = {
            elm: $(inputs['DepartmentId']),
            url: '/CommonArea/Department/AutoComplete',
            change: function (data) {
                if (data) {
                    filterModel.value = data.Id;
                    doctor.Reload();
                }
            }
        },
        doctor = {
            elm: $(inputs['DoctorId']),
            url: '/DoctorsArea/Doctor/AutoComplete',
            page: { 'PageNumber': 1, 'PageSize': 500, filter: [filterModel] },
            change: function (data) {
                console.log(data);
            }
        },
        room = {
            elm: $(inputs['RoomId']),
            url: '/RoomArea/Room/AutoComplete',
            change: function (data) {
                if (data) {
                    filterRoomModel.value = data.Id;
                    bed.Reload();
                }
            }
        },
        bed = {
              elm: $(inputs['BedId']),
              url: '/RoomArea/Bed/AutoComplete',
              page: { 'PageNumber': 1, 'PageSize': 500, filter: [filterRoomModel] },
              change: function (data) {
                  console.log(data);
              }
          },
        gender = {
            elm: $(inputs['Gender']),
            dataSource: [
                { text: 'Male', value: 'Male' },
                { text: 'Female', value: 'Female' },
                { text: 'Other', value: 'Other' }
            ]
        },
        //patientType = {
        //    elm: $(inputs['PatientType']),
        //    dataSource: [
        //        { text: 'In Patient', value: 'In Patient' },
        //        { text: 'Out Patinet', value: 'Out Patient' }
        //    ]
        //},
        bloodGroup = {
            elm: $(inputs['BloodGroup']),
            dataSource: [
                { text: 'A+', value: 'A+' },
                { text: 'A-', value: 'A-' },
                { text: 'B+', value: 'B+' },
                { text: 'B-', value: 'B-' },
                { text: 'AB+', value: 'AB+' },
                { text: 'AB-', value: 'AB-' },
                { text: 'O+', value: 'O+' },
                { text: 'O-', value: 'O-' },
            ]
        };
        Global.AutoComplete.Bind(department);
        Global.AutoComplete.Bind(doctor);
        Global.AutoComplete.Bind(room);
        Global.AutoComplete.Bind(bed);
        Global.DropDown.Bind(gender);
        //Global.DropDown.Bind(patientType);
        Global.DropDown.Bind(bloodGroup);
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/AddRoomAllocation.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                setDropdown();
                populate();
                windowModel.Show();
            }, noop);
        }
    };
};
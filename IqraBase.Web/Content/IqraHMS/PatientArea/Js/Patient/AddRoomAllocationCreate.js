
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;
    
    function printReceipt(id) {
        Global.Add({
            type: 'New',
            BedAllocationId: id,
            name: 'ReceiptPrintPreview',
            url: '/Content/IqraHMS/BillingArea/Js/BedAllocation/PrintBedReceipt.js',
        });
    };

    function getModel() {
        var model = {
            PatientId: callerOptions.PatientId,
            ConsultantId: formModel.DoctorId,
            BedId: formModel.BedId,
            Date: formModel.Date,
            ReferredBy: formModel.ReferredBy,
            PatientName: formModel.Name,
            FatherName: formModel.FatherName,
            MotherName: formModel.MotherName,
            DateOfBirth: formModel.DateOfBirth.getDate().format("yyyy/MM/dd")+' 00:00',
            Gender: formModel.Gender,
            ProfessionId: formModel.ProfessionId,
            PresentAddress: formModel.PresentAddress,
            PermanentAddress: formModel.PermanentAddress,
            DiseaseTypeId: formModel.DiseaseTypeId,
            EmergencyContactNameOne: formModel.EmergencyContactNameOne,
            EmergencyContactNumberOne: formModel.EmergencyContactNumberOne,
            EmergencyContactNameTwo: formModel.EmergencyContactNameTwo,
            EmergencyContactNumberTwo: formModel.EmergencyContactNumberTwo,
            AdmissionStatusId: formModel.AdmissionStatusId,
            CurrentStatusId: formModel.AdmissionStatusId,
            Status: 'Admitted',
            Advance: formModel.Advance,
            AccountId: formModel.AccountId,
            Remarks: formModel.Remarks
        };
        return model;
    };
    //PatientName
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = getModel(),
                saveUrl = '/AdmissionArea/Admission/New';
            //model.Id = none;
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(formModel, inputs);
                    close();
                    printReceipt(response.Id);
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
    function populate(model) {

        for (var key in model) {
            formModel[key] = model[key] || '';
        }
        formModel.DOB = model.DateOfBirth.getDate().format("dd-mmm' yyyy");
        formModel.PresentAddress = model.CAddress;
        formModel.EmergencyContactNumberOne = model.AlternativeMobile||'';
        formModel.EmergencyContactNumberTwo = model.Mobile||'';
    };
    function setDropdown() {
        var filterRoomModel = { field: 'RoomId', value: '00000000-0000-0000-0000-000000000000', Operation: 0 },
            dptFilter = { field: 'DepartmentId', Operation: 0 },
            dgnFilter = { field: 'DesignationId', Operation: 0, },
            doctor = {
                elm: $(inputs['DoctorId']),
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
                elm: $(inputs['DepartmentId']),
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
                elm: $(inputs['DesignationId']),
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
            room = {
                elm: $(inputs['RoomId']),
                url: '/RoomArea/Room/AvailableRoomAutoCmpl',
                change: function (data) {
                    if (data) {
                        filterRoomModel.value = data.Id;
                        bed.Reload();
                    }
                }
            },
            bed = {
                elm: $(inputs['BedId']),
                url: '/RoomArea/Bed/AvailableBedAutoCmpl',
                page: { 'PageNumber': 1, 'PageSize': 500, filter: [filterRoomModel] },
                change: function (data) {
                    if (data) {
                        formModel.BedNumber = data.BedNumber;
                    } else {
                        formModel.BedNumber ='';
                    }
                }
            },
            diseaseType = {
                elm: $(inputs['DiseaseTypeId']),
                url: '/CommonArea/DiseaseType/AutoComplete'
            },
            admissionStatusId = {
                elm: $(inputs['AdmissionStatusId']),
                url: '/PatientArea/PatientStatus/AutoComplete'
            },
            referredBy = {
                elm: $(inputs['ReferredBy']),
                url: '/ReferralArea/Reference/AutoComplete'
            },
            accountId = {
                elm: $(inputs['AccountId']),
                url: '/CommonArea/AccountReference/AutoComplete?reference=Admission'
            };

        Global.AutoComplete.Bind(department);
        Global.AutoComplete.Bind(degination);
        Global.AutoComplete.Bind(doctor);
        Global.AutoComplete.Bind(room);
        Global.AutoComplete.Bind(bed);
        Global.AutoComplete.Bind(diseaseType);
        Global.AutoComplete.Bind(admissionStatusId);
        Global.AutoComplete.Bind(referredBy);
        Global.AutoComplete.Bind(accountId);
    };

    function loadDetails() {
        windowModel.Wait('Please wait while loading Patient details.......');
        Global.CallServer('/PatientArea/Patient/Details?Id=' + callerOptions.PatientId, function (response) {
            windowModel.Free();
            if (!response.IsError) {

                populate(response.Data);
            } else {

            }
        }, function (response) {
            response.Id = -8;
            windowModel.Free();
        }, {}, 'GET');
    };
    function show() {
        loadDetails();
    };
    this.Show = function (model) {
        callerOptions = model;
        //
        if (windowModel) {
            windowModel.Show();
            show();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/AddRoomAllocationCreate.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                setDropdown();
                show();
                windowModel.Show();
            }, noop);
        }
    };
};
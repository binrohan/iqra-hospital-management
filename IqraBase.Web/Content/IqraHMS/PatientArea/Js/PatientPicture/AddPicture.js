
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;
    function save() {
        if (formModel.IsValid) {
            windowModel.View.find('#progress_ba_container').show();
            windowModel.Wait('Please Wait while saving data......');
            var model = {
                Id: callerOptions.PatientId,
                Remarks: formModel.Remarks,
                ActivityId: window.ActivityId
            };
            model.Img = { IsFile: true, File: windowModel.Image.files[0] }
            Global.Uploader.upload({
                data: model,
                url: '/PatientArea/Patient/AddPicture',
                onProgress: function (data) {
                    windowModel.View.find('#progress_ba_container #myBar').css({ width: (data.loaded / data.total) * 100 + '%' });
                },
                onComplete: function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        windowModel.View.find('#progress_ba_container #myBar').css({ width: 100 + '%' });
                        callerOptions.onSaveSuccess();
                        close();
                    } else if (response.Id === -4) {
                    }
                    else
                        Global.Error.Show(response);
                },
                onError: function () {
                    windowModel.Free();
                    response.Id = -8;
                    Global.Error.Show(response, { user: '' })
                }
            });
        }
    }
    function readURL() {
        var input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#selected_img').html('<img src="' + e.target.result +'" style="max-width: 100%;max-height: 200px;">');
            }
            reader.readAsDataURL(input.files[0]);
        }
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/AddPicture.html', function (response) {
                windowModel = Global.Window.Bind(response);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_save').click(save);
                windowModel.Image = $('#btn_image').change(readURL)[0];
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.Show();
            }, noop);
        }
    };
    this.Status = function (txt) {
        if (txt == 'End') {
            windowModel.View.find('.status_container').empty();
            windowModel.View.find('#progress_ba_container #myBar').css({ width: 0 });
            close();
            callerOptions.Success();
        } else {
            windowModel.View.find('.status_container').prepend('<div class="col-md-12">' + txt + '</div>');
        }
    };
};
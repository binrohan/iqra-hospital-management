var Controller = new function () {
    var that = this, formModel = {}, oldTitle = document.title, windowModel, formInputs,stream;
    function save() {
        let canvas = windowModel.View.find("#canvas")[0];
        canvas.toBlob(function (blob) {
            options.OnSave(canvas.toDataURL(),blob);
            cancel();
        });
    };
    function cancel() {
        stream && stream.getTracks().forEach(function (track) {
            track.stop();
        });

        windowModel.Hide(function () {
        });
        document.title = oldTitle;
    };
    function setEvent() {
        //windowModel.View.find('#start-camera').click(() => {
        //    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        //    video.srcObject = stream;
        //});
        let canvas = windowModel.View.find("#canvas")[0];
        windowModel.View.find('#click-photo').click(() => {
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let image_data_url = canvas.toDataURL('image/jpeg');
            // data url of the image
            console.log(image_data_url);
        });
    };
    function show(model) {
        windowModel.Show();
        oldTitle = document.title;
        document.title = formModel.Title = 'Take Picture';
        let canvas = windowModel.View.find("#canvas")[0];
        let video = windowModel.View.find("#video")[0];
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function (strm) {
            console.log(['stream', stream, video]);
            stream = strm;
            video.srcObject = stream;
            video.play();
        });
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        windowModel.View.find('.btn_save').click(save);
        show();
        setEvent();
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/CandidateReportArea/Templates/WebCamPicture.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
}
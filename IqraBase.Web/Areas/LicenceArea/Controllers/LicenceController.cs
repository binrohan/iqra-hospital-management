using IqraBase.Data.Entities.LicenceArea;
using IqraBase.Data.Models.LicenceArea;
using IqraBase.Service.LicenceArea;
using IqraBase.Web.Controllers;
using IqraBase.Web.SetUp;
using IqraBaseService.Controllers;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace IqraBase.Web.Areas.LicenceArea.Controllers
{
    public class LicenceController : BaseController
    {
        // GET: /LicenceArea/Licence/ComputerDetails
        LicenceService _service;
        public LicenceController()
        {
            _service = new LicenceService();
        }
        public virtual ActionResult Index()
        {
            return View();
        }
        public async Task<JsonResult> AddLicenseFile(HttpPostedFileBase file)
        {
            var model = new LicenceModel();
            model.Content = new byte[file.InputStream.Length];
            file.InputStream.Read(model.Content, 0, (int)file.InputStream.Length);
            return Json(await _service.Create(model), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> Create(LicenceModel model)
        {
            if(model.Bytes!=null)
            model.Content = model.Bytes.ToArray();
            return Json(await _service.Create(model), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> Update(LicenceModel model)
        {
            if (model.Bytes != null)
                model.Content = model.Bytes.ToArray();
            return Json(await _service.Update(model), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> Get(Page page)
        {
            return Json(await _service.Get(page), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetActive()
        {
            var model = _service.GetActive();
            if(!model.IsError&& model.Data != null)
            {
                model.Data.ci = Computer.Id;
            }
            return Json(model, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ComputerDetails()
        {
            return Json(new { Computer.Id, Computer.Name, Computer.IPAddress }, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> Remove(Guid licenceId)
        {
            return Json(await _service.Remove(licenceId), JsonRequestBehavior.AllowGet);
        }
    }
}
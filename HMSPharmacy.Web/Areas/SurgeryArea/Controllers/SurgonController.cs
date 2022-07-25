

using IqraHMS.OT.Data.Entities.OTServiceArea;
using IqraHMS.OT.Data.Entities.SurgeryArea;
using IqraHMS.OT.Data.Models.SurgeryArea;
using IqraHMS.OT.Service.SurgonArea;
using IqraHMS.OT.Web.Controllers;
using IqraService.Search;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.SurgeryArea.Controllers
{
    public class SurgonController : DropDownBaseController<Surgon, SurgonModel>
    {
        // GET: AccountArea/Surgon/AutoComplete
        SurgonService __service;
        public SurgonController()
        {
            service = _service = __service = new SurgonService();
        }
        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
        }

        public async Task<JsonResult> ExceptGetAll(Page page)
        {
            return Json(await __service.ExceptGetAll(page));
        }
    }
}
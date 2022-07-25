

using IqraHMS.OT.Data.Entities.OTServiceArea;
using IqraHMS.OT.Service.SurgeryArea;
using IqraHMS.OT.Web.Controllers;

namespace IqraHMS.OT.Web.Areas.SurgeryArea.Controllers
{
    public class SurgeryController : DropDownBaseController<Surgery, SurgeryModel>
    {
        // GET: AccountArea/Surgery/AutoComplete
        SurgeryService __service;
        public SurgeryController()
        {
            service = _service = __service = new SurgeryService();
        }
    }
}
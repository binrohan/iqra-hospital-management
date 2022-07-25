using IqraBase.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Models.OperationArea
{
    public class OperationChangeStatusModel : AppBaseModel
    {
        public string NewStatus { get; set; }
    }
}

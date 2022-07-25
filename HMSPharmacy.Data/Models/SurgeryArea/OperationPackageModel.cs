using IqraBase.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Models.SurgeryArea
{
    public class OperationPackageModel : AppBaseModel
    {
        public Guid SurgonId { get; set; }
        public Guid SurgeryId { get; set; }
        public double Price { get; set; }
        public double MinPrice { get; set; }
        public double OriginalCost { get; set; }
        public string Code { get; set; }
    }
}

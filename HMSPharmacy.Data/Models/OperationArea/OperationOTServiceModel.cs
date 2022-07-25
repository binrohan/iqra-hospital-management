using IqraBase.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Models.OperationArea
{
    public class OperationOTServiceModel : AppBaseModel
    {
        public double Payable { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public double Quantity { get; set; }
        public Guid OperationId { get; set; }
        public Guid RefOTServiceId { get; set; }
    }
}

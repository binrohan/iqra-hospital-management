using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Models.OperationArea
{
    public class OperationPaymentModel
    {
        public Guid OperationId { get; set; }
        public double Amount { get; set; }
        public string PaymentBy { get; set; }
        public string Remarks { get; set; }
    }
}

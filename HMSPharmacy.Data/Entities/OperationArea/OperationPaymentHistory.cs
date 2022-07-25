using IqraBase.Data;
using IqraBase.Data.Entities;
using IqraHMS.OT.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Entities.OperationArea
{

    [Table("OperationPaymentHistory")]
    [Alias("prtnpymnthstry")]
    public class OperationPaymentHistory : AppBaseEntity
    {
        public double Amount { get; set; }
        public Guid ReceivedBy { get; set; }
        public DateTime ReceivedAt { get; set; }
        public double PaymentLeft { get; set; }
    }
}

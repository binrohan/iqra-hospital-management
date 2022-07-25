using IqraBase.Data;
using IqraBase.Data.Entities;
using IqraBase.Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Models.SurgeryArea
{
    public class OperationPackageOTServiceModel : AppBaseModel
    {
        public Guid OperationPackageId { get; set; }
        public Guid ServiceId { get; set; }
        public double Quantity { get; set; }
    }
}

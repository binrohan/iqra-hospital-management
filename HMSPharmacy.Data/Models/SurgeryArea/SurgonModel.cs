using IqraBase.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Models.SurgeryArea
{
    public class SurgonModel : DropDownBaseModel
    {
        public Guid DoctorId { get; set; }
        public Guid SurgeryId { get; set; }
        public double Charge { get; set; }
        public string Status { get; set; }
    }
}

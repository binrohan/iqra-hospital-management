using IqraBase.Data;
using IqraBase.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Entities.SurgeryArea
{
    [Table("Surgon")]
    [Alias("srgn")]
    public class Surgon : DropDownBaseEntity
    {
        public Guid DoctorId { get; set; }
        public Guid SurgeryId { get; set; }
        public double Charge { get; set; }
        public string Status { get; set; }
    }
}

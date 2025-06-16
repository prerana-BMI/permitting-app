using System;
using System.Collections.Generic;

namespace Data.DbEntities
{
    public partial class CityMaster
    {
        public int Id { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
    }
}

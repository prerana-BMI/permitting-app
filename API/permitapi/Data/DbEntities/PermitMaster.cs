using System;
using System.Collections.Generic;

namespace Data.DbEntities
{
    public partial class PermitMaster
    {
        public int Id { get; set; }
        public string? Category { get; set; }
        public string? TypeOfProject { get; set; }
        public string? Level { get; set; }
        public string? State { get; set; }
        public string? County { get; set; }
        public string? City { get; set; }
        public string? PermitName { get; set; }
        public string? RegulatoryAgencyName { get; set; }
        public int? RegulatoryAgencyId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}

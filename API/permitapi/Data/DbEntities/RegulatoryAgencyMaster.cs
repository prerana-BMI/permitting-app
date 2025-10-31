using System;
using System.Collections.Generic;

namespace Data.DbEntities
{
    public partial class RegulatoryAgencyMaster
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? Contact { get; set; }
        public string? Link { get; set; }
        public string? Department { get; set; }
        public string? ContactPerson { get; set; }

    }
}

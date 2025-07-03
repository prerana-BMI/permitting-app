
using AutoMapper;
using contract.Entities;
using Data.DbEntities;
namespace permitapi
{
   

public class MappingProfile : Profile
{
        public MappingProfile()
        {
            CreateMap<EPermitMaster, PermitMaster>();
            CreateMap<EPermitMasterDetail, PermitMasterDetail>();
            
        // Add other mappings here
        }
}
}
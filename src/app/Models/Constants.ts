export class Constants{
    public static GetAllProjectMaster  = '/api/RFI/GetProjectMasterList';
    public static GetAllUsers  = '/api/Account/GetUsers';
    public static IsUserExist  = '/api/Account/IsUserExist?UserName=';
    public static GetCityBySearchText  = '/api/Master/GetCityBySearchText';
    public static GetStateBySearchText  = '/api/Master/GetStateBySearchText?State=';
    public static GetUserById  = '/api/Account/GetUserById?Id=';
    public static SaveUser  = '/api/Account/SaveUser';
    public static PageSizeOptions: Array<{ "key": number, "value": number }> =
        [
            { "key": 10, "value": 10 },
            { "key": 20, "value": 20 },
            { "key": 30, "value": 30 },
            { "key": 40, "value": 40 },
            { "key": 50, "value": 50 }
        ];
     public static CategoryList = ["Wildlife Permits","Wetlands/Surface Water Permits","Air Permits", "Stormwater Permits"];
     public static GetAllMasterPermits  = '/api/Permit/GetAllMasterPermits';
     public static GetPermitById  = '/api/Permit/GetPermitById';
     public static SavePermits  = '/api/Permit/SavePermits';
     public static GetRegulatoryAgencyBySearchText = '/api/Master/GetRegulatoryAgencyBySearchText?SearchText='; 
     public static GetPermitNameBySearchText = '/api/Master/GetPermitNameBySearchText?SearchText='; 
     
}

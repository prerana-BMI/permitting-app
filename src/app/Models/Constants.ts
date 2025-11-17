export class Constants{
    public static GetAllProjectMaster  = '/api/RFI/GetProjectMasterList';
    public static GetAllUsers  = '/api/Account/GetUsers';
    public static IsUserExist  = '/api/Account/IsUserExist?UserName=';
    public static GetCityBySearchText  = '/api/Master/GetCityBySearchText';
    public static GetStateBySearchText  = '/api/Master/GetStateBySearchText?State=';
    public static GetUserById  = '/api/Account/GetUserById?Id=';
    public static DownloadExcel  = '/api/Permit/DownloadExcel';
    public static SaveUser  = '/api/Account/SaveUser';
    public static PageSizeOptions: Array<{ "key": number, "value": number }> =
        [
            { "key": 10, "value": 10 },
            { "key": 20, "value": 20 },
            { "key": 30, "value": 30 },
            { "key": 40, "value": 40 },
            { "key": 50, "value": 50 }
        ];
     public static CategoryList = '/api/Master/GetMasterCategoryList';
     public static GetAllMasterPermits  = '/api/Permit/GetAllMasterPermits';
     public static GetPermitById  = '/api/Permit/GetPermitById';
     public static SavePermits  = '/api/Permit/SavePermits';
     public static GetRegulatoryAgencyBySearchText = '/api/Master/GetRegulatoryAgencyBySearchText?SearchText='; 
     public static GetAllClientMaster = '/api/Master/GetAllClientMaster?SearchText='; 
     public static GetPermitNameBySearchText = '/api/Master/GetPermitNameBySearchText?SearchText='; 
     public static GetPermitByLocation = '/api/Permit/GetPermitByLocation'; 
     public static GetAllFederalPermits = '/api/Permit/GetAllFederalPermits'; 
     public static GetMasterPermitType = '/api/Master/GetMasterPermitType';
     public static SavePermitMatrix = '/api/Permit/SavePermitMatrix';
     public static ImportExcelFile = '/api/Permit/ImportExcelFile';
     public static GetAllMatrix = '/api/Permit/GetAllMatrix';
     public static GetMatrixDetailsById = '/api/Permit/GetMatrixDetailsById?MatrixId=';
     public static DeleteMatrixDetailsById = '/api/Permit/DeleteMatrixDetailsById?MatrixId=';
     public static ExportPermitsToExcel = '/api/Permit/ExportPermitToExcel';
     public static RoleAssignment : Array<{"Role"  : string , "Value" : Array<string>}> = [
        { Role : "User",  Value : ["Home","Matrix List" , "Permit Register"]},
        { Role : "Admin", Value : ["Home","Matrix List" , "Users", "Permit Register"]},
        { Role : "Editior", Value : ["Home","Matrix List" , "Permit Register"]}
    ];
     
}

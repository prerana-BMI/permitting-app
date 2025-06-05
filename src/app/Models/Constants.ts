export class Constants{
    public static GetAllProjectMaster  = '/api/RFI/GetProjectMasterList';

    public static PageSizeOptions: Array<{ "key": number, "value": number }> =
        [
            { "key": 10, "value": 10 },
            { "key": 20, "value": 20 },
            { "key": 30, "value": 30 },
            { "key": 40, "value": 40 },
            { "key": 50, "value": 50 }
        ];
}

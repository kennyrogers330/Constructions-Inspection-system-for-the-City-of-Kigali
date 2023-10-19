class InspectionModel {
    projectId: string;
    projectName: string;    
    projectType: string;
    inspectorName: string;
    inspectorPhone: string;
    inspectorEmail?: string;

    date: Date;
    images?: string[];
    excel?: string;
    recipients?: string[];
    comment?: string
    progress?: number
    phase?: number
    constructor(projectId: string, projectName: string, projectType: string, date: Date, recipients: string[],
        inspectorName: string, inspectorPhone: string){
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectType = projectType;
        this.date = date;
        this.recipients = recipients;
        this.inspectorName = inspectorName;
        this.inspectorPhone = inspectorPhone;
    }

    

}
export default InspectionModel;
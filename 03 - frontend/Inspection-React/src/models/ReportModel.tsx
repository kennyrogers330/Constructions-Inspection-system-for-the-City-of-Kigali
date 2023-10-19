class ReportModel {
    id: number;
    projectName: string;
    project_type: string;
    date?: Date;
    excel_report?: string;
    project_id?: number;
    comment: number; 
    phase: number;
    progress: number;
    phoneNumber: number;
    inspectorName: number;

    constructor(id: number, project_name: string, project_type: string,
        inspection_date: Date, comment: number, phase: number, progress: number,
        phone_number: number, inspector_name: number){
            this.id = id;
            this.projectName = project_name;
            this.project_type = project_type;
            this.date = inspection_date;
            this.comment = comment;
            this.phase = phase;
            this.progress = progress;
            this.phoneNumber = phone_number;
            this.inspectorName = inspector_name
    }
}
export default ReportModel;
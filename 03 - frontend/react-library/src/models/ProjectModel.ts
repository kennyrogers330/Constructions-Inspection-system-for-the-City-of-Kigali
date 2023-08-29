class ProjectModel {
    id: number;
    title: string;
    project_manager: string;
    description?: string;
    start_date?: Date;
    location: string;
    project_type?: string;
    weather_conditions?: string;
    expected_duration?: number;
    contact_email?: string;
    contact_phone?: string;
    images? : string[]

    constructor(id:number, title: string, project_manager: string, description: string, start_date: Date, location: string,
        project_type: string, weather_conditions: string, expected_duration: number, contact_email: string, contact_phone: string,
        images : string[])
    {
        this.id = id;
        this.title = title;
        this.project_manager = project_manager;
        this.description = description;
        this.start_date = start_date;
        this.location = location;
        this.project_type = project_type;
        this.weather_conditions = weather_conditions;
        this.expected_duration = expected_duration;
        this.contact_email = contact_email;
        this.contact_phone = contact_phone;
        this.images = images;
    }
}
export default ProjectModel;
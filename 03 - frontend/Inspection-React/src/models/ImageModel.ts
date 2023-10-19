class ImageModel {
    id: number;
    image: string;
    project_id?: number;

    constructor(id: number, image: string, project_id: number){
        this.id = id;
        this.image = image;
        this.project_id = project_id;
    }
}

export default ImageModel;
class InspectorReviewRequestModel {
    rating: number;
    projectId?: number;
    reviewDescription?: string;

    constructor(rating: number, projectId: number, reviewDescription: string){
        this.rating = rating;
        this.projectId = projectId;
        this.reviewDescription = reviewDescription;
    }
}
export default InspectorReviewRequestModel;
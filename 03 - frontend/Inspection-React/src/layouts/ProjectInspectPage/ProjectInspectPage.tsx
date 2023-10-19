import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import ProjectModel from "../../models/ProjectModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import ImageModel from "../../models/ImageModel";
import { StarsReview } from "../Utils/StarsReview";
import InspectorReviewRequestModel from "../../models/InspectorReviewRequestModel";
import { InspectAndReviewBox } from "./InspectAndReviewBox";
import InspectorReviewModel from "../../models/InspectorReviewModel";

import { LatestInspectorReview } from "./LatestInspectorReview";
import ReportModel from "../../models/ReportModel";

export const ProjectInspectPage = () => {
    const { authState } = useOktaAuth();
    const [project, setProject] = useState<ProjectModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingImg, setIsLoadingImg] = useState(true);
    const [isLoadingRpt, setIsLoadingRpt] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [images, setImages] = useState<ImageModel[]>([]);
    const [reports, setReports] = useState<ReportModel[]>([]);
    
    // Review State
    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [totalStars, setTotalStars] = useState(0);
    const [reviews, setReviews] = useState<InspectorReviewModel[]>([]);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [phase, setPhase] = useState(0);

    const projectId = (window.location.pathname).split('/')[2];
    const [sdate, setSdate] = useState('');
    useEffect(()=> {
        const fetchProject = async () => {
            const baseUrl: string = `http://localhost:8080/api/projects/${projectId}`;
            const response = await fetch(baseUrl);
            if(!response.ok){
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const dateObject = new Date(responseJson.start_date);
            setSdate(dateObject.toLocaleDateString())
            console.log(dateObject.toLocaleDateString());

            const loadedProject:  ProjectModel = {
                id: responseJson.id,
                title: responseJson.title,
                project_manager: responseJson.project_manager,
                description: responseJson.description,                
                start_date: dateObject,
                location: responseJson.location,
                project_type: responseJson.project_type,
                weather_conditions: responseJson.weather_conditions,
                expected_duration: responseJson.expected_duration,
                contact_email: responseJson.contact_email,
                contact_phone: responseJson.contact_phone
                
            };
            setProject(loadedProject);
            setIsLoading(false);
            console.log(loadedProject.start_date)
        };
        fetchProject().catch((error: any)=> {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
          const baseUrl: string = `http://localhost:8080/api/projects/${projectId}/images`;
          const url: string = `${baseUrl}?page=0&size=10`;
          const response = await fetch(url);
  
          if(!response.ok){
            throw new Error('Something went wrong! ');
          }
          const responseJson = await response.json();
          const responseData = responseJson._embedded.images;
          const loadedImages: ImageModel[] = [];
  
          for (const key in responseData) {
            loadedImages.push({
              id: responseData[key].id,
              image: responseData[key].image,
            });
          }
          setImages(loadedImages);
          setIsLoadingImg(false);
          console.log(loadedImages);
        };
        fetchImages().catch((error: any)=> {
          setHttpError(error.message);
          setIsLoadingImg(false);
        })
      }, [project]);

      useEffect(() => {
        const fetchReports = async () => {
          const baseUrl: string = `http://localhost:8080/api/projects/${projectId}/reports`;
          const url: string = `${baseUrl}?page=0&size=10`;
          const response = await fetch(url);
  
          if(!response.ok){
            throw new Error('Something went wrong! ');
          }
          const responseJson = await response.json();
          const responseData = responseJson._embedded.reports;
          const loadedReports: ReportModel[] = [];
  
          for (const key in responseData) {
            loadedReports.push({
              id: responseData[key].id,
              projectName: responseData[key].projectName,
              project_type: responseData[key].project_type,              
              date: new Date(responseData[key].date),
              excel_report: responseData[key].excel_report,
              comment: responseData[key].comment,
              phase: responseData[key].phase,
              progress: responseData[key].progress,
              phoneNumber: responseData[key].phoneNumber,
              inspectorName: responseData[key].inspectorName
            });
          }
          
          setReports(loadedReports)
          setIsLoadingRpt(false);
          setPhase(loadedReports.length)
          console.log(loadedReports)
        };
        fetchReports().catch((error: any)=> {
          setHttpError(error.message);
          setIsLoadingRpt(false);
        })
      }, [project]);
	  

      useEffect(() => {
        const fetchProjectReviews = async () => {

          const reviewUrl: string = `http://localhost:8080/api/inspectorReviews/search/findByProjectId?projectId=${projectId}`;
          const responseReviews = await fetch(reviewUrl);

          if(!responseReviews.ok){
            throw new Error('Something went wrong!');
          }

          const responseJsonReviews = await responseReviews.json();
          const responseData = responseJsonReviews._embedded.inspectorReviews;
          const loadedReviews : InspectorReviewModel[] = [];

          let weightedStarReviews: number = 0;

          for(const key in responseData){
            loadedReviews.push({
              id: responseData[key].id,
              userEmail: responseData[key].userEmail,
              date: responseData[key].date,
              rating: responseData[key].rating,
              reviewDescription: responseData[key].reviewDescription
            });
            weightedStarReviews = weightedStarReviews + responseData[key].rating;
          }

          if(loadedReviews){
            const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2)/2).toFixed(1);
            setTotalStars(Number(round));
          }
          setReviews(loadedReviews);
          setIsLoadingReview(false);          

        }; fetchProjectReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
      }, [isReviewLeft]); 

      useEffect(()=> {
        const fetchUserReviewProject = async () => {
          if(authState && authState.isAuthenticated){
            const url = `http://localhost:8080/api/reviews/secure/user/project?projectId=${projectId}`;
            
            const requestOptions = {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                  'Content-Type': 'application/json'
              }
          };
          const userReview = await fetch(url, requestOptions);
          if(!userReview.ok){
            throw new Error('Something went wrong');
          }
            const userReviewResponseJson = await userReview.json();
            setIsReviewLeft(userReviewResponseJson);
          }
          setIsLoadingUserReview(false);
        }
        fetchUserReviewProject().catch((error: any) => {
          setIsLoadingUserReview(false);
          setHttpError(error.message);
        })
      }, [authState]);

    if(isLoading || isLoadingImg || isLoadingReview || isLoadingUserReview || isLoadingRpt){
        return(
            <SpinnerLoading/>
        )
    }
    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function submitReview(starInput: number, reviewDescription: string){
        let projectId: number = 0;
        
        if(project?.id){
          projectId = project.id;
        }
        const inspectorReviewRequest = new InspectorReviewRequestModel(starInput, projectId, reviewDescription);
        console.log(inspectorReviewRequest);
        const url = `http://localhost:8080/api/reviews/secure/post`;
        const requestOptions = {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
              'Content-Type' : 'application/json'
          },
          body: JSON.stringify(inspectorReviewRequest)
       };
       const returnResponse = await fetch(url, requestOptions);
       
       if(!returnResponse.ok){
        throw new Error('Something went wrong!');
       }
       setIsReviewLeft(true);
    }

    return(
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5"> 
                    <div className="col-sm-2 col-md-2">
                        {images?
                            images.map((image: any) =>(
                              <div className="row mb-3" key={image.id}>
                                  <div className="col-sm" key={image.id}>
                                    <a href={image.image} download>
                                      <img src={image.image} alt="" height={200} width={200} style={{objectFit:'cover'}}
                                      key={image.id}
                                      />                                     
                                    </a>                                    
                                  </div>
                               </div>
                            ))
                            :
                            <div className="row mb-3">
                                  <div className="col-sm">                                    
                                      <img src={require('./../../Images/PublicImages/City of Kigali.png')} alt="" height={200} width={200} style={{objectFit:'cover'}}
                                      />                                                                   
                                  </div>
                               </div>
                        }
                    </div>   

                    <div className="col-4 col-md-4 container">

                      <div className="ml-2">
                        <h2>{project?.title}</h2>
                        <h5>Led by <span className="text-primary">{project?.project_manager}</span></h5>
                        <p className="lead">{project?.description}</p>
                        <p className="lead">Location: <b>{project?.location}</b></p>
                        <p className="lead">Expected Duration: <b>{project?.expected_duration}</b> days</p>
                        <p className="lead">Project Type: <b>{project?.project_type}</b></p>
                        <p className="lead">Start Date: <b>{sdate}</b></p>
                        <p className="lead">Contact Phone: <b>{project?.contact_phone}</b></p>
                        <p className="lead">Contact Email: <b>{project?.contact_email}</b></p>
                        
                        <StarsReview Rating={totalStars} size={32}/>
                        <br />
                      </div>                    
                    </div>  

                    <InspectAndReviewBox submitReview = {submitReview}  
                    isAuthenticated = {authState?.isAuthenticated}
                    isReviewLeft = {isReviewLeft}
                    mobile = {false}
                    projectId={parseInt(projectId)}
                    phase={phase}
                    authState={authState}
                    />                    
                </div>
                    <hr />
                  <LatestInspectorReview inspectorReview={reviews} projectId={project?.id} mobile={false}/>
            </div>
            <div className="container d-lg-none mt-5">
              <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-sm-2 col-md-2">
                        {images?
                            images.map((image: any) =>(
                              <div className="row mb-3" key={image.id}>
                                  <div className="col-sm" key={image.id}>
                                    <a href={image.image} download>
                                      <img src={image.image} alt="" height={200} width={200} style={{objectFit:'cover'}}
                                      key={image.id}
                                      />                                     
                                    </a>                                    
                                  </div>
                               </div>
                            ))
                            :
                            <div className="row mb-3">
                                  <div className="col-sm">                                    
                                      <img src={require('./../../Images/PublicImages/City of Kigali.png')} alt="" height={200} width={200} style={{objectFit:'cover'}}
                                      />                                                                   
                                  </div>
                               </div>
                        }
                    </div>

                    <div className="mt-4">
                        <div className="ml-2">
                          <h2>{project?.title}</h2>
                          <h5>Led by <span className="text-primary">{project?.project_manager}</span></h5>
                          <p className="lead">{project?.description}</p>
                          <p className="lead">Location: <b>{project?.location}</b></p>
                          <p className="lead">Expected Duration: <b>{project?.expected_duration}</b> days</p>
                          <p className="lead">Project Type: <b>{project?.project_type}</b></p>
                          <p className="lead">Start Date: <b>{sdate}</b></p>
                          <p className="lead">Contact Phone: <b>{project?.contact_phone}</b></p>
                          <p className="lead">Contact Email: <b>{project?.contact_email}</b></p>
                          
                          <StarsReview Rating={totalStars} size={32}/>
                          <br />
                        </div>
                     </div>   

                     <InspectAndReviewBox submitReview = {submitReview}  
                    isAuthenticated = {authState?.isAuthenticated}
                    isReviewLeft = {isReviewLeft}
                    mobile = {true}
                    projectId={parseInt(projectId)}
                    phase={phase}
                    authState={authState}
                    />

              </div>
              <hr />
              <LatestInspectorReview inspectorReview={reviews} projectId={project?.id} mobile={true}/>
            </div>
        </div>
    );
}
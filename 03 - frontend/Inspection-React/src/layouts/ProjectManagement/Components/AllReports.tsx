import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import ProjectModel from "../../../models/ProjectModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import ReportModel from "../../../models/ReportModel";
import { Link } from "react-router-dom";
import ImageModel from "../../../models/ImageModel";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { LatestInspectorReview } from "../../ProjectInspectPage/LatestInspectorReview";
import InspectorReviewModel from "../../../models/InspectorReviewModel";
export const AllReports = () =>{

    const { authState } = useOktaAuth();
    const [reviews, setReviews] = useState<InspectorReviewModel[]>([]);
    const [httpError, setHttpError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState<ProjectModel>();
    const [reports, setReports] = useState<ReportModel[]>([]);
    const [isLoadingRpt, setIsLoadingRpt] = useState(true);
    const [sdate, setSdate] = useState('');
    const [isLoadingImg, setIsLoadingImg] = useState(true);
	const [images, setImages] = useState<ImageModel[]>([]);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

	//const [reportId, setreportId] = useState<number>();

    const projectId = (window.location.pathname).split('/')[2];
    const mobile = (window.location.pathname).split('/')[3];

    const originalDate = new Date(new Date().toString());

    const day = originalDate.getDate();
    const month = originalDate.toLocaleString('default', { month: 'short' });
    const year = originalDate.getFullYear();

    const formattedDate = `${day}, ${month} ${year}`;

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
          setReviews(loadedReviews);
          setIsLoadingReview(false);          

        }; fetchProjectReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
      }, []);
    
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
    }, [projectId]);
    
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
            console.log(responseData[key].id)
            fetchImages(responseData[key].id)
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
          console.log(loadedReports)
        };
        fetchReports().catch((error: any)=> {
          setHttpError(error.message);
          setIsLoadingRpt(false);
        })
      }, [projectId]);

    const fetchImages = async (reportId: number) => {
        try {
          const baseUrl = `http://localhost:8080/api/reports/${reportId}/images`;
          const url = `${baseUrl}?page=0&size=10`;
          const response = await fetch(url);
      
          if (!response.ok) {
            throw new Error('Something went wrong!');
          }
      
          const responseJson = await response.json();
          const responseData = responseJson._embedded.images;
          const loadedImages: ImageModel[]  = [];
      
          for (const key in responseData) {
            loadedImages.push({
              id: responseData[key].id,
              image: responseData[key].image,
            });
          }

          const combinedImages: ImageModel[] = [...images, ...loadedImages];

          setImages(combinedImages);
          setIsLoadingImg(false);
          console.log(loadedImages);
        } catch (error: any) {
          setHttpError(error.message);
          setIsLoadingImg(false);
        }
      };
      

    if (isLoadingRpt) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const generatePDF = async () => {
        const reportContainer = document.querySelector('.report-container') as HTMLElement;
      
        if (reportContainer) {
          const canvas = await html2canvas(reportContainer);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
          pdf.save('report.pdf');
        }
    
      };
    
      const generatePDF2 = async () => {
        const reportContainer = document.querySelector('.report-container2') as HTMLElement;
      
        if (reportContainer) {
            const canvas = await html2canvas(reportContainer);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('report.pdf');
          }
      };
    return(
        <>
        <div className="container">
            <div className="row mt-2">                    
                    <div className="d-none d-lg-block col-sm pt-3 mt-2">
                        <button className = "btn main-color btn-md text-white" onClick={generatePDF}>Download Report</button>
                    </div> 
                    <div className="d-lg-none col-sm pt-3 mt-2">
                        <button className = "btn main-color btn-md text-white" onClick={generatePDF2}>Download Report</button>
                    </div> 
            </div>
            <div className="row d-none d-lg-block report-container">
                <div className="row mt-2">
                    <div className="col-sm">
                        <img src={require('./../../../Images/PublicImages/City of Kigali.png')} alt="Logo" className="logo" />
                    </div>
                    <div className="col-sm pt-3">
                        <h3>The City of Kigali</h3>
                    </div>
                    <div className="col-sm pt-3 mt-2">
                       <h5>{formattedDate}</h5>
                    </div>
                </div>
                <div className="row mt-5">

                    <div className={mobile ? '' : 'col-sm-2 col-md-2'}>

                        <center><h3 className="text-primary mb-4 fw-light">{project?.title} Inspection Report</h3></center>

                    </div>
                    
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                            {reports.length > 0  ?
                                <>                                    
                                    {reports.map(report  => (
                                                                
                                        <div className="card mb-2" style={{width: "18rem;"}}key={report.id}>
                                            <div className="card-body">
                                                <h5 className="card-title">Phase {report.phase}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted">Done on {sdate}</h6>
                                                <p className="card-text">Progress made: <span className="fw-light">{report.progress} %</span></p>
                                                <p className="card-text">Comment: <span className="fw-light">{report.comment}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                                              
                                </>
                                :
                                <div className="m-3">
                                    <p className="lead">
                                        No inspection has been done for this site yet hence no reports so far. 
                                    </p>
                                </div>
                            }
                    </div>

                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <h5>Site Images</h5>
                        {images?
                            images.map((image: any) =>(
                            
                            <a href={image.image} download className="p-3">
                                      <img src={image.image} alt="" height={200} width={200} style={{objectFit:'cover'}}
                                      key={image.id}
                                      />                                     
                                    </a>  
                            ))
                            :
                            <div className="mb-3">
                                <div className="col-sm">                                    
                                    <img src={require('./../../../Images/InspectionImages/5849099636_3fec655497_b.jpg')} alt="" height={200} width={200} style={{objectFit:'cover'}}
                                      />                                                                   
                                </div>
                            </div>
                        }
                    </div>

                    <div className="col-sm-12 col-md-12 col-lg-12">
                    {/* <div className="m-3">
                        <Link type='button' className='btn main-color btn-md text-white exclude-me'
                            to={`/reviewList/${projectId}`}>Show more reviews</Link>
                    </div> */}
                        <LatestInspectorReview inspectorReview={reviews} projectId={project?.id} mobile={false}/> 
                    </div>
                </div>
                
            </div>
            
            <div className="row d-lg-none mt-2 report-container2">
                <div className="row mt-2">
                    <div className="col-sm">
                        <img src={require('./../../../Images/PublicImages/City of Kigali.png')} alt="Logo" className="logo" />
                    </div>
                    <div className="col-sm pt-3">
                        <h3>The City of Kigali</h3>
                    </div>
                    <div className="col-sm pt-3 mt-2">
                       <h5>{formattedDate}</h5>
                    </div>
                </div>
                <div className="row mt-5">

                    <div className={mobile ? '' : 'col-sm-2 col-md-2'}>

                        <center><h3 className="text-primary mb-4 fw-light">{project?.title} Inspection Report</h3></center>

                    </div>
                </div>
                <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                                {reports.length > 0  ?
                                    <>
                                        {reports.map(report  => (
                                            
                                            <div className="card mb-2" style={{width: "18rem;"}}key={report.id}>
                                                <div className="card-body">
                                                    <h5 className="card-title">Phase {report.phase}</h5>
                                                    <h6 className="card-subtitle mb-2 text-muted">Done on {sdate}</h6>
                                                    <p className="card-text">Progress made: <span className="fw-light">{report.progress} %</span></p>
                                                    <p className="card-text">Comment: <span className="fw-light">{report.comment}</span></p>
                                                </div>
                                            </div>
                                        ))}        
                                    </>
                                    :
                                    <div className="m-3">
                                        <p className="lead">
                                            No inspection has been done for this site yet hence no reports so far. 
                                        </p>
                                    </div>
                                }
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <h5>Site Images</h5>
                            {images?
                                images.map((image: any) =>(                                
                                <a href={image.image} download className="m-3">
                                    <img src={image.image} alt="" height={200} width={200} style={{objectFit:'cover'}}
                                    key={image.id}
                                    />                                     
                                </a>
                                ))
                                :
                                <div className="mb-3">
                                    <div className="col-sm">                                    
                                        <img src={require('./../../../Images/InspectionImages/5849099636_3fec655497_b.jpg')} alt="" height={200} width={200} style={{objectFit:'cover'}}
                                        />                                                                   
                                    </div>
                                </div>
                            }
                        </div> 
                                                    
                </div>
                <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <LatestInspectorReview inspectorReview={reviews} projectId={project?.id} mobile={true}/> 
                        </div>   
                </div>
            </div>
        </div> 
        
        <div className={mobile ? 'mt-3' : 'row mt-5'}>

        </div>
        </>
    )
}

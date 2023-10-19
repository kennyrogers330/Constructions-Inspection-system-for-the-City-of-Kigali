import { useEffect, useState } from "react";
import ProjectModel from "../../../models/ProjectModel";
//import { error } from "console";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { ReturnProject } from "./ReturnProject";
import { Link } from "react-router-dom";

export const ProjetCarousel = () => {

    const [projects, setProjects] = useState<ProjectModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const baseUrl: string = "http://localhost:8080/api/projects/";
            const url: string = `${baseUrl}?page=0&size=3`;
            const response = await fetch(url);
            if (!response.ok){
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData  = responseJson._embedded.projects;
            const loadedProjects: ProjectModel[] = [];

            for(const key in responseData){
                loadedProjects.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    project_manager: responseData[key].project_manager,
                    description: responseData[key].description,
                    start_date: responseData[key].start_date,
                    location: responseData[key].location,
                    project_type: responseData[key].project_type,
                    weather_conditions: responseData[key].weather_conditions,
                    expected_duration: responseData[key].expected_duration,
                    contact_email: responseData[key].contact_email,
                    contact_phone: responseData[key].contact_phone                   
                });
           }
           setProjects(loadedProjects);
           console.log(loadedProjects);
           setIsLoading(false);
        };
        fetchProjects().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    if(isLoading){
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
       
    return(
        <div className="container mt-5" style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3>Inspection Quick start</h3>
            </div>
            <div id='carouselExampleControls' className="carousel carousel-dark slide mt-5 d-none d-lg-block" data-bs-interval='false'>
                
                {/*Desktop*/}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">
                           {projects.slice(0, 1).map(project => (
                                <ReturnProject project = {project} key = {project.id}/>    
                                
                           ))}
                        </div>
                    </div>

                    {projects.length>1 &&
                        <div className="carousel-item">
                            <div className="row d-flex justify-content-center align-items-center">
                                {projects.slice(1, 2).map(project => (
                                        <ReturnProject project = {project} key = {project.id}/> 
                                                                    
                                ))}
                            </div>
                        </div>
                    }
                    
                    {projects.length>2 &&
                        <div className="carousel-item">
                            <div className="row d-flex justify-content-center align-items-center">
                                {projects.slice(2, 3).map(project => (
                                        <ReturnProject project = {project} key = {project.id}/>                                 
                                ))}
                            </div>
                        </div>
                    }
                    
                </div>
                
                
                <button className="carousel-control-prev"
                    type="button" data-bs-target='#carouselExampleControls'
                    data-bs-slide='prev'>
                    <span className="carousel-control-prev-icon"
                        aria-hidden='true' ></span>
                    <span className="visually-hidden">Previous</span>
                </button>

                <button className="carousel-control-next"
                    type="button" data-bs-target='#carouselExampleControls'
                    data-bs-slide='next'>
                    <span className="carousel-control-next-icon"
                        aria-hidden='true' ></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/*Mobile*/}

            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    <ReturnProject project = {projects[0]} key = {projects[0].id}/>
                    
                </div>
            </div>

            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to="/search">
                    View More
                </Link>
            </div>

        </div>
    );
}
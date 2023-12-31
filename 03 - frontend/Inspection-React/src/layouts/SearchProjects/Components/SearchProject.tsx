import { Link } from "react-router-dom";
import ProjectModel from "../../../models/ProjectModel";
import { useEffect, useState } from "react";
import ImageModel from "../../../models/ImageModel";


export const SearchProject: React.FC<{ project: ProjectModel }> = (props) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [httpError, setHttpEror] = useState(null);

    const originalDate = new Date(new Date().toString());

    const day = originalDate.getDate();
    const month = originalDate.toLocaleString('default', { month: 'short' });
    const year = originalDate.getFullYear();

    const formattedDate = `${day}, ${month} ${year}`;

    useEffect(() => {
        const fetchImages = async () => {
          const baseUrl: string = `http://localhost:8080/api/projects/${props.project.id}/images`;
          const url: string = `${baseUrl}?page=0&size=1`;
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
        };
        fetchImages().catch((error: any)=> {
          setHttpEror(error.message);
        })
      }, []);

      if(httpError){
        return(
          <div className="container m-5">
            <p>{httpError}</p>
          </div>
        )      
      }

    return (
      <>
        <div className="conatiner">    
          <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-sm-12 col-md-12 col-lg-4">
                    <div className="d-none d-lg-block ">
                        {images.length>0 ? 
                            <img src={images[0].image}
                            width='251'
                            height='233'
                            alt="project"
                            />
                            :
                            <img src={require('./../../../Images/PublicImages/Visit-Rwanda-Vision-City-1920x1280.jpg')}
                            width='251'
                            height='233'
                            alt="project"/>
                        }
                    </div>

                    <div className="d-lg-none d-flex justify-content-center
                        align-items-center">
                        {images.length>0 ? 
                            <img src={images[0].image}                           
                            width='251'
                            height='233'
                            alt="project"/>
                            :
                            <img src={require('./../../../Images/PublicImages/Visit-Rwanda-Vision-City-1920x1280.jpg')}
                            width='251'
                            height='233'
                            alt="project"/>
                        }
                    </div>

                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="card-body">
                        <h5 className="card-title">
                            {props.project.title}
                        </h5>
                        <h4>
                           {props.project.location}
                        </h4>
                        <p className="card-text">
                            {props.project.description}
                        </p>
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-2 d-flex justify-content-center align-items-center">
                    <Link to={`/checkout/${props.project.id}`} className="btn btn-md main-color text-white">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
        </div>
      </>
    )
}
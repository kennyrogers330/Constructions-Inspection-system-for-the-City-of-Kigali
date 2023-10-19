import { Link } from "react-router-dom";
import ProjectModel from "../../../models/ProjectModel";
import { useEffect, useState } from "react";
import ImageModel from "../../../models/ImageModel";

export const ReturnProject: React.FC<{project: ProjectModel}> = (props) => {
    
    const [images, setImages] = useState<ImageModel[]>([]);
    const [httpError, setHttpError] = useState(null);

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
        setHttpError(error.message);
      })
    }, []);

    if(httpError){
      return(
        <div className="container m-5">
          <p>{httpError}</p>
        </div>
      )      
    }

    const imgStyle = {
        width: '251px',
        height: '233px',
        transition: 'transform 0.3s ease',
      };

    const imgHoverStyle = {
        transform: 'scale(1.1)',
      };
    
    return(
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className="text-center">
            { images.length>0 ? 
                <img src={images[0].image}
                    width='251'
                    height='233'
                    style={imgStyle}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.5)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    alt="project" />
                :                
                <img src={require('./../../../Images/PublicImages/Visit-Rwanda-Vision-City-1920x1280.jpg')}
                    width='251'
                    height='233'
                    style={imgStyle}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.5)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    alt="Project" />
            }
            <h6 className="mt-2">{props.project.title}</h6>
                <p>{props.project.project_type}</p>
                <Link className="btn main-color text-white"
                    to={`checkout/${props.project.id}`}>Visit site</Link>
            </div>
        </div>
    );
}
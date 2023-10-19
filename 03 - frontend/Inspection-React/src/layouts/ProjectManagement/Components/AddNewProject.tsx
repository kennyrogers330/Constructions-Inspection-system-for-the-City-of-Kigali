import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddProjectRequest from "../../../models/AddProjectRequest";

export const AddNewProject = () => {
    const { authState } = useOktaAuth();
    
    // New Book 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start_date, setStartDate] = useState<Date>(new Date()); 
    const [location, setlocation] = useState('')
    const [project_type, setproject_type] = useState('')
    const [weather_conditions, setweather_conditions] = useState('')
    const [expected_duration, setexpected_duration] = useState(0)
    const [project_manager, setProject_manager] = useState('');
    const [contact_email, setcontact_email] = useState('');
    const [contact_phone, setcontact_phone] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
        
    const [selectedImages, setSelectedImages] = useState<Array<any>>([]);    
    const [base64Images, setbase64Images] = useState<Array<any>>([]);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function ProjectTypeInit(value: string){
        setproject_type(value);
    }

    function WeatherConditionInit(value: string){
        setweather_conditions(value);
    }

    async function base64ConversionForImages(e: any){
        
        if(e.target.files){
            const files = Array.from(e.target.files);

            if(files.length + selectedImages.length > 10){
                alert('The Maximum image limit which is 10 images was exceeded!');
                return;
            }
            for (let i = 0; i<files.length; i++){
                getBase64(e.target.files[i]);
            }          

            setSelectedImages((prev: any[])=> [...prev, ...files]);           
        }
    }

    function getBase64(file: any){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setbase64Images((prev: any[])=> [...prev, reader.result]);
        };
        reader.onerror = function (error) {
            console.log('Error', error);
        }
    }

    const nextPage = () => {
        setCurrentPage(2);
    };

    const goBack = () => {
        setCurrentPage(1);
    };
    
    async function submitNewProject() {
        const url = `http://localhost:8080/api/admin/secure/add/project`;

        if (authState?.isAuthenticated && 
        title !== '' && project_manager!== '' 
        && description !== '' && location !== '' && project_type!== '' && weather_conditions!== '' && contact_email!== '' && contact_phone!== '' &&
        base64Images.length>=1){
            const project: AddProjectRequest = new AddProjectRequest(title, project_manager, description, location, project_type, weather_conditions,
                expected_duration, contact_email, contact_phone, start_date);
            
            project.images = base64Images;           
           
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            };

            const submitNewProjectResponse = await fetch(url, requestOptions);
            
            if(!submitNewProjectResponse.ok){
                throw new Error('Something went wrong!');
            }
            setTitle('');
            setproject_type('');
            setStartDate(new Date());
            setlocation('');
            setweather_conditions('');
            setexpected_duration(0);
            setProject_manager('');                     
            setcontact_email('');
            setcontact_phone(''); 
            setDescription('');           
            setDisplayWarning(false);
            setDisplaySuccess(true);
        }else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return(
        <div className="container mt-5 mb-5">
            {displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Project added successfully
                </div>
            }
            {displayWarning &&
                <div className="alert alert-danger" role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className="card">
                <div className="card-header">
                    <center><b>Capture new project</b></center>
                    <p>
                    {currentPage === 1 ?
                        <>Basic information</>
                        :
                        <>Add site images (one image minimum)</>
                    }
                    </p>
                </div>
                <div className="card-body">
                    <form method="POST">
                    {currentPage === 1 && (<>
                        <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Title</label>
                                        <input type="text" className="form-control" name = 'title' required
                                        onChange={e => setTitle(e.target.value)} value={title}/>
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Project Type</label>
                                        <button className="form-control btn btn-secondary dropdown-toggle" type='button'
                                        id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                            {project_type || 'Select'}
                                        </button>

                                        <ul id='addNewProjectId' className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li><a onClick={() => ProjectTypeInit('road')} className="dropdown-item">Road Construction</a></li>
                                            <li><a onClick={() => ProjectTypeInit('utility')} className="dropdown-item">Utility Installation</a></li>
                                            <li><a onClick={() => ProjectTypeInit('building')} className="dropdown-item">Large Building</a></li>
                                            <li><a onClick={() => ProjectTypeInit('settlement')} className="dropdown-item">Settlement Houses</a></li>
                                            <li><a onClick={() => ProjectTypeInit('disaster')} className="dropdown-item">Disaster Recovery</a></li>
                                        </ul>
                                    </div>
                                    
                                    <div className="col-md-3 mb-3">
                                            <label className="form-label">Start Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="start_date"
                                                required
                                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                                value={start_date.toISOString().slice(0, 10)} // Convert Date to ISO string format
                                            />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">location</label>
                                        <input type="text" className="form-control" name = 'location' required
                                        onChange={e => setlocation(e.target.value)} value={location}/>
                                    </div>

                        </div>   
                        <div className="row">
                            
                            <div className="col-md-3 mb-3">
                                    <label className="form-label">Weather Conditions</label>
                                    <button className="form-control btn btn-secondary dropdown-toggle" type='button'
                                    id='dropdownMenuButton2' data-bs-toggle='dropdown' aria-expanded='false'>
                                        {weather_conditions || 'Select'}
                                    </button>

                                    <ul id='addNewWeatherId' className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                        <li><a onClick={() => WeatherConditionInit('Rainy')} className="dropdown-item">Rainy</a></li>
                                        <li><a onClick={() => WeatherConditionInit('Cloudy')} className="dropdown-item">Cloudy</a></li>
                                        <li><a onClick={() => WeatherConditionInit('Sunny')} className="dropdown-item">Sunny</a></li>
                                    </ul>
                            </div>

                            <div className="col-md-3 mb-3">
                                        <label className="form-label">Expected Duration (days)</label>
                                        <input type="number" className="form-control" name = 'expected_duration' required
                                        onChange={e => setexpected_duration(Number(e.target.value))} value={expected_duration}/>
                            </div>

                            <div className="col-md-3 mb-3">
                                        <label className="form-label">Project Manager</label>
                                        <input type="text" className="form-control" name='project_manager' required
                                        onChange={e => setProject_manager(e.target.value)} value={project_manager}/>
                            </div>

                            <div className="col-md-3 mb-3">
                                        <label className="form-label">Contact Email</label>
                                        <input type="email" className="form-control" name = 'contact_email' required
                                        onChange={e => setcontact_email(e.target.value)} value={contact_email}/>
                            </div>
                        </div> 

                        <div className="row">
                            <div className="col-md-3 mb-3">
                                            <label className="form-label">Contact Phone</label>
                                            <input type="text" className="form-control" name = 'contact_phone' required
                                            onChange={e => setcontact_phone(e.target.value)} value={contact_phone}/>
                            </div>
                            <div className="col-md-9 mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}
                                    onChange={e => setDescription(e.target.value)} value={description}></textarea>
                            </div>
                        </div>
                        </> )}

                        {currentPage === 1 &&
                        <>
                            <button type='button' className="btn btn-primary mt-3 mr-2"
                            onClick={nextPage} >
                                Next
                            </button>
                            &nbsp;&nbsp;
                        </> 
                        }

                        {currentPage === 2 && 
                            <>
                            
                            <div className="container">
                                <div className="row mb-4">
                                    <input id="fileInput" className="col-sm form-control" type="file" multiple onChange={e => base64ConversionForImages(e)} />
                                    <div className="col-sm">
                                        <input type="button" value="Reset" onClick={()=> {setSelectedImages([]); setbase64Images([])}} />
                                    </div>
                                    
                                </div>
                             
                                <div className="row">
                                {
                                    base64Images.map((image: any) =>(
                                        <div className="col-sm-12 col-md-6 col-lg-4">
                                             <img src={image} className="img-thumbnail" alt="" height={200} width={200}/>
                                             
                                       </div>
                                    ))
                                }
                                </div>
                            </div>
                            

                            <div>                            
                            <button type='button' className="btn btn-primary mt-3 mr-2"
                            onClick={goBack} >
                                Back
                            </button>
                            &nbsp;&nbsp;
                            
                            <button type='button' className="btn btn-primary mt-3 ml-3"
                            onClick={submitNewProject} >
                                Add Project
                            </button>
                            &nbsp;&nbsp;
                            </div>
                            </>
                        }
                    </form>
                </div>
            </div>
        </div>
    );

}
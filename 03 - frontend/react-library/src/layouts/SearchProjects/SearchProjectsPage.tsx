import { useEffect, useState } from "react";
import ProjectModel from "../../models/ProjectModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchProject } from "./Components/SearchProject";
import { Link } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { Pagination } from "../Utils/Pagination";
export const SearchProjectsPage = () => {

    const { authState } = useOktaAuth();
    const [projects, setProjects] = useState<ProjectModel[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProjectsPerPage] = useState(1);
    const [totalAmountOfProjects, setTotalAmountOfProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setsearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Project Type');

    useEffect(() => {

        const fetchProjects = async () => {
            const baseUrl: string = "http://localhost:8080/api/projects";
            let url: string = '';

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${ProjectsPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('pageNumber', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }
            console.log(url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();

            const responseData = responseJson._embedded.projects;

            setTotalAmountOfProjects(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

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
                    contact_phone: responseData[key].contact_phone,
                });
           }
           console.log(loadedProjects);
           setProjects(loadedProjects);
           setIsLoading(false);
        };
        fetchProjects().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })  
        window.scrollTo(0, 0);      
    }, [currentPage, searchUrl]);

    if (isLoading) {
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

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setsearchUrl('');
        } else {
            setsearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${ProjectsPerPage}`);
        }
        setCategorySelection('Project Type');
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (
            value.toLowerCase() === 'road' || 
            value.toLowerCase() === 'utility' ||
            value.toLowerCase() === 'building' ||
            value.toLowerCase() === 'settlement' || 
            value.toLowerCase() === 'disaster' 
        )
        {
            setCategorySelection(value);
            setsearchUrl(`/search/findByProjectType?project_type=${value}&page=<pageNumber>&size=${ProjectsPerPage}`);
            console.log("in");
        }else{
            setCategorySelection('all');
            setsearchUrl(`?page=<pageNumber>&size=${ProjectsPerPage}`);
            console.log("out");
        }
    }

    const indexOfLastProject: number = currentPage * ProjectsPerPage;
    const indexOfFirstProject: number = indexOfLastProject - ProjectsPerPage;

    let lasItem = ProjectsPerPage * currentPage <= totalAmountOfProjects ?
        ProjectsPerPage * currentPage : totalAmountOfProjects;
    
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return(
        <div>
            <div className="container">
                <div>
                <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input type="search" className="form-control me-2"
                                    placeholder='Search' aria-labelledby='Search'
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button className="btn btn-outline-success"
                                    onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle"
                                    type='button' id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {categorySelection} 
                                </button>

                                <ul className="dropdown-menu" aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={() => categoryField('all')}>
                                        <a href="#" className="dropdown-item">
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('road')}>
                                        <a href="#" className="dropdown-item">
                                            Road Construction
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('utility')}>
                                        <a href="#" className="dropdown-item">
                                            Utility Installation
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('building')}>
                                        <a href="#" className="dropdown-item">
                                            Large Building
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('settlement')}>
                                        <a href="#" className="dropdown-item">
                                            Settlement Houses
                                        </a>
                                    </li>

                                    <li onClick={() => categoryField('disaster')}>
                                        <a href="#" className="dropdown-item">
                                            Disaster Recovery
                                        </a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>

                    {totalAmountOfProjects > 0 ?
                        <>
                            <div className="mt-3">
                                <h5>Number of results: ({totalAmountOfProjects})</h5>
                            </div>
                            <p>
                                {indexOfFirstProject + 1} to {lasItem} of {totalAmountOfProjects} items:
                            </p>
                            {projects.map(project => (
                                <SearchProject project={project} key={project.id} />
                            ))}
                        </>
                        :
                        <div className="m-5">
                            <h3>Can't find what you are looking for?</h3>
                            {authState?.isAuthenticated ?
                                <>
                                    {authState.accessToken?.claims?.userType === 'admin' ?                                
                                    <Link type="button" className="btn main-color btn-lg text-white"
                                    to='/admin'>Manage projects</Link>
                                    :
                                    <Link to='/messages' type='button' className="btn main-color btn-lg text-white">
                                        Inspect Projects
                                    </Link>
                                    }
                                </>
                                    :
                                    <Link className="btn main-color btn-lg text-white" to="/login">Loging</Link>
                                }
                        </div>   
                    }
                    {
                        totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}
import { Link } from "react-router-dom";

export const ExploreTopProjects = () => {
    return (
        <div className='p-5 mb-4 bg-dark header'>
             <div className="container-fluid py-5 text-white d-flex justify-content-center
             align-items-center">

                <div>
                    <h1 className="display-5 fw-bold">
                        Seamless inspection of construction projects
                    </h1>
                    <p className="col md-8 fs-4">Roads and Utilities are the main focus here.</p>
                    <Link type='button' className="btn main-color btn-lg text-white" 
                    to="/search">Explore top Constructions</Link>
                </div>
             </div>
        </div>
    );
}
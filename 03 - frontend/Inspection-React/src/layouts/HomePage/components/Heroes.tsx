import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";
export const Heros = () => {

    const { authState } = useOktaAuth();

    return (
        <div>
            <div className="d-none d-lg-block">
                <div className="row g-0 mt-5">
                    <div className="col-sm-6 col-md-6">
                        <div className="col-image-left"></div>
                    </div>

                    <div className="col-4 col-md-4 container d-flex 
                    justify-content-center align-items-center">
                        <div className="ml-2">
                            <h1>Project Manager or Inspector?</h1>
                            <p className="lead">
                                Both past and ongoing construction projects are hosted on this system
                                for real-time follow up. Stakeholders of each projects have the opportunity to
                                cooperate to deliver projects in time.
                            </p>
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
                    </div>
                </div>

                <div className="row g-0">
                     <div className="col-4 col-md-4 container d-flex 
                     justify-content-center align-items-center">
                            <div className="ml-2">
                                <h1>The City of Kigali constructions are fast paced</h1>
                                <p className="lead">
                                    Keep up reglarly with the changes in state of the ongoing projects from this system. 
                                    All progresses of construction are uploaded in time by instructors for officers of the city of Kigali 
                                    to make informed decisions. 
                                </p>
                            </div>
                     </div>
                     <div className="col-sm-6 col-md-6">
                        <div className="col-image-right">

                        </div>
                     </div>
                </div>
            </div>

            {/** Mobile Heroes*/}
            <div className="d-lg-none">
                <div className="container">
                    <div className="m-2">
                        <div className="col-image-left"></div>
                        <div className="mt-2">
                        <h1>Project Manager or Inspector?</h1>
                            <p className="lead">
                            Both past and ongoing construction projects are hosted on this system
                            for real-time follow up. Stakeholders of each projects have the opportunity to
                            cooperate to deliver projects in time.                            
                            </p>
                            {authState?.isAuthenticated ?
                                <Link type="button" className="btn main-color btn-lg text-white"
                                to='search'>Explore top projects</Link>
                                :
                                <Link className="btn main-color btn-lg text-white" to="/login"> Sign Up</Link>
                            }
                            
                      </div>
                    </div>
                    <div className="m-2">
                        <div className="col-image-right"></div>
                        <div className="mt-2">
                        <h1>The City of Kigali constructions are fast paced</h1>
                                <p className="lead">
                                Keep up reglarly with the changes in state of the ongoing projects from this system. 
                                All progresses of construction are uploaded in time by instructors for officers of the city of Kigali 
                                to make informed decisions. 
                                </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
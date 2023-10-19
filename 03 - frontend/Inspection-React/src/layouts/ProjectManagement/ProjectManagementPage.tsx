import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminMessages } from "./Components/AdminMessages";
import { AddNewProject } from "./Components/AddNewProject";


export const ProjectManagementPage = () => {
    const { authState } = useOktaAuth();
    const [messagesClick, setMessagesClick] = useState(false);
    
    const [ReportsClick, setReportsClickFunction] = useState(false);

    function addProjectClickFunction(){
       
        setMessagesClick(false);
        setReportsClickFunction(false);
    }
    
    function messagesClickFunction(){
        
        setMessagesClick(true);
        setReportsClickFunction(false);
    }

    function ReportsClickFunction() {
      
        setMessagesClick(false);
        setReportsClickFunction(true);
    }

    if (authState?.accessToken?.claims.userType !=="admin"){
        return <Redirect to='/home'/>
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Inspection Portal</h3>
                <nav>
                    <div className="nav nav-tabs" id='nav-tab' role='tablist'>

                        <button  onClick={addProjectClickFunction} className="nav-link active" id='nav-project-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-project' type="button" role='tab' aria-controls='nav-project'
                        aria-selected='false'>
                            Add new Project
                        </button>

                        <button  onClick={messagesClickFunction} className="nav-link" id='nav-messages-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-messages' type="button" role='tab' aria-controls='nav-messages'
                        aria-selected='false'>
                            Messages
                        </button>

                        {/* <button  onClick={ReportsClickFunction} className="nav-link" id='nav-reports-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-reports' type="button" role='tab' aria-controls='nav-reports'
                        aria-selected='false'>
                            Reports
                        </button> */}

                    </div>
                </nav>
                <div className="tab-content" id='nav-tabContent'>
                    
                    <div className="tab-pane fade show active" id='nav-project' role='tabpanel' aria-labelledby="nav-project-tab">
                         <AddNewProject/> 
                    </div>
                    

                    <div className="tab-pane fade" id='nav-messages' role='tabpanel' aria-labelledby="nav-messages-tab">
                        {messagesClick ? <AdminMessages/> : <></>} 
                    </div>

                    {/* <div className="tab-pane fade" id='nav-reports' role='tabpanel' aria-labelledby="nav-reports-tab">
                        {ReportsClick ? <AdminMessages/> : <></>} 
                    </div> */}
                </div>
            </div>
        </div>
    );
}
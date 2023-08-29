import { useState } from "react";
import { CaptureReport } from "./components/CaptureReport";

export const MainPage = () => {
    const [reportsClick, setReportsClick] = useState(false);
    const [historyClick, setHistoryClick] = useState(false);
    const projectId = (window.location.pathname).split('/')[2];
    
    return(
        <div className="container">
            <div className="mt-3 mb-2">
                <nav>
                    <div className="nav nav-tabs" id='nav-tab' role='tablist'>
                        <button onClick={() => {setReportsClick(false); setHistoryClick(false)}} className="nav-link active"
                        id="nav-send-report-tab" data-bs-toggle='tab' data-bs-target = '#nav-send-report'
                        type="button" role="tab" aria-controls="nav-send-report" aria-selected="true">
                            Submit Report
                        </button>

                        <button onClick={() => setReportsClick(true)} className="nav-link"
                        id="nav-response-tab" data-bs-toggle='tab' data-bs-target='#nav-response'
                        type="button" role='tab' aria-controls="nav-response" aria-selected='false'>
                            Q/A Response/Pending
                        </button>

                        <button onClick={() => setHistoryClick(true)} className="nav-link"
                        id="nav-history-tab" data-bs-toggle='tab' data-bs-target='#nav-history'
                        type="button" role='tab' aria-controls="nav-history" aria-selected='false'>
                            Inspection History
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-send-report" role="tabpanel"
                     aria-labelledby="nav-send-report-tab">
                        <CaptureReport projectId={projectId}/>
                    </div>
                    <div className="tab-pane fade" id='nav-response' role='tabpanel' aria-labelledby="nav-response-tab">
                        {reportsClick ? <>all messages</> : <></>}
                    </div>
                    <div className="tab-pane fade" id='nav-history' role='tabpanel' aria-labelledby="nav-history-tab">
                        {historyClick ? <>Inspection History</> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}
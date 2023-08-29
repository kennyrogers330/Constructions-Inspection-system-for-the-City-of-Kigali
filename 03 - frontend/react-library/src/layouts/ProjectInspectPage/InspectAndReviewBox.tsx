import { Link } from "react-router-dom"
import { LeaveAReview } from "../Utils/LeaveAReview"

export const InspectAndReviewBox: React.FC<{
    submitReview: any,
    isAuthenticated: any,
    isReviewLeft: boolean,
    mobile: boolean,
    projectId: number
}> = (props) => {

    function reviewRender(){
        if(props.isAuthenticated
            //  && !props.isReviewLeft
             ){
            return(
                <LeaveAReview submitReview={props.submitReview}/>
            )
        }
        // else if(props.isAuthenticated && props.isReviewLeft){
        //     return(<p>
        //             <b>Your Feedback was received. Thanks</b>
        //         </p>)
        // }
        return(
            <div>
                
                <p>Further inspection service requires you to be authenticated</p>
            </div>
        )
    }

    function buttonRender(){
        if(props.isAuthenticated){
            return (<Link to={`/message/${props.projectId}`} className="btn btn-success btn-md">Inspection Portal</Link>)
        }
        return (<Link to={'/login'} className="btn btn-success btn-md">Sign in</Link>)
    }
    
    return(
        <div className={props.mobile? 'd-flex mt-5' : 'col-3 container d-flex mb-5'}>
            <div className="container">
                {buttonRender()}
                <hr />                
                {reviewRender()}
            </div>
        </div>
        
    );
}
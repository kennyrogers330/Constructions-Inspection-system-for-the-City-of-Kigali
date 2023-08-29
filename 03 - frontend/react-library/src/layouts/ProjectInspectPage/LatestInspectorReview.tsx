import { Link } from "react-router-dom"
import InspectorReviewModel from "../../models/InspectorReviewModel"
import { InspectorReview } from "../Utils/InspectorReview"

export const LatestInspectorReview: React.FC<{
    inspectorReview: InspectorReviewModel[], projectId: number | undefined, mobile: boolean
}> = (props) => {
    return(
    
    <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
        <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
            <h2>Latest Reviews: </h2>
        </div>
        <div className="col-sm-10 col-md-10">
            {props.inspectorReview.length > 0  ?
                <>
                    {props.inspectorReview.slice(0,3).map(eachReview  => (
                        <InspectorReview review={eachReview} key={eachReview.id}/>
                    ))}

                    <div className="m-3">
                        <Link type='button' className='btn main-color btn-md text-white'
                        to={`/reviewList/${props.projectId}`}>Show more reviews</Link>
                    </div>
                </>
                :
                <div className="m-3">
                    <p className="lead">
                        Currently there are no reviews from inspectors.
                    </p>
                </div>
            }
        </div>
    </div>
    
    )
}
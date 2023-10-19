import { useState } from 'react';
import { StarsReview } from './StarsReview';
export const LeaveAReview: React.FC<{ submitReview: any }> = (props) =>{    
    
    const [starInput, setStarInput] = useState(0);
    const [displayInput, setDisplayInput] = useState(false);
    const [reviewDescription, setReviewDescription] = useState('');

    function startValue(value: number){
        setStarInput(value);
        setDisplayInput(true);
    }
    return (
        <div className='dropdown' style={{ cursor: 'pointer' }}>
             <h5 className='dropdown-toggle' id='dropdownMenuButton1' 
             data-bs-toggle='dropdown'>
                Rate and Comment?
             </h5>
             <ul className="dropdown-menu" id='submitReviewRating'
             aria-labelledby='dropdownMenuButton1'>
                <li><button onClick={() => startValue(0)} className='dropdown-item' type="button">0 star</button></li>
                <li><button onClick={() => startValue(.5)} className='dropdown-item' type="button">.5 star</button></li>
                <li><button onClick={() => startValue(1)} className='dropdown-item' type="button">1 star</button></li>
                <li><button onClick={() => startValue(1.5)} className='dropdown-item' type="button">1.5 star</button></li>
                <li><button onClick={() => startValue(2)} className='dropdown-item' type="button">2 star</button></li>
                <li><button onClick={() => startValue(2.5)} className='dropdown-item' type="button">2.5 star</button></li>
                <li><button onClick={() => startValue(3)} className='dropdown-item' type="button">3 star</button></li>
                <li><button onClick={() => startValue(3.5)} className='dropdown-item' type="button">3.5 star</button></li>
                <li><button onClick={() => startValue(4)} className='dropdown-item' type="button">4 star</button></li>
                <li><button onClick={() => startValue(4.5)} className='dropdown-item' type="button">4.5 star</button></li>
                <li><button onClick={() => startValue(5)} className='dropdown-item' type="button">5 star</button></li>
             </ul>
             <StarsReview Rating={starInput} size={32}/>
        
        {displayInput && (
             <div>
                <hr />
                <div className='mb-3'>
                    <label className='form-label'>
                        Comment
                    </label>
                    <textarea className='form-control' id='submitReviewDescription' 
                    placeholder='Optional' rows={3} onChange={e => setReviewDescription(e.target.value)} value={reviewDescription}>

                    </textarea>
                </div>

                <div>
                    <button type='button'  onClick={() => {props.submitReview(starInput, reviewDescription); setStarInput(0); setReviewDescription(''); }} className='btn btn-primary mt-3'>Submit Review</button>
                </div>
            </div>
        )}
        </div>
    );
};
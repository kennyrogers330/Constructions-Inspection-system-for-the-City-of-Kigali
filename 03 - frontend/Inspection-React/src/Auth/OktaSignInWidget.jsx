import { useEffect, useRef } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { oktaConfig } from '../lib/oktaConfig';
//import './OktaSignInWidget.css'; // Import the CSS file

const OktaSignInWidget = ({ onSuccess, onError }) => {
    const widgetRef = useRef();

    useEffect(() => {
        if (!widgetRef.current){
            return false;
        }
        const widget = new OktaSignIn(oktaConfig);
        widget.showSignInToGetTokens({
            el: widgetRef.current,
        }).then(onSuccess).catch(onError);

        return () => widget.remove();
     }, [onSuccess, onError]);
     
     const inlineStyles = {
        color: 'blue',
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
       
    };

     
     return (
        <>        
                <div className='col-image' style={inlineStyles}>  
                    <div ref={widgetRef}>
                            
                    </div>                         
                </div>            
        </>
        
     );
};

export default OktaSignInWidget


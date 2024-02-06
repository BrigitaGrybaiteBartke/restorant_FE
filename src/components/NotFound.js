import React from 'react';

const NotFound = () => {
    return (
        <>
            <div className="container flex-column d-flex align-items-center mt-5">
                <div className="mt-5 text-center">
                    <span className="text-center text-secondary">404 error. </span>
                    <span className="text-secondary">That's all we know.</span>
                </div>
                <div className="mt-5">
                    <a href="./" className='btn btn-light me-2'>Back to Home page</a>
                </div>
            </div>
        </>
    );
};

export default NotFound;

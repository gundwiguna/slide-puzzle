import React from 'react';
import { Button } from 'react-bootstrap';
import './share.css';

function ShareButtons({callback, closeCallback, active}) {
    return (
        <div className={`share-buttons-container ${active ? 'enter' : ''} py-3 px-4`}>
            <div className='close-share' onClick={closeCallback}>x</div>
            <div className='d-flex align-items-center justify-content-center'>
                <div>
                    You just won the game!
                    Share with friends!
                </div>
                <div className='ms-2'>
                    <Button onClick={callback} type='outline' color='primary' size='sm'>Share Image</Button>
                </div>
            </div>
        </div>
    );
}

export default ShareButtons;
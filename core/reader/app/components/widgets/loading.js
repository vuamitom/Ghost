import React, { Component } from 'react';

function Loading() {
    return (<div className='ember-load-indicator'>
      <div className='gh-loading-content'>
          <div className='gh-loading-spinner'></div>
      </div>
    </div>)
}

export default Loading;
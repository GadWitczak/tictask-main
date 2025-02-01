import React from 'react'
import './pop_up.css'
export default function Pop_up(props) {
  return(props.trigger) ? (
 <div className='pop-up'>
    <div className='pop-inner'>

<button>Close</button>
{props.children}
    </div>
 </div>

):"";
}

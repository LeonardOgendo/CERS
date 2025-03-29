import { useNavigate } from "react-router-dom";

export default function Content() {
  const navigate = useNavigate();

  return (
    <div className="dash-container">
      <div className='box-1'>
        <div onClick={() => navigate('emergency/report')} className='p-3 rounded'>
          <p className='fw-bold'>Report Emergency</p>
        </div>
        <div onClick={() => navigate('emergency/status')} className='p-3 rounded'>
          <p className='fw-bold'>Track Response status</p>
        </div>
        <div onClick={() => navigate('emergency/flagged-areas')} className='p-3 rounded'>
          <p className="fw-bold">View Flagged Area</p>
        </div>
        <div onClick={() => navigate('emergency/list')} className='p-3 rounded'>
          <p className="fw-bold">Incident History</p>
        </div>
      </div>
    </div>
  );
}
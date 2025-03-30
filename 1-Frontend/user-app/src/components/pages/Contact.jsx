
export default function Contact(){

    return(
        <>
    <div className="container-fluid login d-flex">
      <div className="row">
        <div className="col-md-6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Contact Illustration"
          />
        </div>

        <div className="col-md-6">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <h5 className="fs-4 mb-4 me-3 text-danger login-header">Contact Us</h5>
          </div>

          <input className='form-control mb-4' type='text' placeholder='Name' />
          
          <input className='form-control mb-4' type='text' placeholder='phone no.' />

          <input className='form-control mb-4' type='email' placeholder='Email address' />

          <input className='form-control mb-4' type='text' placeholder='Subject' />

          <textarea className='form-control mb-4' rows='3' placeholder='Message'></textarea>

          <div className="text-center text-md-start mt-4 pt-2">
            <button className='btn btn-danger custom-btn' style={{ width: "100%" }}>Send</button>
          </div>
        </div>
      </div>
    </div>
            
        </>
    )
}
/* eslint-disable no-unused-vars */
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

function App() {


 const [inputs, setInputs] = useState({});
 const [ imgUrl ,setImgUrl]=useState();
 const [imgData,setImgData]=useState();
 
  const handleChange = (event) => {
    
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
    console.log(inputs)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    window.localStorage.setItem('movieData', JSON.stringify(inputs));
  }
  let base64String = "";
  const imageUploaded = () => {
    let file = document.querySelector(
        'input[type=file]')['files'][0];

    let reader = new FileReader();
    reader.onload = function () {
        base64String = reader.result;
       // console.log(base64String);
       setInputs((prev)=>{
        prev={...prev,"poster":base64String};
        return prev;
       })
       setImgData((prev)=>{
        return base64String;
      })
    }
   reader.readAsDataURL(file);
   

}

  return (
    <>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
       <label htmlFor="formFile" className="form-label">Default file input example</label>
       <input className="form-control" type="file" id="formFile" name='poster' onChange={imageUploaded}/>
       <div className='' >
        <img src={imgData} alt="" className='h-100px w-100px'/>
       </div>
      </div>
      <div className="mb-3">
        <label htmlFor="movie_name" className="form-label">Movie Name</label>
        <input type="text" className="form-control" id="movie_name" name="movie_name" value={inputs.movie_name || ""} 
        onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea className="form-control" id="description" rows="3" name="description" value={inputs.description || ""} 
        onChange={handleChange}></textarea>
      </div>
      <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default App

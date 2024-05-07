import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [repoUrl, setUrl] = useState('');
  const [formData, setFormData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [id,setId] = useState();
  const [status,setStatus]=useState("");
  const checkStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/status/?id=${id}`);
      const data = await response.json();
      setStatus(data.status);
      console.log(status)
      // If status is not "deployed", continue checking after a delay
      if (data.status !== 'deployed') {
        setTimeout(checkStatus, 1000); // Adjust delay as needed
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };
  useEffect(()=>{
    if (id){
      checkStatus();
    }
  },[id]);
 
  const handleChange = (event) => {
    const inputValue = event.target.value;
    setUrl(prevUrl => inputValue);
    // Check if the input value starts with "https://github.com/"
    setIsValid(inputValue.startsWith("https://github.com/"));
    // Function to send POST request
    
  };
  const handleSubmit = (event) => {
    
    // Set formData with any data you want to send
    const postData = async () => {
      try {
        const response = await fetch('http://localhost:3000/deploy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({repoUrl:repoUrl})
        });
        const data = await response.json();
        setId(data.id) // Handle response data
        
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Trigger postData function when formData changes
    
       postData();
    
    setIsValid(repoUrl.startsWith("https://github.com/"));
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Deploy your GitHub Repository</h2>
        <input
          type='text'
          value={repoUrl}
          onChange={handleChange} 
          placeholder="Enter GitHub repository URL"
        />
        
         {!isValid && <p style={{ color: 'red' }}>Input must start with "https://github.com/"</p>}
         {!(id) && isValid && <button onClick={handleSubmit}>Submit</button>}
         {(status === "deployed") && 
  <button onClick={() => window.open(`http://localhost:3001/index.html?id=${id}`, '_blank')}>
    {id}
  </button>
}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';

const styles ={
    container:{
        display:'flex', 
        justifyContent:'flex-end', 
        width:'80%', margin:'auto', 
        border:'1px solid lightgrey', 
        padding:'20px', gap:'20px', 
        flexDirection:'row',
    },
    listContainer:{
        display:'flex', 
        width:'80%', 
        margin:'10px auto', 
        border:'1px solid lightgrey', 
        padding:'20px', 
        gap:'20px', 
        flexDirection:'row', 
        justifyContent:'flex-start', 
        flexWrap:'wrap',
    },
    listContentsContainer:{
        width: '200px', 
        display:'flex', 
        flexDirection:'column', 
        margin:'10px auto', 
        border:'1px solid lightgrey', 
        cursor:'pointer', 
        justifyContent:'flex-start'
    },
    buttons:{
        width:'100px',
         padding:'10px'
    },
    inputs:{
        width:'250px', 
        padding:'10px'
    },
    items:{
     textAlign:'center'
    },
}

const ArtistsList = () => {
    const [searchTerm, setSearchTerm] = useState('Love');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchResults();
    }, []);
  
    const fetchResults = () => {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const url = `https://api.deezer.com/search?q=${encodedSearchTerm}&output=jsonp&callback=handleResponse`;
  
      const script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);
  
      window.handleResponse = (data) => {
        setResponseData(data);
      };
  
      script.onerror = (error) => {
        setError(error);
      };
    };
  
    const handleSearch = () => {
      fetchResults();
    };
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }
  
    if (!responseData) {
      return (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <div>Loading...</div>
        </div>
      );
    }
  
    const results = responseData.data || [];
    const sortedData = [...results].sort((a,b)=>b.rank-a.rank)
  return (
    <>
    <div>
       <div style={styles.container}>
       <div><input
        type="text"
        value={searchTerm}
        style={styles.inputs}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch} style={styles.buttons}>Search</button></div> </div>
      <div style={styles.listContainer}>
      {sortedData.map((result, index) => (
        <div key={result.id} style={styles.listContentsContainer} onClick={()=>setSearchTerm(result.artist.name)}>
          <div style={{...styles.items, margin:'20px auto'}}>{result.title}</div>
           <div style={{margin:'auto'}}><img src={result.album.cover} alt={result.title} /></div>
           <div style={styles.items}>Artist: {result.artist.name}</div>
           <div style={styles.items}>Duration: {Math.floor(result.duration/60)}:{(result.duration%60).toString().padStart(2, '0')}</div>
           <div style={{...styles.items, margin:'10px auto'}}>Rank: {result.rank}</div>
        </div>
      ))}
      </div>
    </div>
    </>
  )
}

export default ArtistsList
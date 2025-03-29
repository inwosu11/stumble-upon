import { useState, useEffect } from 'react';

const Discover = () => {
  const [data, setData] = useState(null);
  const [banList, setBanList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1");
      const json = await response.json();
      const catData = json[0];

      // Attributes to check against the ban list
      const breed = catData.breeds[0].name;
      const origin = catData.breeds[0].origin;
      const temperament = catData.breeds[0].temperament;

      // If the fetched data has any banned attribute, fetch again
      if (banList.includes(breed) || banList.includes(origin) || banList.includes(temperament)) {
        return fetchData();
      }

      setData(catData);
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [banList]);

  const handleBanList = (attribute) => {
    setBanList((prevBanList) => {
      if (prevBanList.includes(attribute)) {
        // Remove if already in banList
        return prevBanList.filter((item) => item !== attribute);
      } else {
        // Add if not already in banList
        return [...prevBanList, attribute];
      }
    });
  };

  return (
    <div>
      <button onClick={fetchData}>Discover New Item</button>

      {data && data.breeds && (
        <div>
          <img src={data.url} alt="Random item" width={300} />

          <p onClick={() => handleBanList(data.breeds[0].name)} style={{ cursor: 'pointer' }}>
            Breed: {data.breeds[0].name}
          </p>
          <p onClick={() => handleBanList(data.breeds[0].origin)} style={{ cursor: 'pointer' }}>
            Origin: {data.breeds[0].origin}
          </p>
          <p onClick={() => handleBanList(data.breeds[0].temperament)} style={{ cursor: 'pointer' }}>
            Temperament: {data.breeds[0].temperament}
          </p>
        </div>
      )}

      {/* Ban List Display */}
      <div>
        <h3>Ban List (click to remove):</h3>
        {banList.map((item) => (
          <span
            key={item}
            onClick={() => handleBanList(item)}
            style={{
              display: 'inline-block',
              backgroundColor: '#ffcccc',
              padding: '4px',
              margin: '2px',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Discover;

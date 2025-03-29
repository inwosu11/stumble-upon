import { useState, useEffect } from 'react';

const Discover = () => {
  const [data, setData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1", {
        headers: {
          "x-api-key": import.meta.env.VITE_CAT_API_KEY, // Use environment variable
        },
      });
      const json = await response.json();
      console.log(json); // Debugging: Check the API response structure
      const catData = json[0];

      if (!catData || !catData.breeds || catData.breeds.length === 0) {
        console.warn("No breeds data found in the API response.");
        setData(null);
        return;
      }

      const breed = catData.breeds[0].name;
      const origin = catData.breeds[0].origin;
      const temperament = catData.breeds[0].temperament;

      if (banList.includes(breed) || banList.includes(origin) || banList.includes(temperament)) {
        return fetchData();
      }

      setData(catData);
    } catch (error) {
      console.error("API fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [banList]);

  const handleBanList = (attribute) => {
    setBanList((prevBanList) =>
      prevBanList.includes(attribute)
        ? prevBanList.filter((item) => item !== attribute)
        : [...prevBanList, attribute]
    );
  };

  const styles = {
    banItem: {
      display: 'inline-block',
      backgroundColor: '#ffcccc',
      padding: '4px',
      margin: '2px',
      cursor: 'pointer',
      borderRadius: '4px',
    },
    clickableText: {
      cursor: 'pointer',
    },
  };

  return (
    <div>
      <button onClick={fetchData} aria-label="Discover a new item">
        {loading ? 'Loading...' : 'Discover New Item'}
      </button>

      {data && data.breeds ? (
        <div>
          <img src={data.url} alt="Random item" width={300} />
          <p onClick={() => handleBanList(data.breeds[0].name)} style={styles.clickableText}>
            Breed: {data.breeds[0].name}
          </p>
          <p onClick={() => handleBanList(data.breeds[0].origin)} style={styles.clickableText}>
            Origin: {data.breeds[0].origin}
          </p>
          <p onClick={() => handleBanList(data.breeds[0].temperament)} style={styles.clickableText}>
            Temperament: {data.breeds[0].temperament}
          </p>
        </div>
      ) : (
        <p>No data available. Try again.</p>
      )}

      <div>
        <h3>Ban List (click to remove):</h3>
        {banList.map((item) => (
          <span
            key={item}
            onClick={() => handleBanList(item)}
            style={styles.banItem}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Discover;

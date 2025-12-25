import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";
function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const navigation = useNavigate();
  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigation("form");
      }}
    >
      <h1>Map</h1>
      <h1>
        Postion: {lat}, {lng}
      </h1>
      <button
        onClick={() => {
          setSearchParams({ lat: 23, lng: 50 });
        }}
      >
        Change pos
      </button>
    </div>
  );
}

export default Map;

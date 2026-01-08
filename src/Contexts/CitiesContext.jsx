import { createContext, useReducer, useEffect, useContext } from "react";
const BASE_URL = "http://localhost:3000";
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "cities/get":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };

    case "cities/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };

    case "cities/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error(`Unhandled action type`);
  }
}
const CitiesContext = createContext();
function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data.",
        });
      }
    }
    fetchCities();
  }, []);
  async function getCity(id) {
    if (Number(id) === currentCity?.id) return;
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();
      dispatch({ type: "cities/get", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error getting Current City.",
      });
    }
  }
  async function CreateCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch({ type: "cities/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city.",
      });
    }
  }
  async function DeleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cities/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city.",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        CreateCity,
        DeleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };

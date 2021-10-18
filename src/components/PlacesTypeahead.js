import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.min.css";

const LIMIT = 30;
const SEARCH_URI = "https://api.api-ninjas.com/v1/city";

export default function PlacesTypeahead(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleSearch = query => {
    setIsLoading(true);
    fetch(`${SEARCH_URI}?name=${escape(query)}&limit=${LIMIT}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": props.apiKey
      }
    })
    .then(resp => resp.json())
    .then(data => {
      setIsLoading(false);
      setOptions(data && !data.error ? data.map(city => {
        return city.name + ", " + city.country;
      }) : []);
    });
  };

  const handleChange = selected => {
    setSelected(selected);
    props.onChange(selected);
  };

  return (
    <AsyncTypeahead
      id="places-typeahead"
      minLength={1}
      delay={200}
      useCache
      onSearch={handleSearch}
      onChange={handleChange}
      selected={selected}
      options={options}
      placeholder="Enter City Name..."
      isLoading={isLoading}
    />
  );
}
import React from "react";

const initConfig = {
  endpoint: null,
  headers: null,
  method: null,
};

const initState = {
  status: "idle",
  error: null,
  data: null,
};

const useFetch = () => {
  const [config, setConfig] = React.useState(initConfig);
  const [state, setState] = React.useState(initState);

  const fetchRequest = React.useCallback(async () => {
    try {
      const response = await fetch(config.endpoint, {
        method: config.method,
        headers: config.headers,
      });
      const data = await response.json();

      setState({
        status: "success",
        error: null,
        data,
      });
    } catch (e) {
      console.log("Request failed: ", e);
      setState({
        status: "error",
        error: e.message,
        data: null,
      });
    }
  }, [config]);

  const refetch = (endpoint, method, headers) => {
    setConfig({
      endpoint,
      method,
      headers,
    });

    setState({
      status: "loading",
      error: null,
      data: null,
    });
  };

  React.useEffect(() => {
    if (state.status === "loading") fetchRequest();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, state.status]);

  return [state, refetch];
};

export default useFetch;
